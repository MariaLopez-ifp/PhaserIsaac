import map from './map.js'
import isaac from './isaac.js';
import * as objetos from './objetos.js';

export default class enemigos extends Phaser.Physics.Arcade.Sprite
{
	constructor(config, sprite) {
		super(config.scene, config.x, config.y, sprite);
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
	}

	updateMoviemiento(isaac)
	{
		if(this.muerto == false)
		{
			var actualDir = this.body.velocity;
			var direccion = new Phaser.Math.Vector2();

			direccion.x = isaac.x - this.x;
			direccion.y = isaac.y - this.y;

			direccion.normalize();
			actualDir.normalize();

			if(direccion.x > actualDir.x)
			{
				actualDir.x += this.rotationSpeed;
			}

			if(direccion.x < actualDir.x)
			{
				actualDir.x -= this.rotationSpeed;
			}

			if(direccion.y > actualDir.y)
			{
				actualDir.y += this.rotationSpeed;
			}

			if(direccion.y < actualDir.y)
			{
				actualDir.y -= this.rotationSpeed;
			}

			var movimiento = new Phaser.Math.Vector2();

			movimiento.x = actualDir.x * this.velocidad;
			movimiento.y = actualDir.y * this.velocidad;

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