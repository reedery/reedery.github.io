import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';

import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let container, stats, clock, gui, mixer, actions, activeAction, previousAction, composer;
let camera, scene, renderer, model, face, cone, pointer, renderBlock, controls, effectFilm;

const api = { state: 'Walking' };


init();
onWindowResize()
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
    camera.position.set( 0, 4, 16 );
    camera.lookAt( 0, 2.5, 0 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x111111 );
    //scene.fog = new THREE.Fog(0x4d32ee, 2, 20);

    clock = new THREE.Clock();

    // lights

    const spotLight = new THREE.SpotLight( 0xffffff, 250);
    spotLight.position.set(7, 10, 4);
    spotLight.angle = Math.PI/12;
    spotLight.target.position.set(0, 2.5, 0);
    spotLight.target.updateMatrixWorld();
    spotLight.castShadow = true;

    scene.add( spotLight );


    // const debugSpotLight = new THREE.SpotLightHelper(spotLight);
    // scene.add(debugSpotLight);

    const spotLight2 = new THREE.SpotLight( 0xff0000, 100);
    spotLight2.position.set(-3, 7, -2);
    spotLight2.target.position.set(0, 2.5, 0);
    spotLight2.angle = Math.PI/8;
    spotLight2.castShadow = true;

    scene.add( spotLight2 );

    // const debugSpotLight2 = new THREE.SpotLightHelper(spotLight2);
    // scene.add(debugSpotLight2);


    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, .2 );
    hemiLight.position.set( 10, -80, -9 );
    scene.add( hemiLight );
    // const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    // dirLight.position.set( 0, 20, 10 );
    // scene.add( dirLight );



    const grid = new THREE.GridHelper( 200, 40, 0xaaaaaa, 0xaaaaaa );
    grid.material.opacity = 0.4;
    grid.material.transparent = true;
    //scene.add( grid );

    // model

    const loader = new GLTFLoader();
    loader.load( 'static/brobot.glb', function ( gltf ) {

        model = gltf.scene;
        model.traverse( function ( node ) {
            if ( node instanceof THREE.Mesh ) { 
                node.castShadow = true; 
            } 
        } );
        scene.add( model );
        console.log(gltf.animations);
        createGUI( model, gltf.animations );

    }, undefined, function ( e ) {

        console.error( e );

    } );

    const boxGeometry = new THREE.BoxGeometry(2, 2, 1);
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 2, 6);
    scene.add(box);

    // loader.load( 'static/room.glb', function ( gltf ) {

    //     const room = gltf.scene;
    //     room.scale.set(5, 5, 5);
    //     room.rotation.y = THREE.MathUtils.degToRad(-30);
    //     scene.add( room );
    // }, undefined, function ( e ) {

    //     console.error( e );

    // } );

    const prismGeometry = new THREE.BoxGeometry(0.05, 0.05, 3);
    const prismMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
    cone = new THREE.Mesh(prismGeometry, prismMaterial);
    cone.position.set(0, 3.5, .75);
    //scene.add( cone );

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // post process
    composer = new EffectComposer( renderer );
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );


    const pixelatedPass = new RenderPixelatedPass(3, scene, camera );
   // composer.addPass( pixelatedPass );


    effectFilm = new FilmPass(10, false);
  
    effectFilm.renderToScreen = true;
    //composer.addPass( effectFilm );

    const effect3 = new OutputPass();
    composer.addPass( effect3 );


    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 2, 0 );
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    // for mouse pos
    renderBlock = document.querySelector('body.wrapper');
    pointer = new THREE.Vector2();

    renderBlock.addEventListener( 'pointermove', onPointerMove );
    window.addEventListener( 'resize', onWindowResize );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

}



function createGUI( model, animations ) {

    
    gui = new GUI();
        
    const states = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ];
    const emotes = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ];
    for (let i = 0; i < states.length; i++) {
        states[i] = "Robot_" + states[i];
    }

    for (let i = 0; i < emotes.length; i++) {
        emotes[i] = "Robot_" + emotes[i];
    }

    mixer = new THREE.AnimationMixer( model );

    actions = {};

    for ( let i = 0; i < animations.length; i ++ ) {

        const clip = animations[ i ];
        const action = mixer.clipAction( clip );
        actions[ clip.name ] = action;

        if ( emotes.indexOf( clip.name ) >= 0 || states.indexOf( clip.name ) >= 4 ) {

            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;

        }

    }

    // states

    const statesFolder = gui.addFolder( 'States' );

    const clipCtrl = statesFolder.add( api, 'state' ).options( states );

    clipCtrl.onChange( function () {

        fadeToAction( api.state, 0.5 );

    } );

    statesFolder.open();

    // emotes

    const emoteFolder = gui.addFolder( 'Emotes' );

    function createEmoteCallback( name ) {

        api[ name ] = function () {

            fadeToAction( name, 0.2 );

            mixer.addEventListener( 'finished', restoreState );

        };

        emoteFolder.add( api, name );

    }

    function restoreState() {

        mixer.removeEventListener( 'finished', restoreState );

        fadeToAction( api.state, 0.2 );

    }

    for ( let i = 0; i < emotes.length; i ++ ) {

        createEmoteCallback( emotes[ i ] );

    }

    emoteFolder.open();

    // expressions

    // face = model.getObjectByName( 'Head_4' );

    // const expressions = Object.keys( face.morphTargetDictionary );
    // const expressionFolder = gui.addFolder( 'Expressions' );

    // for ( let i = 0; i < expressions.length; i ++ ) {

    //     expressionFolder.add( face.morphTargetInfluences, i, 0, 1, 0.01 ).name( expressions[ i ] );

    // }

    activeAction = actions[ 'Robot_Idle' ];
    activeAction.play();

    //expressionFolder.open();
    gui.close();

}

function fadeToAction( name, duration ) {

    previousAction = activeAction;
    activeAction = actions[ name ];

    if ( previousAction !== activeAction ) {

        previousAction.fadeOut( duration );

    }

    activeAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( duration )
        .play();

}

function onWindowResize() {


    camera.aspect = window.innerWidth / window.innerHeight;

    if ( camera.aspect < 0.5) { // Very narrow aspect ratio
        camera.fov = 45;
    } else if ( camera.aspect < 1) { // Portrait mode, likely a mobile device
        camera.fov = 40;
    } else if ( camera.aspect < 1.5) { // Slightly wide aspect ratio, could be a tablet or small desktop screen
        camera.fov = 35;
    } else { // Landscape mode, likely a desktop device
        camera.fov = 30;
    }
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
	composer.setSize( window.innerWidth, window.innerHeight );

}


function onPointerMove( event ) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components   
    pointer.x = ( event.layerX / renderBlock.clientWidth ) * 2 - 1;
    pointer.y = - ( event.layerY / renderBlock.clientHeight) * 2 + 1;
}

function animate() {
    // Extrapolate pointer into 3D space
    let pointer3D = new THREE.Vector3(pointer.x, pointer.y, 10);
    pointer3D.unproject(camera);
    pointer3D.sub(camera.position).normalize();
    let distance = - camera.position.z / pointer3D.z;
    let pos = camera.position.clone().add(pointer3D.multiplyScalar(distance));

    // Set the cone's quaternion
    cone.quaternion.setFromRotationMatrix(
        new THREE.Matrix4().lookAt(
            cone.position,
            pos,
            new THREE.Vector3(0, 1, 0)
        )
    );
    cone.rotation.x = Math.PI - cone.rotation.x;





    const dt = clock.getDelta();

    if ( mixer ) mixer.update( dt );

    requestAnimationFrame( animate );


    //renderer.render( scene, camera );\
    composer.render();

    stats.update();

    
}
