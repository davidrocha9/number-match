import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
import { SceneConfig } from '../Constants/SceneConfig.js';
import { EventConstants } from '../Constants/EventConstants.js';
import { getClickedTileCoords } from '../Utils.js';
import { UIView } from '../Views/UIView.js';

export class GameView {
    constructor(model, tileClickCallback, uiClickCallback) {
        this.model = model;
        this.uiView = new UIView(this.model.ui);

        this.init();
        this.addEventListeners();

        this.handleTileClick = tileClickCallback;
        this.handleUIClick = uiClickCallback;
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

        this.scene.add(this.uiView.group);
    }

    updateScore(uiModel) {
        this.uiView.updateScore(uiModel);
    }

    updateUi(uiModel) {
        this.uiView.updateUi(uiModel);
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

    checkIfPlusButtonWasPressed(intersects) {
        return intersects[0].object.uuid === this.plusLine.uuid || intersects[0].object.uuid === this.circle.uuid;
    }

    onClick(event) {
        // Update the mouse variable with the normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.uiView.getElements());

        if (intersects.length > 0) {
            this.handleUIClick(this.uiView.getClickedElementId(intersects));
        } else {
            // If there were no intersects, then check if a tile was pressed
            const clickedTileCoords = getClickedTileCoords(
                event,
                this.camera,
                this.renderer.domElement.width,
                this.renderer.domElement.height
            );

            this.handleTileClick(clickedTileCoords);
        }
    }
}