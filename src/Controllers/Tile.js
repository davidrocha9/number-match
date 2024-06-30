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

    disable() {
        this.model.active = false;
        this.view.disable();
    }

    get number() {
        return this.model.number;
    }
}
