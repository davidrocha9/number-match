import { GameView } from "../Views/GameView";
import { GameModel } from "../Models/GameModel";
import { Board } from "./Board";
import { UI } from "./UI";

export class Game {
    constructor() {
        this.model = new GameModel();
        this.board = new Board();
        this.ui = new UI();

        this.view = new GameView(
            this.model,
            this.onTileClick.bind(this),
            this.onUIClick.bind(this))
        ;
        this.view.add(this.board.view.grid);

        this.start();
    }

    start() {
        this.board.generateInitialTiles();
    }

    onUIClick(intersects) {
        this.ui.handleClick(intersects);
    }

    onTileClick(coords) {
        if (!this.board.checkIfValidCoords(coords)) {
            return;
        }

        const newPoints = this.board.onTileClick(coords);
        this.ui.increase(newPoints);

        this.board.checkForRowsClears();

        this.view.update(this.ui.model);
    }
}