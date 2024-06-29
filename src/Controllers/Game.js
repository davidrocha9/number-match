import { GameView } from "../Views/GameView";
import { GameModel } from "../Models/GameModel";
import { Board } from "./Board";

export class Game {
    constructor() {
        this.init();
    }

    init() {
        this.model = new GameModel();
        this.view = new GameView();
        this.board = new Board();

        this.view.add(this.board.view.tiles);
    }
}