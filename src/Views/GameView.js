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
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('click', this.onClick.bind(this), false);
    }

    setClickCallback(callback) {
        this.clickCallback = callback;
    }

    onMouseMove(event) {
        // Convert the mouse position to normalized device coordinates (-1 to +1) for both components
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onClick(event) {
        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const uuid = intersects[0].object.uuid;
            if (this.clickCallback) {
                this.clickCallback(uuid); // Call the callback with the intersected object's UUID
            }
        }
    }
}