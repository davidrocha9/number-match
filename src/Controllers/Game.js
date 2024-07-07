import { GameView } from "../Views/GameView.js";
import { GameModel } from "../Models/GameModel.js";
import { Board } from "./Board.js";
import { UI } from "./UI.js";
import { UIConfig } from "../Constants/UIConfig.js";

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
        const isThereOpenSpace = this.board.getFirstEmptyTile() !== undefined;
        const action = this.ui.handleClick(intersects, isThereOpenSpace);

        switch (action) {
            case UIConfig.DUPLICATE_BOARD:
                this.board.duplicateBoard(isThereOpenSpace);
                break;
            case UIConfig.IDLE:
                return;
        }

        this.view.updateUi(this.ui.model);
    }

    onTileClick(coords) {
        if (!this.board.checkIfValidCoords(coords)) {
            return;
        }

        const newPoints = this.board.onTileClick(coords);
        this.ui.increase(newPoints);

        this.board.checkForRowsClears();

        this.view.updateScore(this.ui.model);
    }
}