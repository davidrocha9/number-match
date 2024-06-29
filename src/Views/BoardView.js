import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BoardConfig } from '../Constants/BoardConfig';
import { TileConfig } from '../Constants/TileConfig';
import { EventConstants } from '../Constants/EventConstants';

export class BoardView {
    constructor(model) {
        this.model = model;
        this.grid = this.createBoard();

        this.setupClickEventListener();
    }

    createBoard() {
        const sizeX = BoardConfig.COLS * TileConfig.EDGE_SIZE;
        const sizeY = BoardConfig.ROWS * TileConfig.EDGE_SIZE;
        const geometry = new THREE.PlaneGeometry(sizeX, sizeY);
        const material = new THREE.MeshBasicMaterial({ color: BoardConfig.COLOR, side: THREE.DoubleSide });

        
        return new THREE.Mesh(geometry, material);
    }

    add(mesh) {
        mesh.position.x -= BoardConfig.COLS / 2 * TileConfig.EDGE_SIZE;
        mesh.position.y -= BoardConfig.ROWS / 2 * TileConfig.EDGE_SIZE;
        this.tiles.add(mesh);
    }

    setupClickEventListener() {
        this.grid.on(EventConstants.MOUSE_CLICK, this.onMouseClick.bind(this));
    }

    onMouseClick(event) {
        console.log(event);
    }
}
