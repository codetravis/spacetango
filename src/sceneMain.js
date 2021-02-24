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
        this.fighter = this.add.sprite(500, 500, "test_fighter");
        this.setShipSize(this.fighter, 1);
        this.fighter.angle = 90;
        this.fighter.nextManeuver = { speed: 3, maneuver: "BANK", direction: "RIGHT"};
        this.calculateShipPath(this.fighter);
        this.actionCounter = 100;
        this.gameState = "ACTION";
    }

    setShipSize(ship, size) {
        let displaySize = 32 * size; 
        ship.displayHeight = displaySize;
        ship.displayWidth = displaySize;
    }

    calculateShipPath(ship) {
        ship.movePath = [];
        let speed = ship.nextManeuver.speed;
        let maneuver = ship.nextManeuver.maneuver;

        let rotationPerTick = 0;
        if(maneuver == "BANK") {
            rotationPerTick = 45.0 / this.movesPerTurn;
        } else if (maneuver == "TURN") {
            rotationPerTick = 90.0 / this.movesPerTurn;
        }

        if(ship.nextManeuver.direction == "LEFT") {
            rotationPerTick = rotationPerTick * -1;
        }

        let last_x = ship.x;
        let last_y = ship.y;
        let last_angle = ship.angle;
        
        for( let i = 0; i < this.movesPerTurn; i++) {
            let rotationRadians = (last_angle + rotationPerTick) * Math.PI / 180.0;
            let x = last_x + (speed * Math.sin(rotationRadians));
            let y = last_y - (speed * Math.cos(rotationRadians));

            let newAngle = last_angle + rotationPerTick;
            ship.movePath.push({x: x, y: y, angle: newAngle});
            last_x = x;
            last_y = y;
            last_angle = newAngle;
        }

    }

    updateShipOnPath(ship) {
        if(ship.movePath.length > 0) {
            let nextMove = ship.movePath.shift();
            ship.x = nextMove.x;
            ship.y = nextMove.y;
            ship.angle = nextMove.angle;
        }
    }

    update() {
        if(this.actionCounter > 0 && this.gameState == "ACTION") {
            this.actionCounter -= 1;
            this.updateShipOnPath(this.fighter);

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