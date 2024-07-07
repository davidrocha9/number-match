import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export const UIConfig = {
    INITIAL_PLUS_CHARGES: 5,

    PLUS_BUTTON_COORDS: new THREE.Vector3(0, -35, 1),
    PLUS_BUTTON_BG_COLOR: 0xD1D1D1,
    PLUS_BUTTON_LINE_COLOR: 0x3185EE,

    PLUS_CHARGES_BG_COLOR: 0x2783EA,
    PLUS_CHARGES_COORDS: new THREE.Vector3(2, -33, 1),

    PLUS_CHARGES_TEXT_COLOR: 0xFFFFFF,

    TROPHY_PATH: '../../assets/images/trophy.png',
    TROPHY_SIZE: 4.5,
    TROPHY_X_OFFSET: -1,
    TROPHY_Y_OFFSET: 35,
    
    FONT_URL: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    SCORE_FONT_SIZE: 3,
    PLUS_CHARGES_FONT_SIZE: 1.25,
    FONT_COLOR: 0x000000,

    PLUS_BUTTON_ID: 'plus-button',

    IDLE: 'idle',
    DUPLICATE_BOARD: 'duplicate-board',
}