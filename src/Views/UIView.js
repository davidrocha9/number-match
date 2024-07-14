import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
import { UIConfig } from '../Constants/UIConfig.js';

export class UIView {
    constructor(model) {
        this.model = model;
        this.group = new THREE.Group();
        this.draw();
    }

    draw() {
        this._uiDict = {};

        this.drawTrophy();
        this.drawScoreText();
        this.drawPlusButton();
    }

    drawTrophy() {
        // Load the texture (logo image)
        const loader = new THREE.TextureLoader();
        loader.load(UIConfig.TROPHY_PATH, (texture) => {
            // Create a plane geometry and a material using the loaded texture
            const geometry = new THREE.PlaneGeometry(UIConfig.TROPHY_SIZE, UIConfig.TROPHY_SIZE);
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
            
            // Create a mesh with the geometry and material
            this.trophy = new THREE.Mesh(geometry, material);

            this.trophy.position.set(UIConfig.TROPHY_X_OFFSET, UIConfig.TROPHY_Y_OFFSET,0)

            // Add the plane to this.group
            this.group.add(this.trophy);
        });
    }

    drawScoreText() {
        const loader = new THREE.FontLoader();
        loader.load(UIConfig.FONT_URL, (font) => {
            const geometry = new THREE.TextGeometry(String(this.model.score), {
                font: font,
                size: UIConfig.SCORE_FONT_SIZE,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.5,
                bevelSize: 0.3,
                bevelOffset: 0,
                bevelSegments: 5,
            });
            const material = new THREE.MeshBasicMaterial({ color: UIConfig.FONT_COLOR });
            this.scoreText = new THREE.Mesh(geometry, material);
            
            geometry.computeBoundingBox();
            const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            const textXCoord = textWidth / 2;
            const textYCoord = 35 - textHeight / 2;
            this.scoreText.position.set(textXCoord, textYCoord, 0);

            this.group.add(this.scoreText);
        });
    }

    drawPlusChargesText() {
        const loader = new THREE.FontLoader();
        loader.load(UIConfig.FONT_URL, (font) => {
            const geometry = new THREE.TextGeometry(String(this.model.plusCharges), {
                font: font,
                size: UIConfig.PLUS_CHARGES_FONT_SIZE,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.5,
                bevelSize: 0.3,
                bevelOffset: 0,
                bevelSegments: 5,
            });
            const material = new THREE.MeshBasicMaterial({ color: UIConfig.PLUS_CHARGES_TEXT_COLOR });
            this.plusChargesText = new THREE.Mesh(geometry, material);
            
            geometry.computeBoundingBox();
            const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
            const textXCoord = 1 + textWidth / 2;
            const textYCoord = -33 - textHeight / 2;
            this.plusChargesText.position.set(textXCoord, textYCoord, 1);

            this.group.add(this.plusChargesText);
        });
    }

    drawPlusButton() {
        const backCircleGeometry = new THREE.CircleGeometry(3, 64);  // Radius of 1 and 32 segments
        const backCircleMaterial = new THREE.MeshBasicMaterial({ color: UIConfig.PLUS_BUTTON_BG_COLOR });  // Yellow color
        this.backCircle = new THREE.Mesh(backCircleGeometry, backCircleMaterial);
        this.backCircle.position.set(
            UIConfig.PLUS_BUTTON_COORDS.x,
            UIConfig.PLUS_BUTTON_COORDS.y,
            UIConfig.PLUS_BUTTON_COORDS.z
        );

        const plusLinesMaterial = new THREE.LineBasicMaterial({ color: UIConfig.PLUS_BUTTON_LINE_COLOR });
        const points = [];
        points.push(new THREE.Vector3(0, 0, 1));
        points.push(new THREE.Vector3(1.5, 0, 1));
        points.push(new THREE.Vector3(0, 0, 1));
        points.push(new THREE.Vector3(0, 1.5, 1));
        points.push(new THREE.Vector3(0, 0, 1));
        points.push(new THREE.Vector3(-1.5, 0, 1));
        points.push(new THREE.Vector3(0, 0, 1));
        points.push(new THREE.Vector3(0, -1.5, 1));

        const plusLineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        this.plusLine = new THREE.Line(plusLineGeometry, plusLinesMaterial);
        this.plusLine.position.set(
            UIConfig.PLUS_BUTTON_COORDS.x,
            UIConfig.PLUS_BUTTON_COORDS.y + 0.5,
            UIConfig.PLUS_BUTTON_COORDS.z
        );

        const chargesCircleGeometry = new THREE.CircleGeometry(1.25, 64);  // Radius of 1 and 32 segments
        const chargesCircleMaterial = new THREE.MeshBasicMaterial({ color: UIConfig.PLUS_CHARGES_BG_COLOR });  // Yellow color
        this.chargesCircle = new THREE.Mesh(chargesCircleGeometry, chargesCircleMaterial);
        this.chargesCircle.position.set(
            UIConfig.PLUS_CHARGES_COORDS.x,
            UIConfig.PLUS_CHARGES_COORDS.y,
            UIConfig.PLUS_CHARGES_COORDS.z
        );

        this.group.add(this.backCircle);
        this.group.add(this.plusLine);
        this.group.add(this.chargesCircle);

        this._uiDict[this.backCircle.uuid] = UIConfig.PLUS_BUTTON;
        this._uiDict[this.plusLine.uuid] = UIConfig.PLUS_BUTTON;
        this._uiDict[this.chargesCircle.uuid] = UIConfig.PLUS_BUTTON;

        this.drawPlusChargesText();
    }

    updateScore(model) {
        this.model = model;

        this.group.remove(this.scoreText);
        this.drawScoreText();
    }

    updateUi(model) {
        this.model = model;

        this.group.remove(this.plusChargesText);
        this.drawPlusChargesText();
    }

    showGameEndScreen() {
        const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
        const initialOpacity = 0.0;
        const targetOpacity = 0.7;
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: initialOpacity
        });
        const scrim = new THREE.Mesh(geometry, material);
        scrim.position.set(0, 0, 2);
        this.group.add(scrim);

        const tween = new TWEEN.Tween({ opacity: initialOpacity })
            .to({ opacity: targetOpacity }, 500) // Fade out over 1000ms (1 second)
            .onUpdate((object) => {
                scrim.material.opacity = object.opacity;
            })
            .onComplete(async () => {
                this.displayGameEndScore();
            })
            .start();
    }

    displayGameEndScore() {
        // Create the score text
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const scoreTextGeometry = new THREE.TextGeometry(`Score: ${this.model.score}`, {
                font: font,
                size: 2,
                height: 1,
                curveSegments: 12,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff, 
                transparent: true, 
                opacity: 0
            });

            const scoreText = new THREE.Mesh(scoreTextGeometry, textMaterial);
            scoreTextGeometry.computeBoundingBox();
            const scoreTextWidth = scoreTextGeometry.boundingBox.max.x - scoreTextGeometry.boundingBox.min.x;
            const scoreTextHeight = scoreTextGeometry.boundingBox.max.y - scoreTextGeometry.boundingBox.min.y;
            scoreText.position.set(-scoreTextWidth / 2, 3 - scoreTextHeight, 3);

            const endMessageTextGeometry = new THREE.TextGeometry(`Well Played!`, {
                font: font,
                size: 4,
                height: 1,
                curveSegments: 12,
            });
            const endMessageMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff, 
                transparent: true, 
                opacity: 0
            });

            const endMessageText = new THREE.Mesh(endMessageTextGeometry, endMessageMaterial);
            endMessageTextGeometry.computeBoundingBox();
            const endMessageTextWidth = endMessageTextGeometry.boundingBox.max.x - endMessageTextGeometry.boundingBox.min.x;
            endMessageText.position.set(-endMessageTextWidth / 2, 7.5 - scoreTextHeight, 3);

            this.group.add(scoreText, endMessageText);

            const tween = new TWEEN.Tween({ opacity: 0 })
                .to({ opacity: 1 }, 500) // Fade out over 1000ms (1 second)
                .onUpdate((object) => {
                    endMessageText.material.opacity = object.opacity;
                    scoreText.material.opacity = object.opacity;
                })
                .onComplete(async () => {
                    this.addPlayAgainButton();
                })
                .start();
        });
    }

    addPlayAgainButton() {
        // Create the blue rectangle with rounded edges
        const buttonWidth = 20;
        const buttonHeight = 7.5;
        const radius = 1.5;
        const shape = new THREE.Shape();
        shape.moveTo(-buttonWidth / 2 + radius, -buttonHeight / 2);
        shape.lineTo(buttonWidth / 2 - radius, -buttonHeight / 2);
        shape.quadraticCurveTo(buttonWidth / 2, -buttonHeight / 2, buttonWidth / 2, -buttonHeight / 2 + radius);
        shape.lineTo(buttonWidth / 2, buttonHeight / 2 - radius);
        shape.quadraticCurveTo(buttonWidth / 2, buttonHeight / 2, buttonWidth / 2 - radius, buttonHeight / 2);
        shape.lineTo(-buttonWidth / 2 + radius, buttonHeight / 2);
        shape.quadraticCurveTo(-buttonWidth / 2, buttonHeight / 2, -buttonWidth / 2, buttonHeight / 2 - radius);
        shape.lineTo(-buttonWidth / 2, -buttonHeight / 2 + radius);
        shape.quadraticCurveTo(-buttonWidth / 2, -buttonHeight / 2, -buttonWidth / 2 + radius, -buttonHeight / 2);
    
        const buttonGeometry = new THREE.ShapeGeometry(shape);
        const buttonMaterial = new THREE.MeshBasicMaterial({ color: UIConfig.PLUS_CHARGES_BG_COLOR, transparent: true, opacity: 0 });
        const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
        buttonMesh.position.set(0, -5, 3); // Position it below the score text
        
    
        // Create the "Play Again" text
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const playAgainTextGeometry = new THREE.TextGeometry('Play Again', {
                font: font,
                size: 2,
                height: 1,
                curveSegments: 12,
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: UIConfig.PLUS_CHARGES_TEXT_COLOR, transparent: true, opacity: 0 });
    
            const playAgainText = new THREE.Mesh(playAgainTextGeometry, textMaterial);
            playAgainTextGeometry.computeBoundingBox();
            const playAgainTextWidth = playAgainTextGeometry.boundingBox.max.x - playAgainTextGeometry.boundingBox.min.x;
            const playAgainTextHeight = playAgainTextGeometry.boundingBox.max.y - playAgainTextGeometry.boundingBox.min.y;
            playAgainText.position.set(-playAgainTextWidth / 2, -playAgainTextHeight / 4, 1);
    
            buttonMesh.add(playAgainText);
    
            // Add the button mesh to your scene or group
            this.group.add(buttonMesh);
    
            // Tween to fade in the button
            const tween = new TWEEN.Tween({ opacity: 0 })
                .to({ opacity: 1 }, 500) // Fade in over 500ms (0.5 second)
                .onUpdate((object) => {
                    buttonMesh.material.opacity = object.opacity;
                    playAgainText.material.opacity = object.opacity;
                })
                .start();

            this._uiDict[buttonMesh.uuid] = UIConfig.PLAY_AGAIN;
            this._uiDict[playAgainText.uuid] = UIConfig.PLAY_AGAIN;

        });
    }
    

    getElements() {
        return this.group.children;
    }

    getClickedElementId(intersects) {
        for (let i = 0; i < intersects.length; i++) {
            const intersect = intersects[i];
            const object = intersect.object;
            const id = object.uuid;

            if (id in this._uiDict) {
                return this._uiDict[id];
            }
        }
    }
}