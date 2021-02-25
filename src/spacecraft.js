import EventDispatcher from './eventDispatcher.js';

const STRAIGHT = "STRAIGHT";
const RIGHT = "RIGHT";
const LEFT = "LEFT";
const BANK = "BANK";
const TURN = "TURN";
const DRIFT = "DRIFT";
const FLIP  = "FLIP";

class Spacecraft extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);

        this.displayWidth = config.size * 32;
        this.scaleY = this.scaleX;
        this.angle = config.angle;
        this.max_speed = config.max_speed;
        this.acceleration = config.acceleration;
        this.brake_thrusters = config.brake_thrusters;
        this.speed = config.speed;
        this.agility = config.agility;
        this.hitpoints = config.hitpoints;
        this.armor = config.armor;
        this.shields = config.shields;
        this.movePath = [];
        this.nextManeuver = {speed: this.speed, maneuver: STRAIGHT, direction: ""};
        this.status = "WAITING";

        this.pilot_id = null;
        if("pilot_id" in config) {
            this.pilot_id = config.pilot_id;
        }

        config.scene.add.existing(this);
        this.setInteractive();
        this.on('pointerdown', this.clicked, this);
    }

    clicked() {
        // switch image to selected?
        // alternatively draw a green square behind this?
        this.emitter = EventDispatcher.getInstance();
        this.emitter.emit("CRAFT_CLICKED", this);
    }

    setNextManeuver(nextManeuver) {
        this.nextManeuver = nextManeuver;
        this.status = "READY";
    }

    updateShipStatus() {
        this.speed = this.nextManeuver.speed;
        this.status = "WAITING";
    }

    calculateNewShipPath(movesPerTurn) {
        this.movePath = [];
        let speed = this.nextManeuver.speed;
        let maneuver = this.nextManeuver.maneuver;

        let rotationPerTick = 0;
        if(maneuver == DRIFT) {
            rotationPerTick = 15.0 / movesPerTurn;
        } else if(maneuver == BANK) {
            rotationPerTick = 45.0 / movesPerTurn;
        } else if (maneuver == TURN) {
            rotationPerTick = 90.0 / movesPerTurn;
        }

        if(this.nextManeuver.direction == LEFT) {
            rotationPerTick = rotationPerTick * -1;
        }

        let last_x = this.x;
        let last_y = this.y;
        let last_angle = this.angle;
        
        for( let i = 0; i < movesPerTurn; i++) {
            let rotationRadians = (last_angle + rotationPerTick) * Math.PI / 180.0;
            let x = last_x + (speed * Math.sin(rotationRadians));
            let y = last_y - (speed * Math.cos(rotationRadians));

            let newAngle = last_angle + rotationPerTick;
            if(maneuver == FLIP && i == 2 * movesPerTurn/3) {
                newAngle = last_angle + 180.0;
                speed = 1;
                this.nextManeuver.speed = 1;
            }
            this.movePath.push({x: x, y: y, angle: newAngle});
            last_x = x;
            last_y = y;
            last_angle = newAngle;
        }

    }

    updateShipOnPath() {
        if(this.movePath.length > 0) {
            let nextMove = this.movePath.shift();
            this.x = nextMove.x;
            this.y = nextMove.y;
            this.angle = nextMove.angle;
        }
    }
}

export default Spacecraft;