
//document.addEventListener("DOMContentLoaded", function () {
import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const settings = {
    speed: 0.2,
    density: 1.8,
    strength: 1.2,
    frequency: 1.0,
    amplitude: 1.8,
    intensity: 1.7,
    phase: 1.1
};

const noise = 
`
  // GLSL textureless classic 3D noise "cnoise",
  // with an RSL-style periodic variant "pnoise".
  // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
  // Version: 2011-10-11
  //
  // Many thanks to Ian McEwan of Ashima Arts for the
  // ideas for permutation and gradient selection.
  //
  // Copyright (c) 2011 Stefan Gustavson. All rights reserved.
  // Distributed under the MIT license. See LICENSE file.
  // https://github.com/ashima/webgl-noise
  //

  vec3 mod289(vec3 x)
  {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
  return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
  return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep)
  {
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
  }
`;

const rotation = 
`
  mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);

  return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
  );
  }
  
  vec3 rotateY(vec3 v, float angle) {
  return rotation3dY(angle) * v;
  }  
`;

const vertexShader = 
`  
  varying vec2 vUv;
  varying float vDistort;
  
  uniform float uTime;
  uniform float uSpeed;
  uniform float uNoiseDensity;
  uniform float uNoiseStrength;
  uniform float uFrequency;
  uniform float uAmplitude;
  
  ${noise}
  
  ${rotation}
  
  void main() {
      vUv = uv;
      
      float t = uTime * uSpeed;
      float distortion = pnoise((normal + t) * uNoiseDensity, vec3(10.0)) * uNoiseStrength;
  
      vec3 pos = position + (normal * distortion);
      float angle = sin(uv.y * uFrequency + t) * uAmplitude;
      pos = rotateY(pos, angle);    
      
      vDistort = distortion;
  
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  }  
`;

const fragmentShader = 
`
  varying vec2 vUv;
  varying float vDistort;
  
  uniform float uTime;
  uniform float uIntensity;
  
  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
  }     
  
  void main() {
  float distort = vDistort * uIntensity;
      
      vec3 brightness = vec3(0.2, .45, 0.5);
      vec3 contrast = vec3(0.4, 0.5, 0.6);
      vec3 oscilation = vec3(1.0, 1.0, 1.0);
      float py = ${settings.phase};
      py += 0.2 * sin(uTime / 2.0);
      vec3 phase = vec3(0.2, py, 0.2);
      
      vec3 color = cosPalette(distort, brightness, contrast, oscilation, phase);
      
      gl_FragColor = vec4(color, 1.0);
  }  
`;

class Scene {

    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor("black", 0);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.controls = new OrbitControls(
            this.camera,
            document.getElementsByClassName("intro")[0]
            );
            this.controls.enableZoom = false;
            this.controls.autoRotate = false;
            this.controls.enableDamping = true;

      
        this.camera.position.set(0, 0, 19);

        this.scene = new THREE.Scene();

        this.clock = new THREE.Clock();

        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );

        // const effect1 = new ShaderPass( DotScreenShader );
        // effect1.uniforms[ 'scale' ].value = 8;
        // this.composer.addPass( effect1 );

        // const effect2 = new ShaderPass( RGBShiftShader );
        // effect2.uniforms[ 'amount' ].value = 0.0005;
        // this.composer.addPass( effect2 );

        // const effect3 = new OutputPass();
        // //effect3.uniforms[ 'amount' ].value = 0.5;
        // this.composer.addPass( effect3 );

        this.init();
        this.animate();
    }

    add3DModels(){

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(directionalLight);
        const loader = new GLTFLoader();

        loader.load( 'static/brain.glb', ( gltf ) => {
            gltf.scene.scale.set(10, 10, 10); 
            gltf.scene.rotation.y = Math.PI / 2;
            this.scene.add( gltf.scene );

            // Create two collision zones
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const boxHelper = new THREE.Box3Helper(box, 0xff0000); // Render the box in red
            //this.scene.add(boxHelper);
            
            this.leftZone = new THREE.Box3(
                new THREE.Vector3(box.min.x, box.min.y, box.min.z), 
                new THREE.Vector3(box.x, box.max.y, box.max.z)
            );
            
            this.rightZone = new THREE.Box3(
                new THREE.Vector3(box.x, box.min.y, box.min.z), 
                new THREE.Vector3(box.max.x, box.max.y, box.max.z)
            );

            // Create helper objects for the collision zones to make them visible
            const leftZoneHelper = new THREE.Box3Helper(this.leftZone, 0xffff00);
            const rightZoneHelper = new THREE.Box3Helper(this.rightZone, 0x00ff00);

            // Add the helper objects to the scene
            this.scene.add(leftZoneHelper);
            this.scene.add(rightZoneHelper);
            

        }, undefined, function ( error ) {
        
            console.error( error );
        });
        
      
    }


    init() {
        this.addCanvas();
        this.addElements();
        this.add3DModels();
        this.addEvents();
    }

    addCanvas() {
        const canvas = this.renderer.domElement;
        canvas.classList.add("webgl");
        document.getElementsByClassName("sphere")[0].appendChild(canvas);
    }

    addElements() {

        // const mesh = new THREE.Mesh(
        //     new THREE.SphereGeometry( 10, 24, 16 ),
        //     new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
        // );
        // mesh.position.x = 15;
        // this.scene.add( mesh );

        // const mesh2 = new THREE.Mesh(
        //     new THREE.SphereGeometry( 10, 4, 8 ),
        //     new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
        // );
        // mesh2.position.y = -5;
        // mesh2.position.z = 10;
        // mesh.add( mesh2 );

        // const mesh3 = new THREE.Mesh(
        //     new THREE.SphereGeometry( 5, 16, 8 ),
        //     new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
        // );
        // mesh3.position.z = 10;
        // this.scene.add( mesh3 );

        // //

        // const geo = new THREE.BufferGeometry();
        // const vertices = [];

        // for ( let i = 0; i < 10000; i ++ ) {

        //     vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // x
        //     vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // y
        //     vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // z

        // }

        // geo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        // const particles = new THREE.Points( geo, new THREE.PointsMaterial( { color: 0x888888 } ) );
        // this.scene.add( particles );

    const geometry2 = new THREE.IcosahedronGeometry(20, 4);
    const mesh = new THREE.Mesh(
        geometry2,
        new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
    );
    //this.scene.add(mesh);

        const geometry = new THREE.IcosahedronGeometry(4, 64, 12);
        geometry.scale(1.4, .9, 1);
        const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: settings.speed },
            uNoiseDensity: { value: settings.density },
            uNoiseStrength: { value: settings.strength },
            uFrequency: { value: settings.frequency },
            uAmplitude: { value: settings.amplitude },
            uIntensity: { value: settings.intensity },
            wireframe: false
        }
        });
        this.mesh4 = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh4);
    }

    addEvents() {
        window.addEventListener("resize", this.resize.bind(this));
        document.addEventListener( "mousedown", this.click.bind(this));

    }

    click( event ) {
        event.preventDefault();

        // create a projector
        var projector = new THREE.Projector();
        var mouseVector = new THREE.Vector3();

        // convert the mouse position to a normalized vector
        mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
        mouseVector.y = 1 - 2 * ( event.clientY / window.innerHeight );

        // create a Ray from the camera to the mouse position
        var raycaster = projector.pickingRay( mouseVector.clone(), this.camera );

        // get the list of objects the ray intersected
        const intersectsLeft = raycaster.intersectObjects(this.leftZone);
        const intersectsRight = raycaster.intersectObjects(this.rightZone);

        if (intersectsLeft.length > 0) {
            console.log('left');
        } else if (intersectsRight.length > 0) {
            console.log('right');
        }
    }

    resize() {
        let width = window.innerWidth;
        let height = window.innerHeight;

        this.camera.aspect = width / height;
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);

        this.camera.updateProjectionMatrix();

    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.composer.render();
    }

    render() {
        this.controls.update();

        // Update uniforms
        this.mesh4.material.uniforms.uTime.value = this.clock.getElapsedTime();
        this.mesh4.material.uniforms.uSpeed.value = settings.speed;
        this.mesh4.material.uniforms.uNoiseDensity.value = settings.density;
        this.mesh4.material.uniforms.uNoiseStrength.value = settings.strength;
        this.mesh4.material.uniforms.uFrequency.value = settings.frequency;
        this.mesh4.material.uniforms.uAmplitude.value = settings.amplitude;
        this.mesh4.material.uniforms.uIntensity.value = settings.intensity;
        this.renderer.render(this.scene, this.camera);
    }
}



window.blobSettings = settings;
console.log("done");
let sphereScene = new Scene();


