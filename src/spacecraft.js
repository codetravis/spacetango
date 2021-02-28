import EventDispatcher from './eventDispatcher.js';

const STRAIGHT = "STRAIGHT";
const RIGHT = "RIGHT";
const LEFT = "LEFT";
const BANK = "BANK";
const TURN = "TURN";
const DRIFT = "DRIFT";
const FLIP  = "FLIP";
const READY = "READY";
const WAITING = "WAITING";

class Spacecraft extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);

        this.displayWidth = config.size * 32;
        this.size = config.size;
        this.scaleY = this.scaleX;
        this.angle = config.angle;
        this.id = config.id;
        this.team = config.team || 0;
        this.max_speed = config.max_speed;
        this.acceleration = config.acceleration;
        this.brake_thrusters = config.brake_thrusters;
        this.speed = config.speed;
        this.agility = config.agility;
        this.hitpoints = config.hitpoints;
        this.armor = config.armor;
        this.shields = config.shields;
        this.weapons = config.weapons;
        this.movePath = [];
        this.nextManeuver = {speed: this.speed, maneuver: STRAIGHT, direction: ""};
        this.status = WAITING;

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
        this.status = READY;
    }

    updateShipStatus() {
        this.speed = this.nextManeuver.speed;
        this.status = WAITING;
    }

    calculateNewShipPath(movesPerTurn) {
        this.movePath = [];
        let speed = this.nextManeuver.speed;
        let maneuver = this.nextManeuver.maneuver;

        let rotationPerTick = 0;
        if(maneuver == DRIFT) {
            rotationPerTick = 10.0 / movesPerTurn;
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

    takeDamage(amount) {

        // apply damage to shields first
        if(amount > 0 && this.shields > 0) {
            if(amount > this.shields) {
                amount = amount - this.shields;
                this.shields = 0;
            } else {
                this.shields = this.shields - amount;
                amount = 0;
            }
        }

        // if damage left over apply to armor
        if(amount > 0 && this.armor > 0) {
            if(amount > this.armor) {
                amount = amount - this.armor;
                this.armor = 0;
            } else {
                this.armor = this.armor - amount;
                amount = 0;
            }
        } 

        // any final damage remaining is applied to hp
        if(amount > 0 && this.hitpoints > 0) {
            if(amount > this.hitpoints) {
                this.hitpoints = 0;
            } else {
                this.hitpoints = this.hitpoints - amount;
                amount = 0;
            }
        } 
    }

    fireWeapon(index) {
        let weapon = this.weapons[index];
        
        weapon.charge = 0;
        if(weapon.use_ammo) {
            weapon.ammo = Math.max(0, weapon.ammo - weapon.salvo_size);
        }

    }

    updateShipOnPath() {
        if(this.movePath.length > 0) {
            let nextMove = this.movePath.shift();
            this.x = nextMove.x;
            this.y = nextMove.y;
            this.angle = nextMove.angle;
            this.weapons.forEach(function (weapon) {
                if(weapon.charge < 100) {
                    weapon.charge = Math.min(100, weapon.charge + weapon.recharge_rate);
                }
            });
        }
    }
}

export default Spacecraft;