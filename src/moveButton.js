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
        this.speed_text = new Phaser.GameObjects.Text(
            config.scene,
            config.x,
            config.y + 80,
            this.speed,
            {fontFamily: 'Arial'}
        );
        config.scene.add.existing(this.speed_text);
        config.scene.add.existing(this);
        
        this.setInteractive();
        this.on('pointerdown', this.clicked, this);
    }

    clicked() {
        this.emitter = EventDispatcher.getInstance();
        this.emitter.emit(this.action_name, this);
    }

    remove() {
        this.speed_text.destroy();
        this.destroy();
    }
}

export default MoveButton;