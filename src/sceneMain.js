import EventDispatcher from './eventDispatcher.js';
import Spacecraft from './spacecraft.js';

const RIGHT = "RIGHT";
const LEFT = "LEFT";
const BANK = "BANK";
const TURN = "TURN";

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene", active: false });
    }

    preload() {
    }

    create() {
        this.gameState = "PLANNING";
        this.movesPerTurn = 60;
        this.logtext = this.add.text(100, 100, "We are now on the main scene");
        this.fighter = new Spacecraft({ 
            scene: this, 
            x: 500, 
            y: 500, 
            key: "test_fighter", 
            angle: 180, 
            size: 1, 
            speed: 0, 
            max_speed: 4, });
        this.fighter.setNextManeuver({ speed: 2, maneuver: TURN, direction: RIGHT});
        this.fighter.calculateNewShipPath(this.movesPerTurn);
        this.actionCounter = 100;
        this.gameState = "ACTION";
        this.currentSpacecraft = null;

        this.emitter = EventDispatcher.getInstance();
        this.emitter.on("CRAFT_CLICKED", this.setActiveCraft.bind(this));
    }

    setActiveCraft(spacecraft) {
        this.selectedSpacecraft = spacecraft;
    }

    update() {
        if(this.actionCounter > 0 && this.gameState == "ACTION") {
            this.actionCounter -= 1;
            this.fighter.updateShipOnPath();

            if(this.fighter.movePath.length == 0) {
                this.logtext.setText("Out of Moves");
            }
        } else {
            this.gameState = "PLANNING";
            this.actionCounter = 0;
        }
    }
}

export default MainScene;