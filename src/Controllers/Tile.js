import { TileModel } from '../Models/TileModel.js';
import { TileView } from '../Views/TileView.js';

export class Tile {
    constructor(row, col) {
        this.model = new TileModel(row, col);
        this.view = new TileView(this.model);
    }

    containsObjectWithUUID(uuid) {
        for (let object of this.view.group.children) {
            if (object.uuid === uuid) {
                return true;
            }
        }

        return false;
    }

    addHighlight() {
        this.view.addHighlight();
    }

    removeHighlight() {
        this.view.removeHighlight();
    }

    enable() {
        this.model.active = true;
        this.model.number = Math.floor(1 + Math.random() * 9);
        this.view.drawNumber();
    }
    
    disable() {
        this.model.active = false;
        this.view.removeHighlight();
        this.view.disable();
    }

    get row() {
        return this.model.row;
    }

    get col() {
        return this.model.col;
    }

    get number() {
        return this.model.number;
    }

    get active() {
        return this.model.active;
    }
}
