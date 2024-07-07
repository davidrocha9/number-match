import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BoardConfig } from '../Constants/BoardConfig.js';
import { TileConfig } from '../Constants/TileConfig.js';

export class BoardView {
    constructor(model) {
        this.model = model;
        this.grid = new THREE.Mesh();
    }

    add(mesh) {
        mesh.position.x -= BoardConfig.COLS / 2 * TileConfig.EDGE_SIZE;
        mesh.position.y -= BoardConfig.ROWS / 2 * TileConfig.EDGE_SIZE;
        this.grid.add(mesh);
    }
}
