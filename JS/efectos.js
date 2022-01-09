export default class efectos extends Phaser.Physics.Arcade.Sprite
{
	constructor(config) {
		super(config.scene, config.x, config.y, 'explosionBomba'); 
		this.createAnims();
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
		this.play(config.effectAnim, false);
	}

	createAnims()
	{
		this.scene.anims.create(
				{
				key: 'explosionB',
				frames: this.scene.anims.generateFrameNames('explosionBomba', { start: 0, end: 80 }),
				frameRate: 60,
			});
	}


}