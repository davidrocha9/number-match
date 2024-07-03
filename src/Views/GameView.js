import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import TWEEN from 'tween.js';
import { SceneConfig } from '../Constants/SceneConfig';
import { EventConstants } from '../Constants/EventConstants';
import { getClickedTileCoords } from '../Utils';

export class GameView {
    constructor(clickCallback) {
        this.init();
        this.addEventListeners();
        this.handleClick = clickCallback;
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

        // Animate the scene
        this.animate();
    }

    add(mesh) {
        this.scene.add(mesh);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update(); // Continuously update all active tweens
        this.render(); // Render the scene
    }

    addEventListeners() {
        window.addEventListener(EventConstants.CLICK, this.onClick.bind(this), false);
    }

    onClick(event) {
        const clickedTileCoords = getClickedTileCoords(
            event,
            this.camera,
            this.renderer.domElement.width,
            this.renderer.domElement.height
        );

        this.handleClick(clickedTileCoords);
    }
}
