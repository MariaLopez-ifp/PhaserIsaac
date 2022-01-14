import map from './map.js'
import isaac from './isaac.js';
import enemigos from './enemigos.js';
import fly from './fly.js';
import * as objetos from './objetos.js';

export default class boss extends enemigos
{
	ataque = 1;

	constructor(config) {
		super(config, 'enemigoBoss');
		this.rotationSpeed = 0.1;
	}

	create()
	{
		this.maxVida = 15;
		this.vida = this.maxVida;
		this.muerto = false;
		this.velocidad = 40;
		this.createAnims();
		this.tempGenerarMosca = 800;
	}

	createAnims()
	{
		this.scene.anims.create(
			{
				key: 'BossF',
				frames: this.scene.anims.generateFrameNames('enemigoBoss', { frames: [ 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 3, 0 ] }),
				frameRate: 3.8,
				repeat: -1
			});

		this.play('BossF', true);
	}

	update()
    {
		this.generarMoscasBoss();
    }

	generarMoscasBoss()
	{
		if(this.tempGenerarMosca <= 0 && this.vida > 0 && this.scene.pIsaac.vida > 0)
		{
			var aleatorio = Phaser.Math.Between(1, 4);

			for(var i = 0; i < aleatorio; i++)
			{
				this.bossFly = new fly ({ scene: this.scene, x: this.x, y: this.y }).setDepth(11).setSize(12, 12);
				this.bossFly.create();
				this.bossFly.ataque = 1;

				var rand = new Phaser.Math.Vector2();

				rand.x = Phaser.Math.Between(-100, 100);
				rand.y = Phaser.Math.Between(-100, 100);

				rand.normalize();

				this.bossFly.setVelocityX(rand.x * this.bossFly.velocidad);
				this.bossFly.setVelocityY(rand.y * this.bossFly.velocidad);


				this.scene.grupoEnemigos.unshift(this.bossFly);
			}

			this.tempGenerarMosca = 104;
		}

		this.tempGenerarMosca--;
	}
}