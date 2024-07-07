import { TileConfig } from "../Constants/TileConfig.js";
import { BoardConfig } from "../Constants/BoardConfig.js";
import { delay } from "../Utils.js";
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';

export class TileView {
    constructor(model, tileRemoveCallback) {
        this.model = model;
        this.x = TileConfig.EDGE_SIZE * (this.model.col + 1);
        this.y = TileConfig.EDGE_SIZE * (BoardConfig.ROWS - this.model.row);
        this.group = new THREE.Group();
        this.removeCallback = tileRemoveCallback;
        this.draw();
    }

    reset() {
        this.group.remove(this.numberText);
    }

    draw() {
        this.drawFrame();
        this.drawBackground();
    }

    drawBackground() {
        const geometry = new THREE.PlaneGeometry(TileConfig.EDGE_SIZE, TileConfig.EDGE_SIZE);
        const material = new THREE.MeshBasicMaterial({ color: TileConfig.NOT_SELECTED_COLOR, side: THREE.DoubleSide });
        const XCoord = this.x - TileConfig.EDGE_SIZE / 2;
        const YCoord = this.y - TileConfig.EDGE_SIZE / 2;
        
        this.square = new THREE.Mesh(geometry, material);
        this.square.position.set(XCoord, YCoord, 0);

        this.group.add(this.square);
    }

    async drawNumber() {
        return new Promise((resolve, reject) => {
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
                let fontColor = this.model.active ? TileConfig.FONT_COLOR : TileConfig.DISABLED_COLOR;
                fontColor = this.model.isEmpty() ? TileConfig.NOT_SELECTED_COLOR : fontColor;
    
                const material = new THREE.MeshBasicMaterial({ color: fontColor });
                this.numberText = new THREE.Mesh(geometry, material);
    
                geometry.computeBoundingBox();
                const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
                const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
                const textXCoord = this.x - textWidth / 2 - TileConfig.EDGE_SIZE / 2;
                const textYCoord = this.y - textHeight / 2 - TileConfig.EDGE_SIZE / 2;
                this.numberText.position.set(textXCoord, textYCoord, 0);
    
                this.group.add(this.numberText);
                resolve();
            }, undefined, reject);
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
                this.removeNumber();
                this.removeHighlight();
                this.removeCallback();
            })
            .start();

        this.square.material.color = new THREE.Color(endColor.r, endColor.g, endColor.b);
        this.square.material.needsUpdate = true;
    }
    
    removeNumber() {
        this.group.remove(this.numberText);
    }

    async copy(refTileView) {
        await this.drawNumber();
        
        const targetPos = {x: this.numberText.position.x, y: this.numberText.position.y};
        const startPos = {x: refTileView.numberText.position.x, y: refTileView.numberText.position.y};
        
        this.numberText.position.set(startPos.x, startPos.y, 0);
        this.numberText.material.color = new THREE.Color(TileConfig.FONT_COLOR);
        this.numberText.material.needsUpdate = true;

        const tween = new TWEEN.Tween(startPos)
            .to(targetPos, 600) // Fade out over 1000ms (1 second)
            .onStart(() => {})
            .onUpdate(() => {
                this.numberText.position.set(startPos.x, startPos.y, 0);
                this.numberText.material.needsUpdate = true;
            })
            .onComplete(async () => {
                this.model.active = true;
            })
            .start();
    }    
}