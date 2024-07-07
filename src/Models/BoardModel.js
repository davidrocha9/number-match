import { BoardConfig } from "../Constants/BoardConfig.js";

export class BoardModel {
    constructor() {
        this.rows = BoardConfig.ROWS;
        this.cols = BoardConfig.COLS;
    }
}