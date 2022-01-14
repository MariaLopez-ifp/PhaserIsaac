import map from './map.js'
import isaac from './isaac.js';
import enemigos from './enemigos.js';
import * as objetos from './objetos.js';

export default class miniboss extends enemigos
{
	ataque = 1;

	constructor(config) {
		super(config, 'enemigoMiniBoss');
		this.rotationSpeed = 0.1;
	}


	create()
	{
		this.maxVida = 5;
		this.vida = this.maxVida;
		this.muerto = false;
		this.velocidad = 50;
		this.createAnims();
		this.tempBalaEnem = 40;

		this.dispLagrimasEnem = this.scene.physics.add.group();
	}

	createAnims()
	{
		this.scene.anims.create(
			{
				key: 'miniBossF',
				frames: this.scene.anims.generateFrameNames('enemigoMiniBoss', { start: 0, end: 2 }),
				frameRate: 4,
				repeat: -1
			});

		this.play('miniBossF', true);
	}

	update()
    {
		if(!this.muerto && !this.scene.pIsaac.muerto)
		{
			this.actualizarLagrimasEnem();

			if (this.tempBalaEnem <= 0)
			{
				this.generarLagrimasEnem();
				this.tempBalaEnem = 30;
			}

        	this.tempBalaEnem--;
		}

		if(this.muerto)
		{
			this.dispLagrimasEnem.getChildren().forEach(obj =>{
					obj.destroy();
			})
		}
    }

	crearCollision(obj)
	{
		this.scene.physics.add.overlap(this.dispLagrimasEnem, obj, this.collisionBalas, null, this.scene);
	}

	generarLagrimasEnem()
	{
		if (this.vida > 0) 
		{
			var d = this.dispLagrimasEnem.create(this.x, this.y, 'lagrimasEnemigo').setDepth(8);
			d.setScale(0.25, 0.25);
			d.ataque = 1;
			d.tiempoBala = 0;

			d.direc = new Phaser.Math.Vector2(1,0);
			
			d.direc.x = this.scene.pIsaac.x - d.x;
        	d.direc.y = this.scene.pIsaac.y - d.y;

       		d.direc.normalize();
        	d.angulo = Math.atan2(d.direc.y, d.direc.x) * (180 / Math.PI);
		}
	}

	actualizarLagrimasEnem()
	{
		for (var i = 0; i < this.dispLagrimasEnem.getChildren().length; i++)
		{
			var l = this.dispLagrimasEnem.getChildren()[i];
			l.tiempoBala++;

			this.dispLagrimasEnem.dano = 1;

			l.x += l.direc.x * 7;
			l.y += l.direc.y * 7;

			if (l.tiempoBala > 60)
			{
				l.destroy();
			}
		}
	}

	collisionBalas(obj, bala)
	{
		if(!this.muerto)
		{
			bala.destroy();
			obj.quitarVida(bala.ataque);
		}
    }
}