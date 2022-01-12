import map from './map.js'
import isaac from './isaac.js';
import enemigos from './enemigos.js';
import * as objetos from './objetos.js';

export default class fly extends enemigos
{
	ataque = 1;
	
	constructor(config) {
		super(config, 'enemigoMosca');
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
				repeat: -1
			});;

		this.play('flyF', true);
    }
}