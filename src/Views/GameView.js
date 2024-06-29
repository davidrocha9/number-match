import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { SceneConfig } from '../Constants/SceneConfig';
import { EventConstants } from '../Constants/EventConstants';

export class GameView {
    constructor() {
        this.init();
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
}