class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene", active: false });
    }

    preload() {
    }

    create() {
        this.add.text(100, 100, "We are now on the main scene");
    }
}

export default MainScene;