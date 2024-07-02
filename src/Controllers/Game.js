import { GameView } from "../Views/GameView";
import { GameModel } from "../Models/GameModel";
import { Board } from "./Board";
import { Score } from "./Score";

export class Game {
    constructor() {
        this.model = new GameModel();
        this.view = new GameView();
        this.board = new Board();
        this.score = new Score();

        this.view.add(this.board.view.grid);
        this.view.add(this.score.view.group);

        this.start();
    }

    start() {
        this.board.generateInitialTiles();
    }

    onObjectClick(uuid) {
        const tileCoords = this.board.getClickedTileCoords(uuid);

        if (tileCoords) {
            const newPoints = this.board.onTileClick(tileCoords);

            if (newPoints > 0) {
                this.score.increase(newPoints);
            }
        }
    }
}