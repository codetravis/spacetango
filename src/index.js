import Phaser from 'phaser';
import LoadingScene from './sceneLoading.js';
import MainScene from './sceneMain.js';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    parent: 'game-div',
    scene: [LoadingScene, MainScene]
};

const game = new Phaser.Game(config);
