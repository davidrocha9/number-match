import { TileModel } from '../Models/TileModel.js';
import { TileView } from '../Views/TileView.js';

export class Tile {
    constructor(row, col, resetCallBack) {
        this.model = new TileModel(row, col);
        this.view = new TileView(this.model, this.removeCallback);

        this.resetCallback = resetCallBack;
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

    remove() {
        this.view.remove();
    }

    isEmpty() {
        return this.model.isEmpty();
    }

    reset() {
        this.model.reset();
        this.view.reset();
    }

    removeCallback = () => {
        this.model.reset();
        this.resetCallback();
    }

    update(number, active) {
        this.model.number = number;
        this.model.active = active;

        this.view.reset();

        if (this.isEmpty()) {
            return;
        }

        this.view.drawNumber();
    }

    async copy(tile) {
        this.model.number = tile.number;
        await this.view.copy(tile.view);
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

    set number(number) {
        this.model.number = number;
    }

    set active(active) {
        this.model.active = active;
    }
}