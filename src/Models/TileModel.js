import { TileConfig } from "../Constants/TileConfig.js";

export class TileModel {
    constructor(row, col) {
        this._row = row;
        this._col = col;
        this.reset();
    }

    reset() {
        this._number = TileConfig.EMPTY_VALUE;
        this._active = false;
    }
    
    isEmpty() {
        return this._number === TileConfig.EMPTY_VALUE;
    }

    serialize() {
        return {
            row: this._row,
            col: this._col,
            number: this._number,
            active: this._active
        };
    }

    deserialize(data) {
        this._row = data.row;
        this._col = data.col;
        this._number = data.number;
        this._active = data.active;
    }

    get number() {
        return this._number;
    }

    get row() {
        return this._row;
    }

    get col() {
        return this._col;
    }

    get active() {
        return this._active;
    }

    set active(active) {
        this._active = active;
    }

    set number(number) {
        this._number = number;
    }
}