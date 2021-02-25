import testFighterImg from './assets/images/test_fighter.svg';
import testOldFighterImg from './assets/images/test_old_fighter.svg';
import straightMoveImg from './assets/images/straight_move.svg';
import bankMoveImg from './assets/images/bank_move.svg';
import turnMoveImg from './assets/images/turn_move.svg';

class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoadingScene" });
    }

    preload() {
        this.load.image("test_fighter", testFighterImg);
        this.load.image("test_old_fighter", testOldFighterImg);
        this.load.image('STRAIGHT_move_button', straightMoveImg);
        this.load.image('BANK_move_button', bankMoveImg);
        this.load.image('TURN_move_button', turnMoveImg);
    }

    create() {
        this.scene.start("MainScene");
    }
}

export default LoadingScene;