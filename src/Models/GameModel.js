import { UIConfig } from "../Constants/UIConfig.js";
import { BoardModel } from "./BoardModel.js";

export class GameModel {
    constructor() {
        this._score = 0;
        this._highScore = 0;
        this._plusCharges = UIConfig.INITIAL_PLUS_CHARGES;

        this._board = new BoardModel();
    }

    reset() {
        this._score = 0;
        this._plusCharges = UIConfig.INITIAL_PLUS_CHARGES;
        this._board.createGrid();
    }

    get score () {
        return this._score;
    }

    get plusCharges() {
        return this._plusCharges;
    }

    get board() {
        return this._board;
    }

    set score(points) {
        this._score = points;
    }

    set plusCharges(charges) {
        this._plusCharges = charges;
    }

    serialize() {
        return {
            score: this._score,
            highScore: this._highScore,
            plusCharges: this._plusCharges
        };
    }

    deserialize(data) {
        this._score = data.score;
        this._highScore = data.highScore;
        this._plusCharges = data.plusCharges;

        this._board.deserialize(data);
    }
}