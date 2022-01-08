import isaac from './isaac.js';

export function dropearObj(enem)
{
	
	if(enem.name == "enemigoMiniBoss" && enem.name != null)
	{
		var l = new llave({scene : enem.scene, x: enem.x, y: enem.y});
	}

	if(enem.name == "mosca" && enem.name != null)
	{
		var b = new bomba({scene : enem.scene, x: enem.x, y: enem.y});
	}
}

class bomba extends Phaser.Physics.Arcade.Sprite
{
	constructor(config) {
		super(config.scene, config.x, config.y, 'bombas'); 
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
	}

	recoger(pj)
	{
		pj.playerBombs.setText('Bombas: ' + pj.bombas);
		this.destroy();
	}
}

class llave extends Phaser.Physics.Arcade.Sprite
{
	constructor(config) {
		super(config.scene, config.x, config.y, 'llave'); 
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
	}

	recoger(pj)
	{
		pj.playerKeys.setText('Llaves: ' + pj.llaves);
		this.destroy();
	}
}