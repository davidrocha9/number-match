import { TileConfig } from "../Constants/TileConfig";
import { BoardConfig } from "../Constants/BoardConfig";
import { delay } from "../Utils";
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import TWEEN from 'tween.js'

export class TileView {
    constructor(model) {
        this.model = model;
        this.x = TileConfig.EDGE_SIZE * (this.model.col + 1);
        this.y = TileConfig.EDGE_SIZE * (BoardConfig.ROWS - this.model.row);
        this.group = new THREE.Group();
        this.draw();
    }

    draw() {
        this.drawFrame();
        this.drawBackground();
    }

    drawBackground() {
        const geometry = new THREE.PlaneGeometry(TileConfig.EDGE_SIZE, TileConfig.EDGE_SIZE);
        const material = new THREE.MeshBasicMaterial({ color: TileConfig.NOT_SELECTED_COLOR, side: THREE.DoubleSide });
        this.square = new THREE.Mesh(geometry, material);
        const XCoord = this.x - TileConfig.EDGE_SIZE / 2;
        const YCoord = this.y - TileConfig.EDGE_SIZE / 2;
        this.square.position.set(XCoord, YCoord, 0);
        this.group.add(this.square);
    }

    drawNumber() {
        const loader = new THREE.FontLoader();
        loader.load(TileConfig.FONT_URL, (font) => {
            const geometry = new THREE.TextGeometry(String(this.model.number), {
                font: font,
                size: TileConfig.EDGE_SIZE / 2,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.5,
                bevelSize: 0.3,
                bevelOffset: 0,
                bevelSegments: 5,
            });
            const material = new THREE.MeshBasicMaterial({ color: TileConfig.FONT_COLOR });
            this.numberText = new THREE.Mesh(geometry, material);

            geometry.computeBoundingBox();
            const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            const textXCoord = this.x - textWidth / 2 - TileConfig.EDGE_SIZE / 2;
            const textYCoord = this.y - textHeight / 2 - TileConfig.EDGE_SIZE / 2;
            this.numberText.position.set(textXCoord, textYCoord, 0);

            this.group.add(this.numberText);
        });
    }

    drawFrame() {
        const material = new THREE.LineBasicMaterial({ color: TileConfig.FONT_COLOR });
        const points = [];
        points.push(new THREE.Vector3(0, 0, 1));
        points.push(new THREE.Vector3(0, this.y, 1));
        points.push(new THREE.Vector3(this.x, this.y, 1));
        points.push(new THREE.Vector3(this.x, 0, 1));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.frame = new THREE.Line(geometry, material);
        this.group.add(this.frame);
    }

    addHighlight() {
        this.square.material.color = new THREE.Color(TileConfig.SELECTED_COLOR);
        this.square.material.needsUpdate = true; // Three.js needs this to be set to true to update the material
    }

    removeHighlight() {
        this.square.material.color = new THREE.Color(TileConfig.NOT_SELECTED_COLOR);
        this.square.material.needsUpdate = true; // Three.js needs this to be set to true to update the material
    }

    disable() {
        this.removeHighlight();
        this.numberText.material.color = new THREE.Color(TileConfig.DISABLED_COLOR);
        this.numberText.material.needsUpdate = true; // Three.js needs this to be set to true to update the material
    }

    remove() {
        const startColor = { r: this.square.material.color.r, g: this.square.material.color.g, b: this.square.material.color.b };
        const endColor = new THREE.Color(TileConfig.DISABLED_COLOR);
        const targetColor = { r: endColor.r, g: endColor.g, b: endColor.b };

        const tween = new TWEEN.Tween(startColor)
            .to(targetColor, 100) // Fade out over 1000ms (1 second)
            .onUpdate(() => {
                this.square.material.color.setRGB(startColor.r, startColor.g, startColor.b);
                this.square.material.needsUpdate = true; // Ensure material updates
            })
            .onComplete(async () => {
                await delay(150);
                this.group.remove(this.numberText);
                this.removeHighlight();
            })
            .start();

        this.square.material.color = new THREE.Color(endColor.r, endColor.g, endColor.b);
        this.square.material.needsUpdate = true;
    }
     
}