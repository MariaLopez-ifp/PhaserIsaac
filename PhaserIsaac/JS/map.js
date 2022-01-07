import isaac from './isaac.js';
import fly from './fly.js';
import miniboss from './miniBoss.js';
import * as teleport from './tp.js';



export default class map extends Phaser.Scene
{
	constructor()
	{
		super('mapa');
	}

	preload() {
		this.load.image('lagrimas', 'assets/sprites/lagrima.png');
		this.load.image('lagrimasEnemigo', 'assets/sprites/lagrimaSangre.png');
		this.load.image('doorTiles', 'assets/mapas/doors.png');
		this.load.image('cuevaTiles', 'assets/mapas/cueva.png');
		this.load.image('cellarTiles', 'assets/mapas/cellar.png');
		this.load.tilemapTiledJSON('cuevaCellar', 'assets/mapas/mapa_Isac.json');
		this.load.spritesheet('enemigoMosca', 'assets/sprites/fly.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('enemigoMiniBoss', 'assets/sprites/miniBoss.png', { frameWidth: 47, frameHeight: 50 });
		this.load.image('Isaac', 'assets/sprites/isaac.png');
		this.load.spritesheet('isaacAnims', 'assets/sprites/isaacAnim.png', { frameWidth: 64, frameHeight: 64 });
	}

	create()
	{
		this.grupoEnemigos = new Array;
		
		this.eMiniBoss = new miniboss({ scene: this, x: 90, y: 190 }).setDepth(3).setSize(25, 25);
		
		this.contLagrimas = 0;

		const mapa = this.make.tilemap({ key: 'cuevaCellar' });

		const tileset = mapa.addTilesetImage('doors', 'doorTiles');
		const tileset2 = mapa.addTilesetImage('cueva', 'cuevaTiles');
		const tileset3 = mapa.addTilesetImage('cellar', 'cellarTiles');

		var roomTiles = [tileset2, tileset3];

		const cerradura = mapa.createLayer('Cerradura', tileset).setDepth(2);
		const doors = mapa.createLayer('Doors', tileset).setDepth(1);
		const backDoor = mapa.createLayer('BackDoor', tileset).setDepth(1);
		const paredes = mapa.createLayer('Paredes', roomTiles).setDepth(0);
		const suelo = mapa.createLayer('Suelo', roomTiles).setDepth(0);

		var enemy = mapa.createFromObjects('enemTiles');
		var tilePortal = mapa.createFromObjects('tpTiles');

		enemy.forEach(obj => {
			obj.setAlpha(0);
			if (obj.name == 'fly') {
				var f = new fly({ scene: this, x: obj.x, y: obj.y }).setDepth(3).setSize(12, 12)
				f.create();
				this.grupoEnemigos.unshift(f);
			}
		})

		this.pIsaac = new isaac({ scene: this, x: 158, y: 90 }).setDepth(2).setSize(7, 27);

		mapa.x = 0;
		mapa.y = 0;

		var allTiles = [doors, backDoor, paredes, suelo, cerradura];

		this.cameras.main.startFollow(this.pIsaac);

		this.camara = this.cameras.main;

		this.physics.add.collider(this.pIsaac, allTiles);
		this.physics.add.collider(this.grupoEnemigos, this.grupoEnemigos);

		paredes.setCollisionBetween(1, 1200);

		const debugGraphics = this.add.graphics().setAlpha(0.7)
		paredes.renderDebug(debugGraphics, {
			tileColor: null,
			collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
			faceColor: new Phaser.Display.Color(40, 39, 37, 255)
		})

		this.pIsaac.create();
		this.pIsaac.crearCollision(this.grupoEnemigos);
		this.grupoEnemigos.destruir = false;
		//teleport.collisionPortal(this.pIsaac, this.scene);
		//teleport.create(tilePortal);
	}

	update()
	{
		this.pIsaac.isaacInput();
		this.pIsaac.update();

		if (this.grupoEnemigos.destruir == false)
		{
			console.log(this.grupoEnemigos.destruir);
			this.grupoEnemigos.forEach(obj => { obj.updateMoviemiento(this.pIsaac); })
		}

		this.eMiniBoss.update();
		this.pIsaac.actualizarLagrimas();
		
		if (this.pIsaac.Shot.isDown && this.pIsaac.temp <= 0)
		{
			this.pIsaac.generarLagrimas();

			this.pIsaac.temp = 15;
		}

		this.pIsaac.temp--;
	}

	/*abrirPuerta()
	{
		if (keyOn)
		{
			cerradura.detectionbox = scene.add.rectangle(mago.x, mago.y, 180, 180);
			scene.physics.add.existing(cerradura.detectionbox, false);

			cerradura.body.enable = false;
			cerradura.detectionbox.body.enable = false;
			cerradura.setAlpha(0);
		}
	}*/
}