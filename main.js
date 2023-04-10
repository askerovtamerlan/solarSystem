import './style.css'
import javascriptLogo from './javascript.svg'
import {
    setupCounter
} from './counter.js'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import * as
TWEEN from '@tweenjs/tween.js';

import {
    InteractionManager
} from "three.interactive"


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

document.querySelector('#app').innerHTML = `<canvas class="bg"></canvas>`

const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: document.querySelector(".bg")
    // alpha: true
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(200)

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
    color: 0xFF6347
})
const torus = new THREE.Mesh(geometry, material);

// scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)

pointLight.position.set(20, 20, 20)
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(gridHelper)

// const spaceTexture = new THREE.TextureLoader().load('./cubemaps/BlueNebular_front.jpg')
const pmremGenerator = new THREE.PMREMGenerator(renderer)

const loaderCubeText = new THREE.CubeTextureLoader();
const spaceTexture = loaderCubeText.load([
    './cubemaps/pos-x.jpg',
    './cubemaps/neg-x.jpg',
    './cubemaps/pos-y.jpg',
    './cubemaps/neg-y.jpg',
    './cubemaps/pos-z.jpg',
    './cubemaps/neg-z.jpg',
])

// EARTH 
// const loaderText = 


const earthTexture = new THREE.TextureLoader().load('./textures/earth/earth2k_base_color.jpg')
const earthNormalTexture = new THREE.TextureLoader().load('./textures/earth/earth2k_normal_tangent.jpg')
const earthRoughnessTexture = new THREE.TextureLoader().load('./textures/earth/earth2k_roughness.png')
const earthSpecularTexture = new THREE.TextureLoader().load('./textures/earth/Specular.png')

const cloudAlphaTexture = new THREE.TextureLoader().load('./textures/earth/cloud2k_alpha.jpg')

// earthRoughnessTexture.magFilter = THREE.NearestFilter;

// loaderText.onload(() => {
// const earth = new THREE.Mesh(
//     new THREE.SphereGeometry(3, 32, 32),
//     new THREE.MeshStandartMaterial({
//         // map: earthTexture
//         // normalMap: earthNormalTexture
//         color: 0xFF6347
//     })
// );

//     scene.add(earth)

// })

const sunMaterial = new THREE.MeshPhongMaterial({
    color: 0xe8e3e3,
    blending: THREE.AdditiveBlending,
    side: THREE.Backside
})

sunMaterial.shininess = 3000

const earthMaterial = new THREE.MeshPhysicalMaterial({
    map: earthTexture,
    normalMap: earthNormalTexture,
    roughnessMap: earthRoughnessTexture,
    specularMap: earthSpecularTexture
    // alpha: earthAlphaTexture
})

const cloudsMaterial = new THREE.MeshLambertMaterial({
    map: cloudAlphaTexture,
    blending: THREE.AdditiveBlending,
    // side: THREE.BackSide
})

earthMaterial.normalScale.set(2, 2)
earthMaterial.roughness = 0.8
earthMaterial.clearcoat = 0.1
earthMaterial.clearcoatRoughness = 0.9
// earthMaterial.shininess = 450

cloudsMaterial.roughness = 0.9

const earthGeometry = new THREE.SphereGeometry(15, 52, 50)

const earth = new THREE.Mesh(earthGeometry,
    earthMaterial
)

const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(15.1, 100, 100), cloudsMaterial
)

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(100, 50, 50), sunMaterial
)

const interactionManager = new InteractionManager(renderer, camera, document.querySelector(".bg"))


earth.addEventListener('click', (e) => {
    e.stopPropagation()
    console.log('earth was clicked')
    // camera.position.setZ(250)

    const coord = {
        z: camera.position.z
    }

    new TWEEN.Tween(coord)
        .to({
            z: 50
        })
        .onUpdate(() => camera.position.setZ(coord.z))
        .start()
})

sun.position.set(300, 0, 0)


interactionManager.add(earth)
interactionManager.update()


scene.add(sun)
scene.add(earth)
scene.add(clouds)
scene.background = spaceTexture

let time = 0.5

function animate(time) {
    requestAnimationFrame(animate);

    earth.rotation.x += 0.0001;
    clouds.rotation.z += 0.0001;
    clouds.rotation.y += 0.0001;

    renderer.render(scene, camera);
    TWEEN.update(time)
}

// renderer.render(scene, camera);


animate();

const controls = new OrbitControls(camera, document.querySelector(".bg"));
controls.target.set(0, 5, 0);
controls.update();



// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="/vite.svg" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))