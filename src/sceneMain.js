class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene", active: false });
    }

    preload() {
    }

    create() {
        this.add.text(100, 100, "We are now on the main scene");
        var fighter = this.add.sprite(100, 150, "test_fighter");
        this.setShipSize(fighter, 1);


    }

    setShipSize(ship, size) {
        let displaySize = 32 * size; 
        ship.displayHeight = displaySize;
        ship.displayWidth = displaySize;
    }
}

export default MainScene;