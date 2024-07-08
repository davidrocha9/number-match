import { GameView } from "../Views/GameView.js";
import { GameModel } from "../Models/GameModel.js";
import { Board } from "./Board.js";
import { UI } from "./UI.js";
import { UIConfig } from "../Constants/UIConfig.js";
import { GameConfig } from "../Constants/GameConfig.js";

export class Game {
    constructor() {
        this.model = new GameModel();
        this.load();

        this.board = new Board(this.model.board);
        this.ui = new UI(this.model);

        this.view = new GameView(
            this.model,
            this.onTileClick.bind(this),
            this.onUIClick.bind(this))
        ;
        this.view.add(this.board.view.grid);
        
        if (!this.checkIfThereIsASavedGame()) {
            this.board.generateInitialTiles();
        }
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

        this.save()
    }

    onTileClick(coords) {
        if (!this.board.checkIfValidCoords(coords)) {
            return;
        }

        const newPoints = this.board.onTileClick(coords);
        this.ui.increase(newPoints);

        this.board.checkForRowsClears();

        this.view.updateScore(this.ui.model);

        this.save();
    }

    checkIfThereIsASavedGame() {
        return localStorage.getItem(GameConfig.GAME_KEY) !== null;
    }

    load() {
        const data = JSON.parse(localStorage.getItem(GameConfig.GAME_KEY));
        
        if (data) {
            this.model.deserialize(data);
        }
    }

    save() {
        const gameData = this.model.serialize();
        const boardData = this.board.serialize();

        const data = {
            ...gameData,
            ...boardData
        };

        localStorage.setItem(GameConfig.GAME_KEY, JSON.stringify(data));
    }
}