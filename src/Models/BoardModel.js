import { BoardConfig } from "../Constants/BoardConfig.js";
import { TileModel } from "./TileModel.js";

export class BoardModel {
    constructor() {
        this._rows = BoardConfig.ROWS;
        this._cols = BoardConfig.COLS;
        this.createGrid();
    }

    createGrid() {
        this._grid = [];

        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            const row = [];
            for (let colIdx = 0; colIdx < this.cols; colIdx++) {
                const tileModel = new TileModel(rowIdx, colIdx);
                row.push(tileModel);
            }
            this._grid.push(row);
        }
    }

    serialize() {
        let serializedGrid = [];
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            const row = [];
            for (let colIdx = 0; colIdx < this.cols; colIdx++) {
                const tileModel = this.grid[rowIdx][colIdx];
                row.push(tileModel.serialize());
            }
            serializedGrid.push(row);
        }

        return {
            rows: this._rows,
            cols: this._cols,
            grid: serializedGrid
        };
    }

    deserialize(data) {
        this._rows = data.rows;
        this._cols = data.cols;
        
        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
            const row = [];
            for (let colIdx = 0; colIdx < this.cols; colIdx++) {
                const tileModel = this._grid[rowIdx][colIdx];
                tileModel.deserialize(data.grid[rowIdx][colIdx]);
            }
        }
    }

    get rows() {
        return this._rows;
    }

    get cols() {
        return this._cols;
    }

    get grid() {
        return this._grid;
    }
}