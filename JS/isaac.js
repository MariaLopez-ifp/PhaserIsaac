import map from './map.js';
import fly from './fly.js';
import miniboss from './miniBoss.js';
import * as utilidades from './utilidades.js';
import bomba from './objetos.js';

export default class player extends Phaser.Physics.Arcade.Sprite
{
	grupoBombas = new Array;

	constructor(config) {
		super(config.scene, config.x, config.y, 'Isaac'); 
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
	}

	create()
	{
		this.temp = 0;
		this.tempBala = 0;
		this.tempBomba = 0;

		this.playerVelocidad = 125;

		this.maxVida = 5;
		this.vida = this.maxVida;

		this.muerto = false;

		this.bombas = 0;
		this.llaves = 0;

		this.playerHealth = this.scene.add.text(5, 5, 'Vidas: ' + this.vida, { fontSize: '14px', fill: '#FFF' }).setScrollFactor(0);
		this.playerBombs = this.scene.add.text(5, 22, 'Bombas: ' + this.bombas, { fontSize: '14px', fill: '#FFF' }).setScrollFactor(0);
		this.playerKeys = this.scene.add.text(721, 5, 'Llaves: ' + this.llaves, { fontSize: '14px', fill: '#FFF' }).setScrollFactor(0);

		this.dispLagrimas = this.scene.physics.add.group();

		this.KeyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.KeyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.KeyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.KeyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.Shot = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.Bomb = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
	}

	update()
	{
		if (this.vida > 0)
		{
			this.scene.anims.create(
				{
				key: 'isaacF',
				frames: this.scene.anims.generateFrameNames('isaacAnims', { frames: [ 0, 1, 2, 1 ] }),
				frameRate: 5,
			});

			this.scene.anims.create(
				{
				key: 'isaacL',
				frames: this.scene.anims.generateFrameNames('isaacAnims', { frames: [ 3, 4, 5, 4 ] }),
				frameRate: 5,
			});

			this.scene.anims.create(
				{
				key: 'isaacR',
				frames: this.scene.anims.generateFrameNames('isaacAnims', { frames: [ 6, 7, 8, 7 ] }),
				frameRate: 5,
			});

			this.scene.anims.create(
				{
				key: 'isaacB',
				frames: this.scene.anims.generateFrameNames('isaacAnims', { frames: [ 9, 10, 11, 10  ] }),
				frameRate: 5,
			});

			this.isaacInput();
		}
	}

	isaacInput()
	{
		if (this.vida > 0) {
			if (this.KeyW.isDown) {
				this.vectorY = -1;
				this.play('isaacB', true);
				this.angulo = -90;
			}

			else if (this.KeyS.isDown) {
				this.vectorY = 1;
				this.play('isaacF', true);
				this.angulo = 90;
			}

			else {
				this.vectorY = 0;
			}

			if (this.KeyA.isDown) {
				this.vectorX = -1;
				this.play('isaacL', true);
				this.angulo = -180;
			}

			else if (this.KeyD.isDown) {
				this.vectorX = 1;
				this.play('isaacR', true);
				this.angulo = 0;
			}

			else {
				this.vectorX = 0;
			}

			if (this.Shot.isDown && this.tempBala <= 0)
			{
				this.generarLagrimas();
				this.tempBala = 15;
			}

			this.tempBala--;

			if (this.Bomb.isDown && this.bombas > 0 && this.tempBomba <= 0) {
				var b = new bomba({scene : this.scene, x: this.x, y: this.y});
				this.bombas--;
				this.playerBombs.setText('Bombas: ' + this.bombas);
				this.tempBomba = 20;
				this.grupoBombas.push(b);
			}

			this.tempBomba--;

			this.dir = new Phaser.Math.Vector2(this.vectorX, this.vectorY);
			this.dir.normalize();
			this.setVelocityX(this.playerVelocidad * this.dir.x);
			this.setVelocityY(this.playerVelocidad * this.dir.y);
		}
	}

	crearCollision(obj)
	{
		this.scene.physics.add.overlap(this, obj, this.collisionPlayer, null, this.scene);
		this.scene.physics.add.overlap(this.dispLagrimas, obj, this.collisionBalas, null, this.scene);
	}

	quitarVida(dano)
	{
		if (this.vida > 0)
		{
			this.vida -= dano;
		}

		if (this.vida <= 0)
		{
			this.end = this.scene.add.sprite(this.scene.game.config.width / 2, this.scene.game.config.height / 2, 'finJuego').setDepth(8).setScale(2).setScrollFactor(0);
			this.destroy();
			this.muerto = true;
		}

		this.playerHealth.setText('Vidas: ' + this.vida);
	}

	collisionPlayer(player, obj)
	{
		if (player.vida > 0 && player.temp <= 0)
		{
			player.quitarVida(obj.ataque);
			player.temp = 50;
		}

		player.temp--;
	}

	collisionBalas(obj, bala)
	{
		bala.destroy();
		obj.quitarVida(bala.ataque);
    }

	generarLagrimas()
	{
		if (this.vida > 0) {
			var d = this.dispLagrimas.create(this.x, this.y, 'lagrimas').setDepth(5);
			d.setScale(0.25, 0.25);
			d.ataque = 1;
			d.tiempoBala = 0;

			d.direccion = new Phaser.Math.Vector2(Math.cos(this.angulo * Math.PI / 180), Math.sin(this.angulo * Math.PI / 180));

			d.direccion.normalize();
		}
	}

	actualizarLagrimas()
	{
		for (var i = 0; i < this.dispLagrimas.getChildren().length; i++)
		{
			var l = this.dispLagrimas.getChildren()[i];
			l.tiempoBala++;

			this.dispLagrimas.dano = 1;

			l.x += l.direccion.x * 7;
			l.y += l.direccion.y * 7;

			if (l.tiempoBala > 50)
			{
				l.destroy();
			}
		}
	}
}