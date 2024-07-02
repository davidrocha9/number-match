export class TileModel {
    constructor(row, col) {
        this._row = row;
        this._col = col;
        this._active = false;
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