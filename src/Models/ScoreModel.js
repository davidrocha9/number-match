export class ScoreModel {
    constructor() {
        this._score = 0;
    }

    get score () {
        return this._score;
    }

    set score(points) {
        this._score = points;
    }
}