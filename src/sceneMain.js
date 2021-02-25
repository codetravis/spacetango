import EventDispatcher from './eventDispatcher.js';
import Spacecraft from './spacecraft.js';
import MoveButton from './moveButton.js';

const RIGHT = "RIGHT";
const LEFT = "LEFT";
const BANK = "BANK";
const TURN = "TURN";
const STRAIGHT = "STRAIGHT";

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
            max_speed: 4,
            agility: 3 });
        this.fighter.setNextManeuver({ speed: 2, maneuver: TURN, direction: RIGHT});
        this.fighter.calculateNewShipPath(this.movesPerTurn);
        this.visibleMoves = [];
        this.actionCounter = 100;
        this.gameState = "PLANNING";
        this.currentSpacecraft = null;

        this.emitter = EventDispatcher.getInstance();
        this.emitter.on("CRAFT_CLICKED", this.setActiveCraft.bind(this));
        this.emitter.on("MOVE_CLICKED", this.setActiveCraftManeuver.bind(this));

    }

    setActiveCraft(spacecraft) {
        this.selectedSpacecraft = spacecraft;
        
        if(this.gameState == "PLANNING") {
            // show move selections for selected ship
            this.showPossibleMoves();
        }
    }

    showPossibleMoves() {
        if(this.selectedSpacecraft !== null) {
            // determine possible moves from craft + pilot
            // create list of moves
            this.possibleMoves = [
                { speed: 2, maneuver: STRAIGHT, direction: ""}, 
                { speed: 2, maneuver: BANK, direction: RIGHT},
                { speed: 2, maneuver: BANK, direction: LEFT},
                { speed: 2, maneuver: TURN, direction: RIGHT},
                { speed: 2, maneuver: TURN, direction: LEFT} 
            ];
            this.visibleMoves = [];
            // draw first three moves
            if(this.possibleMoves.length >= 3) {
                this.visibleMoves.push(new MoveButton({
                    scene: this, 
                    x: 50,
                    y: 600,
                    key: this.possibleMoves[0].maneuver + "_move_button", 
                    display_width: 64,
                    display_height: 96,
                    action_name: "MOVE_CLICKED",
                    maneuver: this.possibleMoves[0].maneuver,
                    direction: this.possibleMoves[0].direction,
                    speed: this.possibleMoves[0].speed
                }));
                this.visibleMoves.push(new MoveButton({
                    scene: this, 
                    x: 150,
                    y: 600,
                    key: this.possibleMoves[1].maneuver + "_move_button", 
                    display_width: 64,
                    display_height: 96,
                    action_name: "MOVE_CLICKED",
                    maneuver: this.possibleMoves[1].maneuver,
                    direction: this.possibleMoves[1].direction,
                    speed: this.possibleMoves[1].speed
                }));
                this.visibleMoves.push(new MoveButton({
                    scene: this, 
                    x: 250,
                    y: 600,
                    key: this.possibleMoves[2].maneuver + "_move_button", 
                    display_width: 64,
                    display_height: 96,
                    action_name: "MOVE_CLICKED",
                    maneuver: this.possibleMoves[2].maneuver,
                    direction: this.possibleMoves[2].direction,
                    speed: this.possibleMoves[2].speed
                }));
            }
        }
    }

    setActiveCraftManeuver(moveButton) {
        if(this.selectedSpacecraft !== null) {
            this.selectedSpacecraft.setNextManeuver({speed: moveButton.speed, maneuver: moveButton.maneuver, direction: moveButton.direction});
            this.startActionState();
        }
    }

    startActionState() {
        this.visibleMoves.forEach( function(moveCard) {
            moveCard.destroy();
        });
        this.selectedSpacecraft.calculateNewShipPath(this.movesPerTurn);
        this.gameState = "ACTION";
        this.actionCounter = 100;
    }

    update() {
        if(this.actionCounter > 0 && this.gameState == "ACTION") {
            this.actionCounter -= 1;
            this.selectedSpacecraft.updateShipOnPath();

            if(this.selectedSpacecraft.movePath.length == 0) {
                this.logtext.setText("Out of Moves");
            }
        } else {
            this.gameState = "PLANNING";
            this.actionCounter = 0;
        }
    }
}

export default MainScene;