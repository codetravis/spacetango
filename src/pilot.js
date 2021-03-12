import EventDispatcher from './eventDispatcher.js';

class Pilot extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);

        this.displayWidth = 32;
        this.scaleY = this.scaleX;
        this.id = config.pilot_id;
        this.strain = 0;
        this.level = config.level;
        this.experience = config.experience;
        this.control = config.control;
        this.gunnery = config.gunnery;
        this.guts = config.guts;
        this.composure = config.composure;

        config.scene.add.existing(this);
        this.setInteractive();
        this.on('pointerdown', this.clicked, this);
    }

    takeStrain(amount) {
        this.strain += amount;
    }

    removeStrain(amount) {
        this.strain = Math.max(0, this.strain - amount);
    }

    getMaxStrain() {
        return this.guts;
    }

    clicked() {
        // switch image to selected?
        // alternatively draw a green square behind this?
        this.emitter = EventDispatcher.getInstance();
        this.emitter.emit("PILOT_CLICKED", this);
    }

    
}

export default Pilot;