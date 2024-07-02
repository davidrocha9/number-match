import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { ScoreConfig } from '../Constants/ScoreConfig';

export class ScoreView {
    constructor(model) {
        this.model = model;
        this.group = new THREE.Group();
        this.draw();
    }

    draw() {
        this.drawTrophy();
        this.drawText();
    }

    drawTrophy() {
        // Load the texture (logo image)
        const loader = new THREE.TextureLoader();
        loader.load(ScoreConfig.TROPHY_PATH, (texture) => {
            // Create a plane geometry and a material using the loaded texture
            const geometry = new THREE.PlaneGeometry(ScoreConfig.TROPHY_SIZE, ScoreConfig.TROPHY_SIZE);
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            
            // Create a mesh with the geometry and material
            this.trophy = new THREE.Mesh(geometry, material);

            this.trophy.position.set(ScoreConfig.TROPHY_X_OFFSET, ScoreConfig.TROPHY_Y_OFFSET,0)

            // Add the plane to this.group
            this.group.add(this.trophy);
        });
    }

    drawText() {
        const loader = new THREE.FontLoader();
        loader.load(ScoreConfig.FONT_URL, (font) => {
            const geometry = new THREE.TextGeometry(String(this.model.score), {
                font: font,
                size: ScoreConfig.FONT_SIZE,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.5,
                bevelSize: 0.3,
                bevelOffset: 0,
                bevelSegments: 5,
            });
            const material = new THREE.MeshBasicMaterial({ color: ScoreConfig.FONT_COLOR });
            this.textMesh = new THREE.Mesh(geometry, material);
            

            geometry.computeBoundingBox();
            const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            const textXCoord = textWidth / 2;
            const textYCoord = 35 - textHeight / 2;
            this.textMesh.position.set(textXCoord, textYCoord, 0);

            this.group.add(this.textMesh);
        });
    }

    update() {
        this.group.remove(this.textMesh);
        this.drawText();
    }
}