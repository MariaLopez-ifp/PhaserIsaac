import map from './map.js';
import fly from './fly.js';
import * as utilidades from './utilidades.js';
//import teleport from './tp.js'

export default class player extends Phaser.Physics.Arcade.Sprite
{
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

		this.playerVelocidad = 125;

		this.maxVida = 5;
		this.vida = this.maxVida;

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
	}

	update()
	{
		if (this.vida > 0)
		{
			this.scene.anims.create(
				{
				key: 'isaacF',
				frames: this.scene.anims.generateFrameNames('isaacAnims', { start: 0, end: 2 }),
				frameRate: 4,
			});

			this.scene.anims.create(
				{
				key: 'isaacL',
				frames: this.scene.anims.generateFrameNames('isaacAnims', { start: 3, end: 5 }),
				frameRate: 4,
			});

			this.scene.anims.create(
				{
				key: 'isaacR',
				frames: this.scene.anims.generateFrameNames('isaacAnims', { start: 6, end: 8 }),
				frameRate: 4,
			});

			this.scene.anims.create(
				{
				key: 'isaacB',
				frames: this.scene.anims.generateFrameNames('isaacAnims', { start: 9, end: 11 }),
				frameRate: 4,
			});
		}
	}

	isaacInput()
	{
		if (this.vida > 0) {
			if (this.KeyW.isDown) {
				this.vectorY = -1;
				this.play('isaacB', true).setScale(1);
				this.angulo = -90;
			}

			else if (this.KeyS.isDown) {
				this.vectorY = 1;
				this.play('isaacF', true).setScale(1);
				this.angulo = 90;
			}

			else {
				this.vectorY = 0;
			}

			if (this.KeyA.isDown) {
				this.vectorX = -1;
				this.play('isaacL', true).setScale(1);
				this.angulo = -180;
			}

			else if (this.KeyD.isDown) {
				this.vectorX = 1;
				this.play('isaacR', true).setScale(1);
				this.angulo = 0;
			}

			else {
				this.vectorX = 0;
			}

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

	collisionPlayer(player, obj)
	{
		if (player.vida > 0 && player.temp <= 0)
		{
			player.vida--;
			player.temp = 50;
			player.playerHealth.setText('Vidas: ' + player.vida);
		}

		if (player.vida <= 0)
		{
			player.destroy();
		}

		player.temp--;
	}

	collisionBalas(obj, bala)
	{
		if (obj.vida > 0)
		{
			obj.vida--;
		}

		if (obj.vida <= 0)
		{
			obj.matar();
		}
    }

	generarLagrimas()
	{
		if (this.vida > 0) {
			var d = this.dispLagrimas.create(this.x, this.y, 'lagrimas').setDepth(8);
			d.setScale(0.25, 0.25);

			d.direccion = new Phaser.Math.Vector2(Math.cos(this.angulo * Math.PI / 180), Math.sin(this.angulo * Math.PI / 180));

			d.direccion.normalize();
		}
	}

	actualizarLagrimas()
	{
		for (var i = 0; i < this.dispLagrimas.getChildren().length; i++)
		{
			var l = this.dispLagrimas.getChildren()[i];

			this.dispLagrimas.dano = 1;

			l.x += l.direccion.x * 7;
			l.y += l.direccion.y * 7;
		}
	}
}