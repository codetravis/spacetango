import testFighterImg from './assets/images/test_fighter.svg';
import testOldFighterImg from './assets/images/test_old_fighter.svg';

class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoadingScene" });
    }

    preload() {
        this.load.image("test_fighter", testFighterImg);
        this.load.image("test_old_fighter", testOldFighterImg);
    }

    create() {
        this.scene.start("MainScene");
    }
}

export default LoadingScene;