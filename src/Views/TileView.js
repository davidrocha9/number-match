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
        const material = new THREE.LineBasicMaterial({color: TileConfig.FONT_COLOR});
        const points = [];
        points.push( new THREE.Vector3( 0, 0, 0 ) );
        points.push( new THREE.Vector3( 0, this.y, 0 ) );
        points.push( new THREE.Vector3( this.x, this.y, 0 ) );
        points.push( new THREE.Vector3( this.x, 0, 0 ) );

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.square = new THREE.Line(geometry, material);
        this.group.add(this.square);

        const loader = new THREE.FontLoader();
        loader.load(TileConfig.FONT_URL, (font) => {
            const textGeometry = new THREE.TextGeometry(String(this.model.number), {
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
            const textMaterial = new THREE.MeshBasicMaterial({ color: TileConfig.FONT_COLOR });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
            const textXCoord = this.x - textWidth / 2 - TileConfig.EDGE_SIZE / 2;
            const textYCoord = this.y - textHeight / 2 - TileConfig.EDGE_SIZE / 2;
            textMesh.position.set(textXCoord, textYCoord, 0);

            this.group.add(textMesh);
        });
    }
}