import { TileModel } from '../Models/TileModel.js';
import { TileView } from '../Views/TileView.js';

export class Tile {
    constructor(row, col) {
        this.model = new TileModel(row, col);
        this.view = new TileView(this.model);
    }
}