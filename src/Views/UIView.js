import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { UIConfig } from '../Constants/UIConfig';

export class UIView {
    constructor(model) {
        this.model = model;
        this.group = new THREE.Group();
        this.draw();
    }

    draw() {
        this.drawTrophy();
        this.drawText();
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

    drawText() {
        const loader = new THREE.FontLoader();
        loader.load(UIConfig.FONT_URL, (font) => {
            const geometry = new THREE.TextGeometry(String(this.model.score), {
                font: font,
                size: UIConfig.FONT_SIZE,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.5,
                bevelSize: 0.3,
                bevelOffset: 0,
                bevelSegments: 5,
            });
            const material = new THREE.MeshBasicMaterial({ color: UIConfig.FONT_COLOR });
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

    drawPlusButton() {
        const circleGeometry = new THREE.CircleGeometry(3, 64);  // Radius of 1 and 32 segments
        const circleMaterial = new THREE.MeshBasicMaterial({ color: UIConfig.PLUS_BUTTON_COLOR });  // Yellow color
        this.circle = new THREE.Mesh(circleGeometry, circleMaterial);
        this.circle.position.set(
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

        this.group.add(this.circle);
        this.group.add(this.plusLine);
    }

    update(model) {
        this.model = model;

        this.group.remove(this.textMesh);
        this.drawText();
    }

    getElements() {
        return this.group.children;
    }

    getClickedElementTag(intersects) {
        console.log(intersects)
    }
}