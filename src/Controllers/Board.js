import { BoardView } from "../Views/BoardView";
import { BoardModel } from "../Models/BoardModel";
import { Tile } from "./Tile";

export class Board {
    constructor() {
        this.init();
    }

    init() {
        this.model = new BoardModel();
        this.view = new BoardView(this.model);

        this.createTiles();
    }

    createTiles() {
        this.tiles = [];

        let row = [];
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                const tile = new Tile(rowIdx, colIdx);
                this.view.add(tile.view.group);
                row.push(tile);
            }

            this.tiles.push(row);
            row = [];
        }
    }
}