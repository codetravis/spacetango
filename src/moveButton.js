import EventDispatcher from './eventDispatcher.js';

class MoveButton extends Phaser.GameObjects.Image {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        this.displayWidth = config.display_width;
        this.displayHeight = config.display_height;
        this.action_name = config.action_name;
        this.maneuver = config.maneuver;
        this.direction = config.direction;
        this.speed = config.speed;
        if(this.direction == "LEFT") {
            this.setFlipX(true);
        }
        config.scene.add.existing(this);
        this.setInteractive();
        this.on('pointerdown', this.clicked, this);
    }

    clicked() {
        this.emitter = EventDispatcher.getInstance();
        this.emitter.emit(this.action_name, this);
    }
}

export default MoveButton;