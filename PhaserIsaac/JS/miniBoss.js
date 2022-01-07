import * as  map from './map.js'

export default class miniboss extends Phaser.Physics.Arcade.Sprite
{
	constructor(config) {
		super(config.scene, config.x, config.y, 'enemigoMiniBoss');
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
	}

	create()
	{
		this.playerVelocidad = 90;

		this.maxVida = 5;
		this.vida = this.maxVida;
	}

	update()
	{
		this.scene.anims.create(
			{
				key: 'miniBossF',
				frames: this.scene.anims.generateFrameNames('enemigoMiniBoss', { start: 0, end: 3 }),
				frameRate: 4,
				repeat: -1
			});

		this.play('miniBossF', true);
	}
}