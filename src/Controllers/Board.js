import { BoardView } from "../Views/BoardView";
import { BoardModel } from "../Models/BoardModel";
import { Tile } from "./Tile";
import { BoardConfig } from "../Constants/BoardConfig";
import { delay } from "../Utils";

export class Board {
    constructor() {
        this.model = new BoardModel();
        this.view = new BoardView(this.model);

        this.createTiles();
        this.amountOfTilesToBeRemoved = 0;
    }

    createTiles() {
        this.tiles = [];
        this._selectedTile = null;

        let row = [];
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                const tile = new Tile(rowIdx, colIdx, this.handleRemovedTile);
                this.view.add(tile.view.group);
                row.push(tile);
            }

            this.tiles.push(row);
            row = [];
        }
    }

    generateInitialTiles() {
        for (let rowIdx = 0; rowIdx < this.model.rows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.model.cols; colIdx++) {
                this.tiles[rowIdx][colIdx].enable();

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
                const tile = this.tiles[rowIdx][colIdx];
                
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
        
        const clickedTile = this.tiles[coords.row][coords.col];
        return clickedTile.active;
    }

    onTileClick(tileCoords) {
        const XCoords = tileCoords.col;
        const YCoords = tileCoords.row;
        const tile = this.tiles[YCoords][XCoords];
        
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
            let currTile = this.tiles[tile1.row + yStep][tile1.col + xStep];

            while (currTile.col !== tile2.model.col || currTile.row !== tile2.model.row) {
                if (currTile.active) {
                    return false;
                }

                currTile = this.tiles[currTile.row + yStep][currTile.col + xStep];
            }

            return true;
        }

        let startTile = yDiff > 0 ? tile1 : tile2;
        let targetTile = yDiff > 0 ? tile2 : tile1;
        let xStep = 1;
        let yStep = 1;

        while (startTile.col !== targetTile.col || startTile.row !== targetTile.row) {
            if (startTile.col + xStep >= BoardConfig.COLS - 1) {
                startTile = this.tiles[startTile.row + yStep][0];
            }
            else{
                startTile = this.tiles[startTile.row][startTile.col + xStep];
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
        return this.tiles[idx].every(tile => !tile.active && tile.number > 0)
    }

    checkIfRowIsEmpty(idx)
    {
        return this.tiles[idx].every(tile => tile.isEmpty());
    }

    async removeRow(idx) {
        this.amountOfTilesToBeRemoved += BoardConfig.COLS;
    
        for (let colIdx = 0; colIdx < BoardConfig.COLS; colIdx++) {
            await delay(50);
            this.tiles[idx][colIdx].remove();
        }
    }

    handleRemovedTile = () => {
        this.amountOfTilesToBeRemoved--;
        
        if (this.amountOfTilesToBeRemoved === 0) {
            this.handleRemovedRows();
        }
    }

    handleRemovedRows() {
        for (let rowIdx = 0; rowIdx < BoardConfig.ROWS; rowIdx++) {
            this.shiftTilesUp(rowIdx);
        }
    }

    shouldShiftTileUp(rowIdx, colIdx) {
        return rowIdx > 0 && this.tiles[rowIdx - 1][colIdx].isEmpty() && this.checkIfRowIsEmpty(rowIdx - 1);
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
        
        for (let colIdx = 0; colIdx < BoardConfig.COLS; colIdx++) {
            this.tiles[rowIdx][colIdx].update(
                this.tiles[startRowIdx][colIdx].number,
                this.tiles[startRowIdx][colIdx].active
            );
    
            this.tiles[startRowIdx][colIdx].reset();
        }
    }

    checkForRowsClears() {
        for (let rowIdx = 0; rowIdx < BoardConfig.ROWS; rowIdx++) {
            if (this.checkIfShouldRemoveRow(rowIdx)) {
                this.removeRow(rowIdx);
            }
        }
    }

    async duplicateBoard() {
        const firstEmptyTile = this.getFirstEmptyTile();
        let currTile = { ...firstEmptyTile };

        for (let rowIdx = 0; rowIdx < BoardConfig.ROWS; rowIdx++) {
            for (let colIdx = 0; colIdx < BoardConfig.COLS; colIdx++) {
                if (rowIdx === firstEmptyTile.row && colIdx === firstEmptyTile.col) {
                    return;
                }

                const tile = this.tiles[rowIdx][colIdx];
                if (!tile.active) {
                    continue;
                }

                await delay(50);

                this.tiles[currTile.row][currTile.col].copy(tile);

                // Update the current tile to the next position
                currTile.col++;
                if (currTile.col >= BoardConfig.COLS) {
                    currTile.col = 0;
                    currTile.row++;
                }
            }
        }
    }
    

    getFirstEmptyTile() {
        for (let rowIdx = 0; rowIdx < BoardConfig.ROWS; rowIdx++) {
            for (let colIdx = 0; colIdx < BoardConfig.COLS; colIdx++) {
                if (this.tiles[rowIdx][colIdx].isEmpty()) {
                    return { row: rowIdx, col: colIdx };
                }
            }
        }
    }
}