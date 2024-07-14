import { BoardView } from "../Views/BoardView.js";
import { Tile } from "./Tile.js";
import { BoardConfig } from "../Constants/BoardConfig.js";
import { delay } from "../Utils.js";

export class Board {
    constructor(model) {
        this.model = model;

        if (!this.model.grid) {
            this.generateNewGrid();
        }

        this.view = new BoardView(this.model);

        this.reset();
    }

    clearGrid() {
        this.model.grid = null;
    }

    reset() {
        this.createTileControllers();
        this.generateNewGrid();
        this.amountOfTilesToBeRemoved = 0;
        this._selectedTile = null;
    }

    createTileControllers() {
        this.tileControllers = [];

        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            const row = [];
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                const tileModel = this.model.grid[rowIdx][colIdx];
                const tileController = new Tile(tileModel, this.handleRemovedTile);
                this.view.add(tileController.view.group);
                row.push(tileController);
            }
            this.tileControllers.push(row);
        }
    }

    generateNewGrid() {
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                this.tileControllers[rowIdx][colIdx].generateNumber();
                this.tileControllers[rowIdx][colIdx].enable();

                // Should only generate a pre-determined number of tiles
                if (rowIdx * this.model.cols + colIdx > BoardConfig.GAME_START_AMOUNT_TILES) {
                    return;
                }
            }
        }
    }

    getClickedTileCoords(uuid) {
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                const tile = this.tileControllers[rowIdx][colIdx];
                
                if (tile.containsObjectWithUUID(uuid) && tile.active) {
                    return { row: rowIdx, col: colIdx };
                }
            }
        }
    }

    checkIfValidCoords(coords) {
        if (coords.row < 0 || coords.row >= this.model.rows
            || coords.col < 0 || coords.col >= this.model.cols)
        {
            return false;
        }
        
        const clickedTile = this.tileControllers[coords.row][coords.col];
        return clickedTile.active;
    }

    onTileClick(tileCoords) {
        const XCoords = tileCoords.col;
        const YCoords = tileCoords.row;
        const tile = this.tileControllers[YCoords][XCoords];
        
        if (!this._selectedTile || this._selectedTile === tile) {
            tile.addHighlight();
            this._selectedTile = tile;
            return 0;
        }

        if (this.canMatchTiles(this._selectedTile, tile) && this.checkIfTilesAreAdjacent(this._selectedTile, tile)) {
            const distancePoints = this.calculateDistancePointsBetweenTiles(this._selectedTile, tile); 
            this.removeTiles(this._selectedTile, tile);
            return distancePoints;
        }

        tile.addHighlight();
        this._selectedTile.removeHighlight();
        this._selectedTile = tile;

        return 0;
    }

    removeTiles(tile1, tile2) {
        tile1.addHighlight();
        tile2.disable();
        this._selectedTile.disable();

        this._selectedTile = null;
    }

    canMatchTiles(tile1, tile2) {
        return tile1.number === tile2.number || tile1.number + tile2.number === BoardConfig.TARGET_SUM;
    }

    checkIfTilesAreAdjacent(tile1, tile2) {
        const xDiff = tile2.col - tile1.col;
        const yDiff = tile2.row - tile1.row;

        if (this.areTilesDirectlyConnected(xDiff, yDiff)) {
            const xStep = xDiff / Math.abs(xDiff) || 0;
            const yStep = yDiff / Math.abs(yDiff) || 0;
            let currTile = this.tileControllers[tile1.row + yStep][tile1.col + xStep];

            while (currTile.col !== tile2.model.col || currTile.row !== tile2.model.row) {
                if (currTile.active) {
                    return false;
                }

                currTile = this.tileControllers[currTile.row + yStep][currTile.col + xStep];
            }

            return true;
        }

        let startTile = yDiff > 0 ? tile1 : tile2;
        let targetTile = yDiff > 0 ? tile2 : tile1;
        let xStep = 1;
        let yStep = 1;

        while (startTile.col !== targetTile.col || startTile.row !== targetTile.row) {
            if (startTile.col + xStep >= this.model.cols - 1) {
                startTile = this.tileControllers[startTile.row + yStep][0];
            }
            else{
                startTile = this.tileControllers[startTile.row][startTile.col + xStep];
            }

            if (startTile.active && startTile !== targetTile) {
                return false;
            }
        }

        return true;
    }

    areTilesDirectlyConnected(xDiff, yDiff) {
        return this.areTilesConnectedDiagonally(xDiff, yDiff) ||
               this.areTilesConnectedHorizontally(xDiff, yDiff) ||
               this.areTilesConnectedVertically(xDiff, yDiff);
    }
    areTilesConnectedDiagonally(xDiff, yDiff) {
        return Math.abs(xDiff) === Math.abs(yDiff);
    }

    areTilesConnectedHorizontally(xDiff, yDiff) {
        return yDiff === 0;
    }

    areTilesConnectedVertically(xDiff, yDiff) {
        return xDiff === 0;
    }

    calculateDistancePointsBetweenTiles(tile1, tile2) {
        const xDiff = Math.abs(tile2.col - tile1.col);
        const yDiff = Math.abs(tile2.row - tile1.row);

        return xDiff + yDiff;
    }   

    checkIfShouldRemoveRow(idx)
    {
        return this.tileControllers[idx].every(tile => !tile.active && tile.number > 0)
    }

    checkIfRowIsEmpty(idx)
    {
        return this.tileControllers[idx].every(tile => tile.isEmpty());
    }

    async removeRow(idx) {
        this.amountOfTilesToBeRemoved += this.model.cols;
    
        for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
            await delay(50);
            this.tileControllers[idx][colIdx].remove();
        }
    }

    handleRemovedTile = () => {
        this.amountOfTilesToBeRemoved--;
        
        if (this.amountOfTilesToBeRemoved === 0) {
            this.handleRemovedRows();
        }
    }

    handleRemovedRows() {
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            this.shiftTilesUp(rowIdx);
        }
    }

    shouldShiftTileUp(rowIdx, colIdx) {
        return rowIdx > 0 && this.model.grid[rowIdx - 1][colIdx].isEmpty() && this.checkIfRowIsEmpty(rowIdx - 1);
    }

    shiftTilesUp(rowIdx) {
        if (this.checkIfRowIsEmpty(rowIdx)) {
            return;
        }

        const startRowIdx = rowIdx;
        while (rowIdx > 0 && this.checkIfRowIsEmpty(rowIdx - 1)) {
            rowIdx--;
        }

        if (startRowIdx === rowIdx) {
            return;
        }
        
        for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
            this.tileControllers[rowIdx][colIdx].update(
                this.tileControllers[startRowIdx][colIdx].number,
                this.tileControllers[startRowIdx][colIdx].active
            );
    
            this.tileControllers[startRowIdx][colIdx].reset();
        }
    }

    checkForRowsClears() {
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            if (this.checkIfShouldRemoveRow(rowIdx)) {
                this.removeRow(rowIdx);
            }
        }
    }

    async duplicateBoard() {
        const firstEmptyTile = this.getFirstEmptyTile();
        let currTile = { ...firstEmptyTile };

        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                if (rowIdx === firstEmptyTile.row && colIdx === firstEmptyTile.col) {
                    return;
                }
                
                const tile = this.tileControllers[rowIdx][colIdx];
                if (!tile.active) {
                    continue;
                }

                await delay(50);

                this.tileControllers[currTile.row][currTile.col].copy(tile);

                // Update the current tile to the next position
                currTile.col++;
                if (currTile.col >= this.model.cols) {
                    currTile.col = 0;
                    currTile.row++;
                }
            }
        }
    }
    

    getFirstEmptyTile() {
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                if (this.model.grid[rowIdx][colIdx].isEmpty()) {
                    return { row: rowIdx, col: colIdx };
                }
            }
        }
    }

    checkForMoreMatches() {
        // get active tiles
        const activeTiles = [];
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                if (this.tileControllers[rowIdx][colIdx].active) {
                    activeTiles.push(this.tileControllers[rowIdx][colIdx]);
                }
            }
        }

        for (let i = 0; i < activeTiles.length; i++) {
            for (let j = i + 1; j < activeTiles.length; j++) {
                if (this.canMatchTiles(activeTiles[i], activeTiles[j]) && this.checkIfTilesAreAdjacent(activeTiles[i], activeTiles[j])) {
                    console.log(activeTiles[i].row, activeTiles[i].col, activeTiles[j].row, activeTiles[j].col);
                    return true;
                }
            }
        }

        return false;
    }

    serialize() {
        return this.model.serialize();
    }

    deserialize(data) {
        this.model.deserialize(data);
    }
}