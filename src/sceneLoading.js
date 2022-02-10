import testFighterImg from './assets/images/test_fighter.svg';
import testOldFighterImg from './assets/images/test_old_fighter.svg';
import razorwindFighterImg from './assets/images/razorwind_fighter.png';
import straightMoveImg from './assets/images/straight_move.svg';
import driftMoveImg from './assets/images/drift_move.svg';
import flipMoveImg from './assets/images/flip_move.svg';
import bankMoveImg from './assets/images/bank_move.svg';
import turnMoveImg from './assets/images/turn_move.svg';
import actionButtonImg from './assets/images/action_button.svg';
import nextArrowImg from './assets/images/next_arrow.svg';
import previousArrowImg from './assets/images/previous_arrow.svg';
import defaultPilotImg from './assets/images/default_pilot.svg';

class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoadingScene" });
    }

    preload() {
        this.load.image("test_fighter", testFighterImg);
        this.load.image("test_old_fighter", testOldFighterImg);
        this.load.image("razorwind_fighter", razorwindFighterImg);
        this.load.image('STRAIGHT_move_button', straightMoveImg);
        this.load.image('FLIP_move_button', flipMoveImg);
        this.load.image('DRIFT_move_button', driftMoveImg);
        this.load.image('BANK_move_button', bankMoveImg);
        this.load.image('TURN_move_button', turnMoveImg);
        this.load.image('action_button', actionButtonImg);
        this.load.image('next_arrow', nextArrowImg);
        this.load.image('previous_arrow', previousArrowImg);
        this.load.image('default_pilot', defaultPilotImg);
    }

    create() {
        this.scene.start("MainScene");
    }
}

export default LoadingScene;