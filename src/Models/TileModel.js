export class TileModel {
    constructor(row, col) {
        this._number = Math.floor(1 + Math.random() * 9);
        this._row = row;
        this._col = col;
        this._active = true;
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
}