import * as THREE from 'three';
// import { EffectComposer } from 'three/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// import { CopyShader } from 'three/addons/shaders/CopyShader.js';
// import BadTVShader from './BadTVShader.js';

let camera, scene, renderer, composer;
const CAM_AMOUNT = 3;


// let shaderTime = 0;
// let badTVPass;

let object;
let planes, planeObjects, planeHelpers;
let clock;
const params = {

    animate: true,
    planeX: {

        constant: 2.8,
        negated: false,
        displayHelper: false

    },
    planeY: {

        constant: 2.202,
        negated: false,
        displayHelper: false

    },
    planeZ: {

        constant: 3.9,
        negated: false,
        displayHelper: false

    }


};


init();
animate();

function createPlaneStencilGroup( geometry, plane, renderOrder ) {

    const group = new THREE.Group();
    const baseMat = new THREE.MeshBasicMaterial();
    baseMat.depthWrite = false;
    baseMat.depthTest = false;
    baseMat.colorWrite = false;
    baseMat.stencilWrite = true;
    baseMat.stencilFunc = THREE.AlwaysStencilFunc;

    // back faces
    const mat0 = baseMat.clone();
    mat0.side = THREE.BackSide;
    mat0.clippingPlanes = [ plane ];
    mat0.stencilFail = THREE.IncrementWrapStencilOp;
    mat0.stencilZFail = THREE.IncrementWrapStencilOp;
    mat0.stencilZPass = THREE.IncrementWrapStencilOp;

    const mesh0 = new THREE.Mesh( geometry, mat0 );
    mesh0.renderOrder = renderOrder;
    group.add( mesh0 );

    // front faces
    const mat1 = baseMat.clone();
    mat1.side = THREE.FrontSide;
    mat1.clippingPlanes = [ plane ];
    mat1.stencilFail = THREE.DecrementWrapStencilOp;
    mat1.stencilZFail = THREE.DecrementWrapStencilOp;
    mat1.stencilZPass = THREE.DecrementWrapStencilOp;

    const mesh1 = new THREE.Mesh( geometry, mat1 );
    mesh1.renderOrder = renderOrder;

    group.add( mesh1 );

    return group;

}


function init() {

    const ASPECT_RATIO = (window.innerWidth )/(window.innerHeight);

    const WIDTH =  window.innerWidth / CAM_AMOUNT * window.devicePixelRatio;
    const HEIGHT = window.innerHeight / CAM_AMOUNT * window.devicePixelRatio;

    const cameras = [];

    for ( let y = 0; y < CAM_AMOUNT; y++ ) {

        for ( let x = 0; x < CAM_AMOUNT; x++ ) {

            const subcamera = new THREE.PerspectiveCamera( 13 - (y/CAM_AMOUNT), ASPECT_RATIO, 0.1, 100 );
            subcamera.viewport = new THREE.Vector4( Math.floor( x * WIDTH ), Math.floor( y * HEIGHT ), Math.ceil( WIDTH ), Math.ceil( HEIGHT ) );
            subcamera.position.x = 4 - ( x / CAM_AMOUNT );
            subcamera.position.y = 4 + (.9 * x) + (y/3);
            subcamera.position.z = 1.5 + (.8 * x) + y*3;
            subcamera.position.multiplyScalar(1 + 0.1*x);
            let yp = -1 + (y / CAM_AMOUNT);
            subcamera.lookAt( 0, yp, 0 );
            subcamera.updateMatrixWorld();

            cameras.push( subcamera );
        }
    }

    camera = new THREE.ArrayCamera( cameras );
    camera.position.z = 2;

    clock = new THREE.Clock();

    scene = new THREE.Scene();



//    scene.add( new THREE.AmbientLight( 0xffffff, 1.5 ) );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 7 );
    dirLight.position.set( 1, 10, 9.5 );
    dirLight.castShadow = false;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.top	= 2;
    dirLight.shadow.camera.bottom = - 2;

    dirLight.shadow.mapSize.width = 256;
    dirLight.shadow.mapSize.height = 256;
    scene.add( dirLight );

    planes = [
        new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ), 0 ),
        new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0 ),
        new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ), 0 )
    ];

    planeHelpers = planes.map( p => new THREE.PlaneHelper( p, 2, 0xffffff ) );
    planeHelpers.forEach( ph => {

        ph.visible = false;
        scene.add( ph );

    } );

    const geometry = new THREE.TorusKnotGeometry( 1.5, 0.50, 100, 100 );
    object = new THREE.Group();
    scene.add( object );

    // Set up clip plane rendering
    planeObjects = [];
    const planeGeom = new THREE.PlaneGeometry( 4, 4 );

    for ( let i = 0; i < 3; i ++ ) {

        const poGroup = new THREE.Group();
        const plane = planes[ i ];
        const stencilGroup = createPlaneStencilGroup( geometry, plane, i + 1 );

        // plane is clipped by the other clipping planes
        const planeMat =
            new THREE.MeshStandardMaterial( {

                color: 0x48BFE3,
                metalness: 0.9,
                roughness: 0,
                clippingPlanes: planes.filter( p => p !== plane ),

                stencilWrite: true,
                stencilRef: 0,
                stencilFunc: THREE.NotEqualStencilFunc,
                stencilFail: THREE.ReplaceStencilOp,
                stencilZFail: THREE.ReplaceStencilOp,
                stencilZPass: THREE.ReplaceStencilOp,

            } );
        const po = new THREE.Mesh( planeGeom, planeMat );
        po.onAfterRender = function ( renderer ) {

            renderer.clearStencil();

        };

        po.renderOrder = i + 1.2;

        object.add( stencilGroup );
        poGroup.add( po );
        planeObjects.push( po );
        scene.add( poGroup );

    }

    const material = new THREE.MeshStandardMaterial( {

        color: 0xd00000,
        metalness: 0.49,
        roughness: 0.34,
        clippingPlanes: planes,
        clipShadows: true,
        shadowSide: THREE.DoubleSide,

    } );

    // add the color
    const clippedColorFront = new THREE.Mesh( geometry, material );
    clippedColorFront.castShadow = true;
    clippedColorFront.renderOrder = 6;
    object.add( clippedColorFront );


    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry( 9, 9, 1, 1 ),
        new THREE.ShadowMaterial( { color: 0x000000, opacity: 0.25, side: THREE.DoubleSide } )
    );

    ground.rotation.x = - Math.PI / 3; // rotates X/Y to X/Z
    ground.position.y = - 1;
    ground.receiveShadow = true;
    scene.add( ground );

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111111);
    renderer.localClippingEnabled = true;

    // Create a ShaderPass instance with BadTVShader
    // badTVPass = new ShaderPass(BadTVShader);

    // // // Set uniforms for the badTVPass
    // badTVPass.uniforms['time'].value = 0.0; // Initial time value
    // badTVPass.uniforms['distortion'].value = 2.0;
    // badTVPass.uniforms['distortion2'].value = 0.91;
    // badTVPass.uniforms['speed'].value = 0.04;
    // badTVPass.uniforms['rollSpeed'].value = 0.002;

    //const renderPass = new RenderPass(scene, camera);
    // const copyShader = new THREE.ShaderMaterial(CopyShader);
    // let copyPass = new ShaderPass(copyShader);

    // Create the EffectComposer and add passes
    // composer = new EffectComposer(renderer);
    // composer.addPass(renderPass);
    // composer.addPass(badTVPass);
    //composer.addPass(copyPass);
    // /copyPass.renderToScreen = true;


    const canvas = renderer.domElement;

    const contentContainer = document.getElementById('content-container');
    const containerParent = contentContainer.parentNode;
    containerParent.insertBefore(canvas, contentContainer.nextSibling);
    document.getElementById('three-js-scene').appendChild(canvas);
  
    // No need to call preventDefault() in your event handlers
    attachEventListeners();
}

function attachEventListeners() {
    window.addEventListener('resize', onWindowResize, false);

    const canvas = renderer.domElement;
  
    // canvas.addEventListener('pointerdown', handleStart, false);
    // canvas.addEventListener('pointermove', handleMove, false);
    // canvas.addEventListener('pointerup', handleEnd, false);
    // canvas.addEventListener('pointercancel', handleEnd, false);
  }



function onWindowResize() {

    const ASPECT_RATIO = window.innerWidth / window.innerHeight;
    const WIDTH = ( window.innerWidth / CAM_AMOUNT ) * window.devicePixelRatio;
    const HEIGHT = ( window.innerHeight / CAM_AMOUNT ) * window.devicePixelRatio;

    camera.aspect = ASPECT_RATIO;
    camera.updateProjectionMatrix();

    for ( let y = 0; y < CAM_AMOUNT; y ++ ) {

        for ( let x = 0; x < CAM_AMOUNT; x ++ ) {

            const subcamera = camera.cameras[ CAM_AMOUNT * y + x ];

            subcamera.viewport.set(
                Math.floor( x * WIDTH ),
                Math.floor( y * HEIGHT ),
                Math.ceil( WIDTH ),
                Math.ceil( HEIGHT ) );

            subcamera.aspect = ASPECT_RATIO;
            subcamera.updateProjectionMatrix();

        }

    }

    renderer.setSize( window.innerWidth, window.innerHeight );

}

  

  
  function animate() {
    const delta = clock.getDelta();

    requestAnimationFrame( animate );

    if ( params.animate ) {

        object.rotation.x -= delta * 0.1;
        object.rotation.y += delta * 0.06;
        object.rotation.Z -= delta * 0.2;

    }

    for ( let i = 0; i < planeObjects.length; i ++ ) {

        const plane = planes[ i ];
        const po = planeObjects[ i ];
        plane.coplanarPoint( po.position );
        po.lookAt(
            po.position.x - plane.normal.x,
            po.position.y - plane.normal.y,
            po.position.z - plane.normal.z,
        );

    }

    // shaderTime += 0.1;
    // badTVPass.uniforms['time'].value = shaderTime;

    renderer.render( scene, camera );
    //composer.render();

  }