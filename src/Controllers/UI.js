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
        console.log(id);
        switch (id) {
            case UIConfig.PLUS_BUTTON:
                if (!isThereOpenSpace) {
                    return UIConfig.IDLE;
                }
                return this.handlePlusButtonPress();
            case UIConfig.PLAY_AGAIN:
                return UIConfig.PLAY_AGAIN
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