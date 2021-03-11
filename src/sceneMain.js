import EventDispatcher from './eventDispatcher.js';
import Spacecraft from './spacecraft.js';
import MoveButton from './moveButton.js';
import UIButton from './uiButton.js';
import ManeuverTable from './maneuverTable.js';

const RIGHT = "RIGHT";
const LEFT = "LEFT";
const BANK = "BANK";
const TURN = "TURN";
const STRAIGHT = "STRAIGHT";
const DRIFT = "DRIFT";
const FLIP  = "FLIP";
const READY = "READY";
const WAITING = "WAITING";
const PLANNING = "PLANNING";
const ACTION = "ACTION";
const ENERGY = "ENERGY";
const PROJECTILE = "PROJECTILE";
const MOVES_PER_TURN = 60;

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene", active: false });
    }

    preload() {
    }

    create() {
        this.map_width = 600;
        this.map_height = 600;
        this.drawMapBoundry();
        this.gameState = PLANNING;
        this.allSpacecraft = [];
        this.maneuverTable = new ManeuverTable();
        this.allSpacecraft.push(new Spacecraft({ 
            scene: this, 
            id: 1,
            x: 500, 
            y: 200, 
            key: "test_fighter", 
            team: 1,
            angle: 179.99, 
            size: 1, 
            speed: 1, 
            max_speed: 4,
            acceleration: 2,
            brake_thrusters: 1,
            agility: 3,
            hitpoints: 100,
            armor: 50,
            shields: 50,
            weapons: [
                {
                    name: "Light Laser Cannon",
                    type: ENERGY,
                    use_ammo: false,
                    ammo: 0,
                    salvo_size: 1,
                    charge: 0,
                    recharge_rate: 100,
                    damage: 10,
                    range: 200,
                },
            ],
         }));
        this.allSpacecraft.push(new Spacecraft({ 
            scene: this, 
            id: 2,
            x: 500, 
            y: 100, 
            key: "test_old_fighter", 
            team: 2,
            angle: 180, 
            size: 2, 
            speed: 1, 
            max_speed: 2,
            acceleration: 1, 
            brake_thrusters: 1,
            agility: 2,
            hitpoints: 200,
            armor: 100,
            shields: 20,
            weapons: [
                {
                    name: "Medium Projectile Cannon",
                    type: PROJECTILE,
                    use_ammo: true,
                    ammo: 100,
                    salvo_size: 5,
                    charge: 0,
                    recharge_rate: 2,
                    damage: 3,
                    range: 100
                },
                {
                    name: "Medium Projectile Cannon",
                    type: PROJECTILE,
                    use_ammo: true,
                    ammo: 100,
                    salvo_size: 5,
                    charge: 0,
                    recharge_rate: 2,
                    damage: 3,
                    range: 100
                },
            ],
         }));
        this.visibleMoves = [];
        this.movePage = 0;
        this.actionCounter = 61;
        this.gameState = PLANNING;
        this.currentSpacecraft = null;

        this.actionButton = new UIButton({
            scene: this,
            x: 650, 
            y: 750, 
            key: "action_button", 
            action: "ACTION_CLICKED",
            display_height: 90,
            display_width: 180
        });

        this.emitter = EventDispatcher.getInstance();
        this.emitter.on("CRAFT_CLICKED", this.setActiveCraft.bind(this));
        this.emitter.on("MOVE_CLICKED", this.setActiveCraftManeuver.bind(this));
        this.emitter.on("ACTION_CLICKED", this.startActionState.bind(this));
        this.emitter.on("PREVIOUS_MOVES_CLICKED", this.updateMovePage.bind(this));
        this.emitter.on("NEXT_MOVES_CLICKED", this.updateMovePage.bind(this));
    }

    drawMapBoundry() {
        let top_line = this.add.line(0, 0, 50, 1, this.map_width + 50, 1, 0xffffff);
        top_line.setOrigin(0, 0);
        //this.bottomHUDCamera.ignore(top_line);
        let left_line = this.add.line(0, 0, 50, 1, 50, this.map_height, 0xffffff);
        left_line.setOrigin(0, 0);
        //this.bottomHUDCamera.ignore(left_line);
        let right_line = this.add.line(0, 0, this.map_width + 50, 1, this.map_width + 50, this.map_height, 0xffffff);
        right_line.setOrigin(0, 0);
        //this.bottomHUDCamera.ignore(right_line);
        let bottom_line = this.add.line(0, 0, 50, this.map_height, this.map_width + 50, this.map_height, 0xffffff);
        bottom_line.setOrigin(0, 0);
        //this.bottomHUDCamera.ignore(bottom_line);
    }

    setActiveCraft(spacecraft) {
        this.selectedSpacecraft = spacecraft;
        console.log(spacecraft.angle);
        
        if(this.gameState == PLANNING) {
            // show move selections for selected ship
            this.cleanUpMoveSelector();
            this.showPossibleMoves();
        }
    }

    showPossibleMoves() {
        this.visibleMoves.forEach( function(moveCard) {
            moveCard.remove();
        });

        if(this.selectedSpacecraft !== null) {
            // determine possible moves from craft + pilot
            // create list of moves
            this.possibleMoves = this.generateCraftManeuverList(this.selectedSpacecraft);
            this.visibleMoves = [];
            if (this.movePage > this.possibleMoves.length / 3) {
                this.movePage -= 1;
            }
            
            if(!this.previousMoves) {
                this.previousMoves = new UIButton({
                    scene: this,
                    x: 50, 
                    y: 700, 
                    key: "previous_arrow", 
                    action: "PREVIOUS_MOVES_CLICKED",
                    display_height: 64,
                    display_width: 64
                });
            }

            if(!this.nextMoves) {
                this.nextMoves = new UIButton({
                    scene: this,
                    x: 450, 
                    y: 700, 
                    key: "next_arrow", 
                    action: "NEXT_MOVES_CLICKED",
                    display_height: 64,
                    display_width: 64
                });
            }

            for(let i = 0; i < 3 && (i + this.movePage * 3) < this.possibleMoves.length; i++) {
                let move_card = this.possibleMoves[i + (this.movePage * 3)];          
                this.visibleMoves.push(new MoveButton({
                    scene: this, 
                    x: 150 + (i * 100),
                    y: 650,
                    key: move_card.maneuver + "_move_button", 
                    display_width: 64,
                    display_height: 96,
                    action_name: "MOVE_CLICKED",
                    maneuver: move_card.maneuver,
                    direction: move_card.direction,
                    speed: move_card.speed
                }));
            }
        }
    }

    generateCraftManeuverList(spacecraft) {
        let maneuvers = [];
        // load all possible moves
        let all_maneuvers = this.maneuverTable.listManeuvers();
        // filter by speed and agility
        for(let i = 0; i < all_maneuvers.length; i++) {
            if(spacecraft.agility >= all_maneuvers[i].agility_required - 2 &&
                (spacecraft.speed == all_maneuvers[i].speed || 
                    (spacecraft.speed - spacecraft.brake_thrusters <= all_maneuvers[i].speed && 
                        spacecraft.speed + spacecraft.acceleration >= all_maneuvers[i].speed))) {
                maneuvers.push(all_maneuvers[i]);
            }
        }

        return maneuvers;
    }

    updateMovePage(arrow) {
        if(arrow.action_name == "NEXT_MOVES_CLICKED") {
            this.movePage += 1;
        } else if (arrow.action_name == "PREVIOUS_MOVES_CLICKED") {
            this.movePage -= 1;
        }
        if (this.movePage < 0) {
            this.movePage = 0;
        }
        this.showPossibleMoves();
    }

    setActiveCraftManeuver(moveButton) {
        if(this.selectedSpacecraft !== null) {
            this.selectedSpacecraft.setNextManeuver({speed: moveButton.speed, maneuver: moveButton.maneuver, direction: moveButton.direction});
            this.cleanUpMoveSelector();
        }
    }

    cleanUpMoveSelector() {
        this.visibleMoves.forEach( function(moveCard) {
            moveCard.remove();
        });
        if(this.nextMoves) {
            this.nextMoves.destroy();
            this.nextMoves = null;
        }
        if(this.previousMoves) {
            this.previousMoves.destroy();
            this.previousMoves = null;
        }
        this.movePage = 0;
    }

    startActionState() {
        this.cleanUpMoveSelector();
        this.movePage = 0;
        let can_continue = true;
        this.allSpacecraft.forEach(function(spacecraft) {
            spacecraft.calculateNewShipPath(MOVES_PER_TURN);
            if(spacecraft.status == WAITING && spacecraft.active) {
                can_continue = false;
            }
        });

        if(can_continue) {
            this.gameState = ACTION;
            this.actionCounter = 61;
        }
    }

    checkOutOfBounds() {
        this.allSpacecraft.forEach(function(spacecraft) {
            if(spacecraft.x < 50 || spacecraft.x > this.map_width + 50 || spacecraft.y < 0 || spacecraft.y > this.map_height) {
                spacecraft.destroy();
            }
        }.bind(this));
    }

    sideOfSlope(start_point, angle, target_point) {
        let slope = { x: start_point.x + 100 * Math.sin(angle), y: start_point.y - 100 * Math.cos(angle) };

        //let bracket_y = this.add.line(0, 0, ship_side.x, ship_side.y, slope.x, slope.y, 0xffffff);
        //bracket_y.setOrigin(0, 0);

        // if positive, then on the right side of the slope, if negative, the left side
        return (slope.x - start_point.x) * (target_point.y - start_point.y) - (slope.y - start_point.y) * (target_point.x - start_point.x);
    }

    attackClosestTarget(spacecraft) {
        //console.log("Searching for targets");

        let potential_targets = [];

        this.allSpacecraft.forEach(function(target) {
            if(target.id === spacecraft.id) {
                return;
            }
            // add skip if target is same team as attacker
            if(target.team === spacecraft.team && target.team !== 0) {
                return;
            }

            let angle_radians = spacecraft.angle * Math.PI/180.0;
            for(let k = 0; k < target.target_points.length; k++) {
                // find out if one of the edgees of the target is to right or left side of a line extending from either side of the current spacecraft
                let target_point = target.target_points[k];
                let left_slope = this.sideOfSlope(spacecraft.left_side, angle_radians, target_point);
                let right_slope = this.sideOfSlope(spacecraft.right_side, angle_radians, target_point);
                // if the target is to the right of the left line and to the left of the right line (or vice versa)
                // then it is between the lines and a potential target

                // phaser auto keeps sprite angles betweent -180 and +179.9
                // check that the target is in front of attacker
                let front_point = { x: spacecraft.x + 100 * Math.sin(angle_radians), y: spacecraft.y - 100 * Math.cos(angle_radians) }
                let front_slope = this.sideOfSlope(spacecraft, (spacecraft.angle + 90) * Math.PI/180.0, front_point);
                let target_slope = this.sideOfSlope(spacecraft, (spacecraft.angle + 90) * Math.PI/180.0, target_point);
                //console.log(spacecraft.id + " Front slope " + front_slope + " target slope " + target_slope);
                //console.log("front point " + front_point.x + " " + front_point.y);
                if((front_slope >= 0 && target_slope >= 0) || (front_slope <= 0 && target_slope <= 0)) {
                    // check that the target is in the firing arc / lane
                    if((left_slope < 0 && right_slope > 0) ||
                    (left_slope > 0 && right_slope < 0)) {
                        //console.log("Adding potential target");
                        potential_targets.push(target);
                        //console.log("Potential target found " + left_slope + " " + right_slope);
                        return;
                    }
                }
            }
        }.bind(this));

        if(potential_targets.length === 0) {
            // no targets found
            return;
        }

        let final_target = potential_targets[0];
        let final_target_distance = this.getDistanceBetweenPoints(spacecraft, final_target);
        // find the closest enemy target
        for(let i = 0; i < potential_targets.length; i++) {
            let evaluate_target = potential_targets[i];
            let distance_to_target = this.getDistanceBetweenPoints(spacecraft, evaluate_target);
            if(distance_to_target < final_target_distance) {
                final_target = evaluate_target;
                final_target_distance = distance_to_target;
            }
        }

        // perform attack against final target
        
        for(let j = 0; j < spacecraft.weapons.length; j++) {
            // fire fully charged weapons
            let weapon = spacecraft.weapons[j];
            if(weapon.charge == 100) {
                if(weapon.range >= final_target_distance) {
                    if(!weapon.use_ammo || weapon.ammo > 0) {
                        spacecraft.fireWeapon(j);
                        console.log("Spacecraft " + spacecraft.id + "attacked target " + final_target.id + " with weapon " + weapon.name);
                        // roll for hit
                        let hit_chance = 1; //Math.random() * final_target.size;
                        // roll for defender evade
                        let evade_chance = 0; //Math.random();
                        // assign damage to defender on hit
                        if(hit_chance > evade_chance) {
                            final_target.takeDamage(weapon.damage * weapon.salvo_size);
                            //console.log("Target at range " + final_target_distance + " took damage");
                        }
                    }
                }
            }
            
        }

    }

    getDistanceBetweenPoints(begin, end) {
        return Math.floor(Math.sqrt(Math.pow(end.x - begin.x, 2) + Math.pow(end.y - begin.y, 2)));
    }

    update() {
        if(this.actionCounter > 0 && this.gameState == ACTION) {
            this.actionCounter -= 1;
            // all ships move
            this.allSpacecraft.forEach(function(spacecraft) {
                if(spacecraft.hitpoints > 0) {
                    spacecraft.updateShipOnPath();
                }
            });
            // all ships attempt attacks
            this.allSpacecraft.forEach(function(spacecraft) {
                if(spacecraft.hitpoints > 0) {
                    this.attackClosestTarget(spacecraft);
                }
            }.bind(this));
            // destroyed ships are removed
            this.allSpacecraft.forEach(function(spacecraft) {
                if(spacecraft.hitpoints <= 0) {
                    spacecraft.destroy();
                }
            });

        } else if(this.gameState !== PLANNING) {
            this.checkOutOfBounds();
            this.allSpacecraft.forEach(function(spacecraft) {
                spacecraft.updateShipStatus();
            });
            this.gameState = PLANNING;
            this.actionCounter = 0;
        }
    }
}

export default MainScene;