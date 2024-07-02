import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { SceneConfig } from '../Constants/SceneConfig';

export class GameView {
    constructor() {
        this.init();
        this.addEventListeners();
    }

    init() {
        // Create the renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Create the camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);

        // Create the scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(SceneConfig.BACKGROUND_COLOR);

        // Create a raycaster
        this.raycaster = new THREE.Raycaster();

        // Create a vector to store the mouse position
        this.mouse = new THREE.Vector2();

        // Callback for click events
        this.clickCallback = null;

        // Render the scene
        this.render();
    }

    add(mesh) {
        this.scene.add(mesh);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    addEventListeners() {
        window.addEventListener('click', this.onClick.bind(this), false);
    }

    worldToScreen(worldVector) {
        const width = this.renderer.domElement.width;
        const height = this.renderer.domElement.height;
        const vector = worldVector.clone().project(this.camera);

        vector.x = (vector.x + 1) / 2 * width;
        vector.y = -(vector.y - 1) / 2 * height;

        return vector;
    }

    onClick(event) {
        const halfSize = 5 / 2;

        const corners = [
            new THREE.Vector3(-halfSize, -halfSize, 0),
            new THREE.Vector3(halfSize, -halfSize, 0),
            new THREE.Vector3(-halfSize, halfSize, 0),
            new THREE.Vector3(halfSize, halfSize, 0)
        ];

        const screenCorners = corners.map(corner => this.worldToScreen(corner));
        
        const minX = Math.min(...screenCorners.map(corner => corner.x));
        const maxX = Math.max(...screenCorners.map(corner => corner.x));
        const minY = Math.min(...screenCorners.map(corner => corner.y));
        const maxY = Math.max(...screenCorners.map(corner => corner.y));
        
        const planeWidth = maxX - minX;
        const planeHeight = maxY - minY;

        const centerX = this.renderer.domElement.width / 2;
        const centerY = this.renderer.domElement.height / 2;
        
        const x = centerX - event.clientX;
        const y = centerY - event.clientY;

        console.log(Math.round(Math.abs(x / planeWidth)), Math.round(Math.abs(y / planeHeight)));
    }
}