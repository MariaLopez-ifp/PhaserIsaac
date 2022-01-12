import isaac from './isaac.js';
import efectos from './efectos.js';

export function dropearObj(enem)
{
	var aleatorio = Phaser.Math.Between(0, 1);
	
	if(enem.name == "miniBoss" && enem.name != null)
	{
		var l = new llave({scene : enem.scene, x: enem.x, y: enem.y});
		l.createCollision();
	}

	if(enem.name == "mosca" && enem.name != null && aleatorio == 1)
	{
		var b = new bomba({scene : enem.scene, x: enem.x, y: enem.y});
		b.createCollision();
	}
}

export default class bomba extends Phaser.Physics.Arcade.Sprite
{
	ataque = 3;
	tempExplosion = 75;

	constructor(config) {
		super(config.scene, config.x, config.y, 'bombas'); 
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
		this.muerto = false;
	}

	update()
	{
		if(this.muerto == false)
		{
			this.tempExplosion--;
			this.explosion();
		}
	}

	createCollision()
	{
		this.scene.physics.add.overlap(this, this.scene.pIsaac, this.recoger, null, this.scene);
	}

	recoger(obj, pj)
	{
		pj.bombas++;
		pj.playerBombs.setText('Bombas: ' + pj.bombas);
		obj.destroy();
	}

	explosion()
	{
		if(this.tempExplosion <= 0)
		{
			for(var i = 0; i < this.scene.grupoEnemigos.length; i++)
			{
				var distancia = Phaser.Math.Distance.BetweenPoints(this, this.scene.grupoEnemigos[i]);

				if(distancia <= 80 && !this.scene.grupoEnemigos[i].muerto)
				{
					this.scene.grupoEnemigos[i].quitarVida(this.ataque);
				}
			}

			var distancia = Phaser.Math.Distance.BetweenPoints(this, this.scene.pIsaac);

			if(distancia <= 80)
			{
				this.scene.pIsaac.quitarVida(this.ataque);
			}

			var distancia = Phaser.Math.Distance.BetweenPoints(this, this.scene.eMiniBoss);

			if(distancia <= 80 && !this.scene.eMiniBoss.muerto)
			{
				this.scene.eMiniBoss.quitarVida(this.ataque);
			}

			new efectos({scene : this.scene, x: this.x, y: this.y, effectAnim: 'explosionB'});
			this.matar();
		}
	}

	matar()
	{
		this.destroy();
		this.muerto = true;
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

	createCollision()
	{
		this.scene.physics.add.overlap(this, this.scene.pIsaac, this.recoger, null, this.scene);
	}

	recoger(obj, pj)
	{
		pj.llaves++;
		pj.playerKeys.setText('Llaves: ' + pj.llaves);
		obj.destroy();
	}
}