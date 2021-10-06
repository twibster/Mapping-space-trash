import * as THREE from "https://threejs.org/build/three.module.js"
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import * as dat from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js'
import { TWEEN } from 'https://threejs.org/examples/jsm/libs/tween.module.min.js';
import * as globe from './globe.js'
import { get_slider_value } from './slider.js'

export const REAL_EARTH_RADIUS = 6371;
export const EARTH_RADIUS = 10;
export const SCALE_RATIO = EARTH_RADIUS / REAL_EARTH_RADIUS;

//Basic stuff
const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

export function add_to_scene(obj) {
    scene.add(obj);
}
export function remove_from_scene(obj) {
    scene.remove(obj);
}

// Textures
const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load(Flask.url_for('static',{"filename":'textures/EarthTexture.jpg'}))
const earthNormalMap = textureLoader.load(Flask.url_for('static',{"filename":'textures/NormalMap.jpg'}))
const starsTexture = textureLoader.load(Flask.url_for('static',{"filename":'textures/8k_stars_milky_way.jpg'}))

// sky
const sky = new THREE.SphereGeometry(90, 64, 64)
const stars = new THREE.MeshBasicMaterial();
stars.map = starsTexture
stars.side = THREE.BackSide
scene.add(new THREE.Mesh(sky, stars))

// globe
const sphere = globe.globe(1, earthTexture, earthNormalMap);
scene.add(sphere)

// Lights
scene.add(new THREE.AmbientLight(0x333333, 5));
const light = new THREE.DirectionalLight(0xffffff, 0.15)
light.castShadow = true;

light.position.set(100, 100, 0).normalize();
//gui.add(light, 'intensity').min(0).max(8).step(0.01)
//gui.add(light.position, 'x')
//gui.add(light.position, 'y')
//gui.add(light.position, 'z')
scene.add(light)

//Canvas Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.01, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 1.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.rotateSpeed = 0.6;
controls.minDistance = EARTH_RADIUS + 1;
controls.maxDistance = 10 * EARTH_RADIUS;


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Animation
let frames = 0
function tick(time) {
    frames += 1
    controls.update()
    renderer.render(scene, camera)
    TWEEN.update(time);
    requestAnimationFrame(tick);
}

tick(0);
