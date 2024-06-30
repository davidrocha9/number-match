
import { ScoreModel } from "../Models/ScoreModel.js";
import { ScoreView } from "../Views/ScoreView.js";

export class Score {
    constructor() {
        this.model = new ScoreModel();
        this.view = new ScoreView(this.model);
    }

    increase(points) {
        this.model.score += points;
        this.view.update();
    }
}