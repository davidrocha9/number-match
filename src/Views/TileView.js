import { TileConfig } from "../Constants/TileConfig";
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class TileView {
    constructor(model) {
        this.model = model;
        this.x = TileConfig.EDGE_SIZE * (this.model.col + 1);
        this.y = TileConfig.EDGE_SIZE * (this.model.row + 1);
        this.group = new THREE.Group();
        this.draw();
    }

    draw() {
        this.drawNumber();
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
            this.textMesh = new THREE.Mesh(geometry, material);

            geometry.computeBoundingBox();
            const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            const textXCoord = this.x - textWidth / 2 - TileConfig.EDGE_SIZE / 2;
            const textYCoord = this.y - textHeight / 2 - TileConfig.EDGE_SIZE / 2;
            this.textMesh.position.set(textXCoord, textYCoord, 0);

            this.group.add(this.textMesh);
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
        this.textMesh.material.color = new THREE.Color(TileConfig.DISABLED_COLOR);
        this.textMesh.material.needsUpdate = true; // Three.js needs this to be set to true to update the material
    }
}