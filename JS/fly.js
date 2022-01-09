import map from './map.js'
import isaac from './isaac.js';
import * as objetos from './objetos.js';

export default class fly extends Phaser.Physics.Arcade.Sprite
{
	ataque = 1;
	
	constructor(config) {
		super(config.scene, config.x, config.y,'enemigoMosca');
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
	}

	create()
	{
		this.muerto = false;
		this.maxVida = 1;
		this.vida = this.maxVida;
		this.velocidad = 45;
		this.createAnims();
	}

	createAnims()
	{
		this.scene.anims.create(
			{
				key: 'flyF',
				frames: this.scene.anims.generateFrameNames('enemigoMosca', { start: 0, end: 3 }),
				frameRate: 2,
			});;
    }

	updateMoviemiento(isaac)
	{
		if(this.muerto == false)
		{
			this.play('flyF', true);
		
			var direccion = new Phaser.Math.Vector2();

			direccion.x = isaac.x - this.x;
			direccion.y = isaac.y - this.y;

			direccion.normalize();
			var movimiento = new Phaser.Math.Vector2();

			movimiento.x = direccion.x * this.velocidad;
			movimiento.y = direccion.y * this.velocidad;

			this.setVelocityX(movimiento.x);
			this.setVelocityY(movimiento.y);
		}		
	}

	quitarVida(dano)
	{
		if (this.vida > 0)
		{
			this.vida -= dano;
		}

		if (this.vida <= 0)
		{
			this.matar();
		}
	}

	matar()
	{
		objetos.dropearObj(this)
		this.destroy();
		this.muerto = true;
	}
}