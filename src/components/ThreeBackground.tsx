import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SplatMesh } from '@sparkjsdev/spark';

const USE_PLY_SPLAT = false;

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.Camera | null = null;
    let splat: SplatMesh | null = null;
    let object: THREE.Group | null = null;
    let planes: THREE.Plane[] = [];
    let planeObjects: THREE.Mesh[] = [];

    const setFallback = (message: string) => {
      mount.classList.add('three-fallback');
      mount.innerHTML =
        `<div style="color:#b8d7e6;font-family:Inter, sans-serif;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;position:absolute;bottom:16px;left:20px;opacity:0.7;">${message}</div>`;
    };

    const createRenderer = () => {
      const contextAttributes: WebGLContextAttributes = {
        antialias: true,
        alpha: true,
        stencil: true,
        depth: true,
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
      };

      try {
        const canvas = document.createElement('canvas');
        const context =
          (canvas.getContext('webgl2', contextAttributes) as WebGL2RenderingContext | null) ||
          (canvas.getContext('webgl', contextAttributes) as WebGLRenderingContext | null) ||
          (canvas.getContext('experimental-webgl', contextAttributes) as WebGLRenderingContext | null);

        if (!context) {
          return null;
        }

        return new THREE.WebGLRenderer({
          canvas,
          context,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: true,
        });
      } catch (error) {
        return null;
      }
    };

    renderer = createRenderer();

    if (!renderer) {
      setFallback('WebGL unavailable in this browser');
      return;
    }

    const hasStencil = Boolean(renderer.getContext().getContextAttributes()?.stencil);
    rendererRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1);
    renderer.localClippingEnabled = hasStencil;
    mount.classList.remove('three-fallback');
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    const createPlaneStencilGroup = (
      geometry: THREE.BufferGeometry,
      plane: THREE.Plane,
      renderOrder: number
    ) => {
      const group = new THREE.Group();
      const baseMat = new THREE.MeshBasicMaterial();
      baseMat.depthWrite = false;
      baseMat.depthTest = false;
      baseMat.colorWrite = false;
      baseMat.stencilWrite = true;
      baseMat.stencilFunc = THREE.AlwaysStencilFunc;

      const mat0 = baseMat.clone();
      mat0.side = THREE.BackSide;
      mat0.clippingPlanes = [plane];
      mat0.stencilFail = THREE.IncrementWrapStencilOp;
      mat0.stencilZFail = THREE.IncrementWrapStencilOp;
      mat0.stencilZPass = THREE.IncrementWrapStencilOp;

      const mesh0 = new THREE.Mesh(geometry, mat0);
      mesh0.renderOrder = renderOrder;
      group.add(mesh0);

      const mat1 = baseMat.clone();
      mat1.side = THREE.FrontSide;
      mat1.clippingPlanes = [plane];
      mat1.stencilFail = THREE.DecrementWrapStencilOp;
      mat1.stencilZFail = THREE.DecrementWrapStencilOp;
      mat1.stencilZPass = THREE.DecrementWrapStencilOp;

      const mesh1 = new THREE.Mesh(geometry, mat1);
      mesh1.renderOrder = renderOrder;
      group.add(mesh1);

      return group;
    };

    const initTorusScene = (useStencil: boolean) => {
      const CAM_AMOUNT = 4.0;
      const aspect = window.innerWidth / window.innerHeight;
      const width = (window.innerWidth / CAM_AMOUNT) * window.devicePixelRatio;
      const height = (window.innerHeight / CAM_AMOUNT) * window.devicePixelRatio;

      const cameras: THREE.PerspectiveCamera[] = [];
      for (let y = 0; y < CAM_AMOUNT; y++) {
        for (let x = 0; x < CAM_AMOUNT; x++) {
          const subcamera = new THREE.PerspectiveCamera(11 - (y / CAM_AMOUNT), aspect, 0.1, 100);
          subcamera.viewport = new THREE.Vector4(
            Math.floor(x * width),
            Math.floor(y * height),
            Math.ceil(width),
            Math.ceil(height)
          );
          subcamera.position.x = 3 - x / CAM_AMOUNT;
          subcamera.position.y = 7 + 1.2 * x + y / 3;
          subcamera.position.z = 1.9 + 0.8 * x + y * 3;
          subcamera.position.multiplyScalar(1 + 0.1 * x);
          const yp = -1 + y / CAM_AMOUNT;
          subcamera.lookAt(0, yp, 0);
          subcamera.updateMatrixWorld();
          cameras.push(subcamera);
        }
      }

      const arrayCamera = new THREE.ArrayCamera(cameras);
      arrayCamera.position.z = 2;
      camera = arrayCamera;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene?.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 7);
      dirLight.position.set(1, 10, 9.5);
      dirLight.castShadow = false;
      scene?.add(dirLight);

      const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 100);
      object = new THREE.Group();
      scene?.add(object);

      if (useStencil) {
        planes = [
          new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
          new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
          new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
        ];

        const planeHelpers = planes.map((plane) => new THREE.PlaneHelper(plane, 2, 0xffffff));
        planeHelpers.forEach((helper) => {
          helper.visible = false;
          scene?.add(helper);
        });

        const planeGeom = new THREE.PlaneGeometry(4, 4);
        planeObjects = [];

        for (let i = 0; i < 3; i++) {
          const poGroup = new THREE.Group();
          const plane = planes[i];
          const stencilGroup = createPlaneStencilGroup(geometry, plane, i + 1);

          const planeMat = new THREE.MeshStandardMaterial({
            color: 0x48bfe3,
            metalness: 0.9,
            roughness: 0,
            clippingPlanes: planes.filter((p) => p !== plane),
            stencilWrite: true,
            stencilRef: 0,
            stencilFunc: THREE.NotEqualStencilFunc,
            stencilFail: THREE.ReplaceStencilOp,
            stencilZFail: THREE.ReplaceStencilOp,
            stencilZPass: THREE.ReplaceStencilOp,
          });
          const po = new THREE.Mesh(planeGeom, planeMat);
          po.onAfterRender = function (rendererInstance: THREE.WebGLRenderer) {
            rendererInstance.clearStencil();
          };
          po.renderOrder = i + 1.25;

          object.add(stencilGroup);
          poGroup.add(po);
          planeObjects.push(po);
          scene?.add(poGroup);
        }

        const material = new THREE.MeshStandardMaterial({
          color: 0xfa00cc0,
          metalness: 0.68,
          roughness: 0.54,
          clippingPlanes: planes,
          clipShadows: true,
          shadowSide: THREE.DoubleSide,
        });

        const clippedColorFront = new THREE.Mesh(geometry, material);
        clippedColorFront.castShadow = true;
        clippedColorFront.renderOrder = 6;
        object.add(clippedColorFront);

        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(9, 9, 1, 1),
          new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.25, side: THREE.DoubleSide })
        );
        ground.rotation.x = -Math.PI / 3;
        ground.position.y = -1;
        ground.receiveShadow = true;
        scene?.add(ground);
      } else {
        planeObjects = [];
        const material = new THREE.MeshStandardMaterial({
          color: 0x48a003,
          metalness: 0.65,
          roughness: 0.3,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = false;
        object.add(mesh);
      }
    };

    const initSplatScene = () => {
      const perspectiveCamera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.01,
        100
      );
      perspectiveCamera.position.set(0, 0.2, 3.2);
      camera = perspectiveCamera;

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene?.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(2, 3, 4);
      scene?.add(dirLight);

      splat = new SplatMesh({ url: '/images/7th.ply' });
      splat.position.set(0, -0.2, 0);
      splat.scale.set(1, 1, 1);
      scene?.add(splat);
    };

    if (USE_PLY_SPLAT) {
      initSplatScene();
    } else {
      initTorusScene(hasStencil);
    }

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (USE_PLY_SPLAT) {
        if (splat) {
          splat.rotation.y += 0.004;
        }
      } else if (object) {
        object.rotation.x -= 0.0024;
        object.rotation.y += 0.0016;
        object.rotation.z -= 0.004;
        for (let i = 0; i < planeObjects.length; i++) {
          const plane = planes[i];
          const po = planeObjects[i];
          plane.coplanarPoint(po.position);
          po.lookAt(
            po.position.x - plane.normal.x,
            po.position.y - plane.normal.y,
            po.position.z - plane.normal.z
          );
        }
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const onWindowResize = () => {
      if (!renderer || !camera) return;
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } else if (camera instanceof THREE.ArrayCamera) {
        const CAM_AMOUNT = 4.2;
        const aspect = window.innerWidth / window.innerHeight;
        const width = (window.innerWidth / CAM_AMOUNT) * window.devicePixelRatio;
        const height = (window.innerHeight / CAM_AMOUNT) * window.devicePixelRatio;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        for (let y = 0; y < CAM_AMOUNT; y++) {
          for (let x = 0; x < CAM_AMOUNT; x++) {
            const subcamera = camera.cameras[CAM_AMOUNT * y + x] as THREE.PerspectiveCamera | undefined;
            if (!subcamera) continue;
            if (!subcamera.viewport) {
              continue;
            }
            subcamera.viewport.set(
              Math.floor(x * width),
              Math.floor(y * height),
              Math.ceil(width),
              Math.ceil(height)
            );
            subcamera.aspect = aspect;
            subcamera.updateProjectionMatrix();
          }
        }
      }
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    animate();
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && mount.contains(rendererRef.current.domElement)) {
        mount.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (scene) scene.clear();
    };
  }, []);

  return (
    <div
      id="three-js-scene"
      ref={mountRef}
      className="three-js-scene"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
      }}
    />
  );
};

export default ThreeBackground;