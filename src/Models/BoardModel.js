import { BoardConfig } from "../Constants/BoardConfig";

export class BoardModel {
    constructor() {
        this.rows = BoardConfig.ROWS;
        this.cols = BoardConfig.COLS;
    }
}