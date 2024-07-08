import { UIConfig } from "../Constants/UIConfig.js";
import { UIModel } from "../Models/UIModel.js";

export class UI {
    constructor(model) {
        this.model = model;
    }

    increase(points) {
        this.model.score += points;
    }

    handleClick(id, isThereOpenSpace) {
        switch (id) {
            case UIConfig.PLUS_BUTTON_ID:
                if (!isThereOpenSpace) {
                    return UIConfig.IDLE;
                }
                return this.handlePlusButtonPress();
            default:
                break;
        }
    }

    handlePlusButtonPress() {
        if (this.model.plusCharges <= 0) {
            return UIConfig.IDLE;
        }

        this.model.plusCharges--;

        return UIConfig.DUPLICATE_BOARD;
    }
}