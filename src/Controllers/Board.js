import { BoardView } from "../Views/BoardView";
import { BoardModel } from "../Models/BoardModel";
import { Tile } from "./Tile";
import { BoardConfig } from "../Constants/BoardConfig";

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
        this.selectedTile = null;

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

    getClickedTileCoords(uuid) {
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                const tile = this.tiles[rowIdx][colIdx];
                
                if (tile.containsObjectWithUUID(uuid)) {
                    return { row: rowIdx, col: colIdx };
                }
            }
        }
    }

    onTileClick(tileCoords) {
        const XCoords = tileCoords.col;
        const YCoords = tileCoords.row;
        const tile = this.tiles[YCoords][XCoords];

        if (!this.selectedTile) {
            tile.addHighlight();
            this.selectedTile = tile;
        }
        else {
            if (this.selectedTile === tile) {
                return;
            }

            if (this.selectedTile.number + tile.number === BoardConfig.TARGET_SUM) {
                this.removeTiles(tile);
            }
            else {
                tile.addHighlight();
                this.selectedTile.removeHighlight();
                this.selectedTile = tile;
            }
        }
    }

    removeTiles(tile) {
        tile.addHighlight();
        tile.disable();
        this.selectedTile.disable();

        this.selectedTile = null;
    }
}