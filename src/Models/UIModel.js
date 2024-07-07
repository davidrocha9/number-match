import { UIConfig } from "../Constants/UIConfig.js";

export class UIModel {
    constructor() {
        this._score = 0;
        this._plusCharges = UIConfig.INITIAL_PLUS_CHARGES;
    }

    get score () {
        return this._score;
    }

    get plusCharges() {
        return this._plusCharges;
    }

    set score(points) {
        this._score = points;
    }

    set plusCharges(charges) {
        this._plusCharges = charges;
    }
}