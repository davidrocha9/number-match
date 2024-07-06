import { UIModel } from "../Models/UIModel.js";

export class UI {
    constructor() {
        this.model = new UIModel();
    }

    increase(points) {
        this.model.score += points;
    }

    handleClick(intersects) {
        console.log(intersects);
    }
}