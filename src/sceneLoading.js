class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoadingScene" });
    }

    preload() {
        this.load.image("test_fighter", "images/test_fighter.svg");
        this.load.image("test_old_fighter", "images/test_old_fighter.svg");
    }

    create() {
        this.scene.start("MainScene");
    }
}

export default LoadingScene;