import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { UIConfig } from '../Constants/UIConfig.js';

export class UIView {
    constructor(model) {
        this.model = model;
        this.group = new THREE.Group();
        this.draw();
    }

    draw() {
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

    getElements() {
        return this.group.children;
    }

    getClickedElementId(intersects) {
        for (let i = 0; i < intersects.length; i++) {
            const intersect = intersects[i];
            const object = intersect.object;
            const id = object.uuid;

            if (this.checkIfPlusButtonWasClicked(id)) {
                return UIConfig.PLUS_BUTTON_ID;
            }
        }
    }

    checkIfPlusButtonWasClicked(id) {
        return id === this.plusLine.uuid || id === this.backCircle.uuid || id === this.chargesCircle.uuid;
    }
}