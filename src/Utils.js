import { TileConfig } from "./Constants/TileConfig";
import { BoardConfig } from "./Constants/BoardConfig";
import * as THREE from 'three';

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const worldToScreen = (worldVector, camera, screenWidth, screenHeight) => {
    const vector = worldVector.clone().project(camera);

    vector.x = (vector.x + 1) / 2 * screenWidth;
    vector.y = -(vector.y - 1) / 2 * screenHeight;

    return vector;
};

export const getClickedTileCoords = (event, camera, screenWidth, screenHeight) => {
    const tileCornersInWorldUnits = [
        new THREE.Vector3(-TileConfig.EDGE_SIZE / 2, -TileConfig.EDGE_SIZE / 2, 0),
        new THREE.Vector3(TileConfig.EDGE_SIZE / 2, -TileConfig.EDGE_SIZE / 2, 0),
        new THREE.Vector3(-TileConfig.EDGE_SIZE / 2, TileConfig.EDGE_SIZE / 2, 0),
        new THREE.Vector3(TileConfig.EDGE_SIZE / 2, TileConfig.EDGE_SIZE / 2, 0)
    ];

    const tileCornersInScreenPixels = tileCornersInWorldUnits.map(
        corner => worldToScreen(
            corner,
            camera,
            screenWidth,
            screenHeight
        )
    );
    
    const minX = Math.min(...tileCornersInScreenPixels.map(corner => corner.x));
    const maxX = Math.max(...tileCornersInScreenPixels.map(corner => corner.x));
    const minY = Math.min(...tileCornersInScreenPixels.map(corner => corner.y));
    const maxY = Math.max(...tileCornersInScreenPixels.map(corner => corner.y));

    const tileWidthInScreenPixels = maxX - minX;
    const tileHeightInScreenPixels = maxY - minY;

    const boardTopLeftX = screenWidth / 2 - BoardConfig.COLS / 2 * tileWidthInScreenPixels;
    const boardTopLeftY = screenHeight / 2 - BoardConfig.ROWS / 2 * tileHeightInScreenPixels;

    const clickedRow = Math.floor((event.clientY - boardTopLeftY) / tileHeightInScreenPixels);
    const clickedCol = Math.floor((event.clientX - boardTopLeftX) / tileWidthInScreenPixels);

    return { row: clickedRow, col: clickedCol };
};
