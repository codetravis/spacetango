import EventDispatcher from './eventDispatcher.js';

class UIButton extends Phaser.GameObjects.Image {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        this.displayWidth = config.display_width;
        this.displayHeight = config.display_height;
        this.action_name = config.action;
        config.scene.add.existing(this);
        this.setInteractive();
        this.on('pointerdown', this.clicked, this);
    }

    clicked() {
        this.emitter = EventDispatcher.getInstance();
        this.emitter.emit(this.action_name, this);
    }
}

export default UIButton;