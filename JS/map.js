import isaac from './isaac.js';
import fly from './fly.js';
import miniboss from './miniBoss.js';
import boss from './boss.js';
import * as teleport from './tp.js';
import * as objetos from './objetos.js';


export default class map extends Phaser.Scene
{
	constructor()
	{
		super('mapa');
	}

	preload() 
	{
		this.load.image('doorTiles', 'assets/mapas/doors.png');
		this.load.image('cuevaTiles', 'assets/mapas/cueva.png');
		this.load.image('cellarTiles', 'assets/mapas/cellar.png');
		this.load.image('cerraduraTile', 'assets/mapas/cerradura.png');
		this.load.tilemapTiledJSON('cuevaCellar', 'assets/mapas/mapa_Isaac.json');

		this.load.image('lagrimas', 'assets/sprites/lagrima.png');
		this.load.image('lagrimasEnemigo', 'assets/sprites/lagrimaSangre.png');
		
		this.load.image('Isaac', 'assets/sprites/isaac.png');
		this.load.spritesheet('enemigoMosca', 'assets/sprites/fly.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('enemigoMiniBoss', 'assets/sprites/miniBoss.png', { frameWidth: 47, frameHeight: 50 });
		this.load.spritesheet('isaacAnims', 'assets/sprites/isaacAnim.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('enemigoBoss', 'assets/sprites/boss.png', { frameWidth: 96, frameHeight: 64 });

		this.load.image('bombas','assets/sprites/bombas.png');
		this.load.image('llave','assets/sprites/llave.png');
		this.load.spritesheet('explosionBomba', 'assets/sprites/explosion.png', { frameWidth: 100, frameHeight: 100 });

		this.load.image('finJuego', 'assets/sprites/fin.png');

		teleport.preload(this);
	}

	create()
	{
		const mapa = this.make.tilemap({ key: 'cuevaCellar' });

		this.grupoEnemigos = new Array;
		this.grupoEnemigos.destruir = false;
		
		this.eMiniBoss = new miniboss({ scene: this, x: 90, y: 190 }).setDepth(5).setSize(25, 25);
		this.eMiniBoss.name = "miniBoss";
		this.eMiniBoss.destruir = false;

		this.eBoss = new boss({ scene: this, x: 30, y: -690 }).setDepth(5).setCircle(25, 22, 8);
		this.eBoss.destruir = false;
		this.eBoss.create();

		var enemy = mapa.createFromObjects('enemTiles');

		enemy.forEach(obj => {
			obj.setAlpha(0);
			if (obj.name == 'fly') {
				var f = new fly({ scene: this, x: obj.x, y: obj.y }).setDepth(8).setSize(12, 12);
				f.create();
				f.name = "mosca";
				this.grupoEnemigos.unshift(f);
			}
		})

		this.pIsaac = new isaac({ scene: this, x: 162, y: 90 }).setDepth(4).setSize(20, 28);

		this.cameras.main.startFollow(this.pIsaac);

		this.camara = this.cameras.main;

		mapa.x = 0;
		mapa.y = 0;

		const tileset = mapa.addTilesetImage('doors', 'doorTiles');
		const tileset2 = mapa.addTilesetImage('cueva', 'cuevaTiles');
		const tileset3 = mapa.addTilesetImage('cellar', 'cellarTiles');

		var roomTiles = [tileset2, tileset3];

		const doors = mapa.createLayer('Doors', tileset).setDepth(3);
		const backDoor = mapa.createLayer('BackDoor', tileset).setDepth(1);
		const paredes = mapa.createLayer('Paredes', roomTiles).setDepth(0);
		const suelo = mapa.createLayer('Suelo', roomTiles).setDepth(0);

		var allTiles = [doors, backDoor, paredes, suelo];

		paredes.setCollisionBetween(1, 1200);

		/*const debugGraphics = this.add.graphics().setAlpha(0.7)
		paredes.renderDebug(debugGraphics, {
			tileColor: null,
			collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
			faceColor: new Phaser.Display.Color(40, 39, 37, 255)
		})*/

		var tilePortal = mapa.createFromObjects('tpTiles');
		this.gates = teleport.create(tilePortal);

		teleport.collisionPortal(this.pIsaac);

		this.physics.add.collider(this.pIsaac, allTiles);
		this.physics.add.collider(this.grupoEnemigos, allTiles);
		this.physics.add.collider(this.eMiniBoss, allTiles);
		this.physics.add.collider(this.eBoss, allTiles);
		this.physics.add.collider(this.grupoEnemigos, this.grupoEnemigos);

		this.pIsaac.create();
		this.eMiniBoss.create();

		this.pIsaac.crearCollision(this.grupoEnemigos);
		this.pIsaac.crearCollision(this.eMiniBoss);
		this.pIsaac.crearCollision(this.eBoss);
		this.eMiniBoss.crearCollision(this.pIsaac);
	}

	update()
	{
		this.pIsaac.grupoBombas.forEach(obj =>
		{
				obj.update();
		})

		this.pIsaac.update();

		this.grupoEnemigos.forEach(obj =>
		{
				obj.updateMoviemiento(this.pIsaac);
		})

		this.eMiniBoss.updateMoviemiento(this.pIsaac);
		this.eBoss.updateMoviemiento(this.pIsaac);
		this.eMiniBoss.update();
		this.eBoss.update();
		this.pIsaac.actualizarLagrimas();
	}	
}