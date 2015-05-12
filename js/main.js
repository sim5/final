window.onload = function() {
	// You might want to start with a template that uses GameStates:
	//     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
	
	// You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
	// You will need to change the fourth parameter to "new Phaser.Game()" from
	// 'phaser-example' to 'game', which is the id of the HTML element where we
	// want the game to go.
	// The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
	// You will need to change the paths you pass to "game.load.image()" or any other
	// loading functions to reflect where you are putting the assets.
	// All loading functions will typically all be found inside "preload()".
	
	"use strict";
	
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update,render: render } );
	
	function preload() {
		// Load an image and call it 'logo'.
		game.load.image( 'logo', 'assets/player.png' );
		game.load.image( 'speed', 'assets/smile.png' );
		game.load.image( 'multiple', 'assets/smilee.png' );
		game.load.image( 'deerz', 'assets/bullets.png');
		game.load.image( 'enemyDeerz', 'assets/bull.png');
		game.load.audio( 'music', 'assets/race.mp3');
		game.load.audio( 'deerzSound', 'assets/explode1.wav');
		
		game.load.image( 'cars', 'assets/enemy.png');
		game.load.image( 'Lcars', 'assets/Lenemy.png');
		game.load.image( 'boss', 'assets/boss.png');
		game.load.image( 'world', 'assets/sea.jpg' );
		game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
	}
	
	
	var power=0;
	var world;
	
	var sprite;
	var music;
	
	var bullets;

	var fireRate = 1000;
	var nextFire = 0;

	var explosions;

	var time;
	var carz;
	var carTimer = 2500;
	var nextCar = 0;
	var carCount = 0;
	var mincarTimer = 100;
	
	
	var Lcarz;
	var LcarTimer = 2500;
	var LnextCar = 0;
	var LcarCount = 0;
	var LmincarTimer = 100;

	var speedz;
	var speedTimer = 10000;
	var nextSpeed = 0;
	var speedCount = 0;
	var minspeedTimer = 100;
	
	var multiplez;
	var multipleTimer = 10000;
	var nextMultiple = 0;
	var multipleCount = 0;
	var minmultipleTimer = 100;
	
	var lost;
	var style;
	var lives;
	var isAlive;
	
	var deerzfx;
	var enemyBullets;
	var enemyBullet;
	
	var LenemyBullets;
	var LenemyBullet;
	
	var firingTimer = 0;
	
	var livingEnemies = [];
	var livingLEnemies = [];
	
	
	
	var current;
	
	var mult=false;
	var image;
	var hp=100;
	var bossAlive=true;
	function create() {
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		world = game.add.tileSprite(0, 0, 800, 600, 'world');
		
		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		sprite.scale.setTo(.08,.08);

		game.canvas.addEventListener('mousedown', requestLock);

		game.input.addMoveCallback(move, this);
		music = game.add.audio('music', 1, true);
		music.play('', 0, 1, true);
		
		
		deerzfx = game.add.audio('deerzSound');

		game.stage.backgroundColor = '#313131';
		
		image = game.add.sprite(0, 0, 'boss');

		game.physics.enable(image, Phaser.Physics.ARCADE);
		
		//  This gets it moving
		image.body.velocity.setTo(200,200);
		
		//  This makes the game world bounce-able
		image.body.collideWorldBounds = true;
		
		//  This sets the image bounce energy for the horizontal 
		//  and vertical vectors. "1" is 100% energy return
		image.body.bounce.set(1);
		image.exists=false;

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;

		bullets.createMultiple(50, 'deerz');
		bullets.setAll('checkWorldBounds', true);
		bullets.setAll('outOfBoundsKill', true);
		
		
		
		enemyBullets = game.add.group();
		enemyBullets.enableBody = true;
		enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		enemyBullets.createMultiple(300, 'enemyDeerz');
		enemyBullets.setAll('anchor.x', 0.5);
		enemyBullets.setAll('anchor.y', 1);
		enemyBullets.setAll('outOfBoundsKill', true);
		enemyBullets.setAll('checkWorldBounds', true);
		
		LenemyBullets = game.add.group();
		LenemyBullets.enableBody = true;
		LenemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		LenemyBullets.createMultiple(300, 'enemyDeerz');
		LenemyBullets.setAll('anchor.x', 0.5);
		LenemyBullets.setAll('anchor.y', 1);
		LenemyBullets.setAll('outOfBoundsKill', true);
		LenemyBullets.setAll('checkWorldBounds', true);
		


		game.physics.enable(sprite, Phaser.Physics.ARCADE);
		sprite.body.collideWorldBounds = true;

		carz = game.add.group();
		carz.enableBody = true;
		carz.physicsBodyType = Phaser.Physics.ARCADE;
		carz.createMultiple(50, 'cars', 0, false);
		carz.setAll('anchor.x', 0.5);
		carz.setAll('anchor.y', 0.5);
		carz.setAll('outOfBoundsKill', true);
		carz.setAll('checkWorldBounds', true);
		
		
		
		Lcarz = game.add.group();
		Lcarz.enableBody = true;
		Lcarz.physicsBodyType = Phaser.Physics.ARCADE;
		Lcarz.createMultiple(50, 'Lcars', 0, false);
		Lcarz.setAll('anchor.x', 0.5);
		Lcarz.setAll('anchor.y', 0.5);
		Lcarz.setAll('outOfBoundsKill', true);
		Lcarz.setAll('checkWorldBounds', true);
		
		
		
		speedz = game.add.group();
		speedz.enableBody = true;
		speedz.physicsBodyType = Phaser.Physics.ARCADE;
		speedz.createMultiple(50, 'speed', 0, false);
		speedz.setAll('anchor.x', 0.5);
		speedz.setAll('anchor.y', 0.5);
		speedz.setAll('outOfBoundsKill', true);
		speedz.setAll('checkWorldBounds', true);
		
		
		
		multiplez = game.add.group();
		multiplez.enableBody = true;
		multiplez.physicsBodyType = Phaser.Physics.ARCADE;
		multiplez.createMultiple(50, 'multiple', 0, false);
		multiplez.setAll('anchor.x', 0.5);
		multiplez.setAll('anchor.y', 0.5);
		multiplez.setAll('outOfBoundsKill', true);
		multiplez.setAll('checkWorldBounds', true);
		
		
		
		//  An explosion pool
		explosions = game.add.group();
		explosions.createMultiple(30, 'kaboom');
		explosions.forEach(setupInvader, this);
		isAlive = true;
		lives = 5;
		
		style = { font: "65px Arial", fill: "#ff0044", align: "center" };




	}
	
	
	
	
	
	function requestLock() {
		game.input.mouse.requestPointerLock();
	}





	function move(pointer, x, y) {

		if (game.input.mouse.locked)
		{
			sprite.x += game.input.mouse.event.webkitMovementX;
			sprite.y += game.input.mouse.event.webkitMovementY;
		}

	}






	function fire() {

		if (game.time.now > nextFire && bullets.countDead() > 0)
		{
			
			
			
			nextFire = game.time.now + fireRate;

			var bullet = bullets.getFirstDead();

			bullet.reset(sprite.x, sprite.y+8);

			bullet.body.velocity.y = -400;
			
			if(mult==true)
			{
				var bulletL = bullets.getFirstDead();

				bulletL.reset(sprite.x-8, sprite.y);

				bulletL.body.velocity.x = -400;
				
				var bulletR = bullets.getFirstDead();

				bulletR.reset(sprite.x-8, sprite.y);

				bulletR.body.velocity.x = +400;
			}
		}

	}


	function powerFire() {

		

		var bullet1 = bullets.getFirstDead();

		bullet1.reset(sprite.x, sprite.y+8);

		bullet1.body.velocity.y = -400;
		
		var bullet2 = bullets.getFirstDead();

		bullet2.reset(sprite.x-8, sprite.y);

		bullet2.body.velocity.x = +400;
		
		var bullet3 = bullets.getFirstDead();

		bullet3.reset(sprite.x+8, sprite.y);

		bullet3.body.velocity.x = -400;
		
		
		var bullet4 = bullets.getFirstDead();

		bullet4.reset(sprite.x, sprite.y-8);

		bullet4.body.velocity.y = +400;
		
		
		var bullet5 = bullets.getFirstDead();

		bullet5.reset(sprite.x+8, sprite.y+8);

		bullet5.body.velocity.x = -400;
		bullet5.body.velocity.y = -400;
		
		var bullet6 = bullets.getFirstDead();

		bullet6.reset(sprite.x+8, sprite.y-8);

		bullet6.body.velocity.x = -400;
		bullet6.body.velocity.y = +400;
		
		var bullet7 = bullets.getFirstDead();

		bullet7.reset(sprite.x-8, sprite.y+8);

		bullet7.body.velocity.x = +400;
		bullet7.body.velocity.y = -400;
		
		var bullet8 = bullets.getFirstDead();

		bullet8.reset(sprite.x-8, sprite.y-8);

		bullet8.body.velocity.x = +400;
		bullet8.body.velocity.y = +400;
	}







	function update() {
		
		world.tilePosition.y += 5;
		time= (50000-game.time.now)/1000;
		if(time<=0)
		{
			time=0;
		}
		if (game.input.activePointer.isDown)
		{
			fire();
		}
		
		
		
		if (game.input.keyboard.isDown(Phaser.Keyboard.A)&&power==100)
		{
			power=0;
			powerFire();
		}
		
		
		if(game.time.now>15000)
		
		{
			carTimer=1250;
			LcarTimer=1250;
		}
		
		
		if(game.time.now>35000)
		
		{
			carTimer=625;
			LcarTimer=625;
		}

		if(game.time.now>50000&&isAlive==true)
		{
			
			carz.removeAll();
			Lcarz.removeAll();

			createBoss();
			
			
		}	
		if(bossAlive==false)
		{
			speedz.removeAll();
			multiplez.removeAll();
			image.kill();
			lost = game.add.text(game.world.centerX, game.world.centerY, "You have won the battle!", style);
			lost.anchor.setTo( 0.5, 0.5);	
		}			
		
		createEnemy();
		createLEnemy();
		createSpeed();
		createMultiple();
		
		game.physics.arcade.overlap(carz, sprite, carsHandler, null, this);
		game.physics.arcade.overlap(carz, bullets, bulletHandler, null, this);
		
		game.physics.arcade.overlap(Lcarz, sprite, LcarsHandler, null, this);
		game.physics.arcade.overlap(Lcarz, bullets, LbulletHandler, null, this);
		game.physics.arcade.overlap(speedz, sprite, speedsHandler, null, this);
		game.physics.arcade.overlap(multiplez, sprite, multiplesHandler, null, this);
		game.physics.arcade.overlap(enemyBullets, sprite, enemyHitsPlayer, null, this);
		game.physics.arcade.overlap(LenemyBullets, sprite, enemyHitsPlayer, null, this);
		
		game.physics.arcade.overlap(image, sprite, bossHandler, null, this);
		game.physics.arcade.overlap(image, bullets, bossBulletHandler, null, this);
		
		if (game.time.now > firingTimer)
		{
			enemyFires();
			LenemyFires();
			if(image.exists==true)
			{
				bossFires();
			}
		}
	}
	

	
	
	function createEnemy() {
		if (carz.countDead() > 0&&game.time.now > nextCar )
		{
			if(carTimer > mincarTimer)
			{
				carCount += 1;
				if(carCount >= 5)
				{
					carCount = 0;
					carTimer -= 100;
				}
			}
			
			nextCar = game.time.now + carTimer;

			var enemy = carz.getFirstExists(false);
			

			enemy.reset(game.world.randomX,0);

			enemy.body.velocity.y = +100;
		}
	}
	
	
	function createLEnemy() {
		if (Lcarz.countDead() > 0&&game.time.now > LnextCar )
		{
			if(LcarTimer > LmincarTimer)
			{
				LcarCount += 1;
				if(LcarCount >= 5)
				{
					LcarCount = 0;
					LcarTimer -= 100;
				}
			}
			
			LnextCar = game.time.now + LcarTimer;

			var Lenemy = Lcarz.getFirstExists(false);
			

			Lenemy.reset(0,game.world.randomY);

			Lenemy.body.velocity.x = +100;
		}
	}
	
	
	function createBoss() {
		image.exists=true;
	}
	
	
	function createSpeed(){
		
		if (speedz.countDead() > 0&&game.time.now > nextSpeed )
		{
			if(speedTimer > minspeedTimer)
			{
				speedCount += 1;
				if(speedCount >= 5)
				{
					speedCount = 0;
					speedTimer -= 100;
				}
			}
			
			nextSpeed = game.time.now + speedTimer;

			var sp = speedz.getFirstExists(false);

			sp.reset(game.world.randomX,0);

			sp.body.velocity.y = +300;
		}
		
	}
	
	function createMultiple(){
		
		if (multiplez.countDead() > 0&&game.time.now > nextMultiple )
		{
			if(multipleTimer > minmultipleTimer)
			{
				multipleCount += 1;
				if(multipleCount >= 5)
				{
					multipleCount = 0;
					multipleTimer -= 100;
				}
			}
			
			nextMultiple = game.time.now + multipleTimer;

			var mp = multiplez.getFirstExists(false);

			mp.reset(0,game.world.randomY);

			mp.body.velocity.x = +200;
		}
		
	}
	
	function carsHandler(player, enemy)
	{
		enemy.kill();
		deerzfx.play();
		if(lives > 0)
		lives -= 1;
		
		if(lives <= 0)
		{
			player.kill();
			isAlive = false;
			var explosion = explosions.getFirstExists(false);
			explosion.reset(player.body.x, player.body.y);
			explosion.play('kaboom', 30, false, true);
			lost = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!\n Press F5 to restart", style);
			lost.anchor.setTo( 0.5, 0.5);
		}
	}
	
	function bossHandler( boss,player)
	{
		
		
		if(lives > 0)
		{
			lives -= 1;
		}
		if(lives <= 0)
		{
			player.kill();
			isAlive = false;
			var explosion = explosions.getFirstExists(false);
			explosion.reset(player.body.x, player.body.y);
			explosion.play('kaboom', 30, false, true);
			lost = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!\n Press F5 to restart", style);
			lost.anchor.setTo( 0.5, 0.5);
		}
	}
	
	
	function LcarsHandler(player, Lenemy)
	{
		Lenemy.kill();
		deerzfx.play();
		if(lives > 0)
		lives -= 1;
		
		if(lives <= 0)
		{
			player.kill();
			isAlive = false;
			var explosion = explosions.getFirstExists(false);
			explosion.reset(player.body.x, player.body.y);
			explosion.play('kaboom', 30, false, true);
			lost = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!\n Press F5 to restart", style);
			lost.anchor.setTo( 0.5, 0.5);
		}
	}
	
	
	function speedsHandler(player, speed)
	{
		current=lives;
		
		speed.kill();
		

		fireRate=500;
		
		
	}
	
	function multiplesHandler(player, multiple)
	{
		current=lives;
		
		multiple.kill();
		

		mult=true;
		
		
	}
	function bulletHandler(enemy,bullet)
	{
		enemy.kill();
		bullet.kill();
		deerzfx.play();
		
		var explosion = explosions.getFirstExists(false);
		explosion.reset(enemy.body.x, enemy.body.y);
		explosion.play('kaboom', 30, false, true);
		
		if(power<100)
		{
			power=power+20;
		}
		

	}
	
	function LbulletHandler(Lenemy,bullet)
	{
		Lenemy.kill();
		bullet.kill();
		deerzfx.play();
		
		var explosion = explosions.getFirstExists(false);
		explosion.reset(Lenemy.body.x, Lenemy.body.y);
		explosion.play('kaboom', 30, false, true);
		
		if(power<100)
		{
			power=power+20;
		}
		

	}
	
	function bossBulletHandler(boss,bullet)
	{
		hp-=5;
		if(hp<=0)
		{
			bossAlive=false;
			deerzfx.play();
			var explosion = explosions.getFirstExists(false);
			explosion.reset(boss.body.x, boss.body.y);
			explosion.play('kaboom', 30, false, true);
		}
		bullet.kill();
		
		
		
		
		if(power<100)
		{
			power=power+20;
		}
		

	}
	
	
	function enemyHitsPlayer (player,bullet) {
		
		bullet.kill();


		if(current>lives)
		{
			fireRate=1000;
			mult=false;
		}
		
		if(lives > 0)
		{
			lives -= 1;
		}    
		if(lives <= 0)
		{
			player.kill();
			var explosion = explosions.getFirstExists(false);
			explosion.reset(player.body.x, player.body.y);
			explosion.play('kaboom', 30, false, true);
			isAlive = false;
			enemyBullets.callAll('kill');
			LenemyBullets.callAll('kill');
			lost = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!\n Press F5 to restart", style);
			lost.anchor.setTo( 0.5, 0.5);
		}



	}

	function enemyFires () {

		//  Grab the first bullet we can from the pool
		enemyBullet = enemyBullets.getFirstExists(false);

		livingEnemies.length=0;

		carz.forEachAlive(function(enemy){

			// put every living enemy in an array
			livingEnemies.push(enemy);
		});


		if (enemyBullet && livingEnemies.length > 0)
		{
			
			var random=game.rnd.integerInRange(0,livingEnemies.length-1);

			// randomly select one of them
			var shooter=livingEnemies[random];
			// And fire the bullet from this enemy
			enemyBullet.reset(shooter.body.x, shooter.body.y);

			game.physics.arcade.moveToObject(enemyBullet,sprite,120);
			firingTimer = game.time.now + 1000;
		}

	}

	function LenemyFires () {

		//  Grab the first bullet we can from the pool
		LenemyBullet = LenemyBullets.getFirstExists(false);

		livingLEnemies.length=0;

		Lcarz.forEachAlive(function(Lenemy){

			// put every living enemy in an array
			livingLEnemies.push(Lenemy);
		});


		if (LenemyBullet && livingLEnemies.length > 0)
		{
			
			var random=game.rnd.integerInRange(0,livingLEnemies.length-1);

			// randomly select one of them
			var Lshooter=livingLEnemies[random];
			// And fire the bullet from this enemy
			LenemyBullet.reset(Lshooter.body.x, Lshooter.body.y);

			game.physics.arcade.moveToObject(LenemyBullet,sprite,120);
			firingTimer = game.time.now + 1000;	
		}

	}

	function bossFires () {

		//  Grab the first bullet we can from the pool





		
		

		
		var bullet1 = enemyBullets.getFirstDead();

		bullet1.reset(image.x, image.y+8);

		bullet1.body.velocity.y = -400;
		
		var bullet2 = enemyBullets.getFirstDead();

		bullet2.reset(image.x-8, image.y);

		bullet2.body.velocity.x = +400;
		
		var bullet3 = enemyBullets.getFirstDead();

		bullet3.reset(image.x+8, image.y);

		bullet3.body.velocity.x = -400;
		
		
		var bullet4 = enemyBullets.getFirstDead();

		bullet4.reset(image.x, image.y-8);

		bullet4.body.velocity.y = +400;
		
		
		var bullet5 = enemyBullets.getFirstDead();

		bullet5.reset(image.x+8, image.y+8);

		bullet5.body.velocity.x = -400;
		bullet5.body.velocity.y = -400;
		
		var bullet6 = enemyBullets.getFirstDead();

		bullet6.reset(image.x+8, image.y-8);

		bullet6.body.velocity.x = -400;
		bullet6.body.velocity.y = +400;
		
		var bullet7 = enemyBullets.getFirstDead();

		bullet7.reset(image.x-8, image.y+8);

		bullet7.body.velocity.x = +400;
		bullet7.body.velocity.y = -400;
		
		var bullet8 = enemyBullets.getFirstDead();

		bullet8.reset(image.x-8, image.y-8);

		bullet8.body.velocity.x = +400;
		bullet8.body.velocity.y = +400;
		firingTimer = game.time.now + 1000;	
		

	}

	function setupInvader (invader) {

		invader.anchor.x = 0.5;
		invader.anchor.y = 0.5;
		invader.animations.add('kaboom');

	}
	
	function render() {    
		game.debug.text('Lives: ' + lives, 0, 50);
		game.debug.text('Time remaining to the enemy boss: ' + time+' seconds', 0, 150);


		game.debug.text('Power: ' + power+'%', 0, 100);
		if(image.exists==true)
		{
			
			game.debug.text('Boss HP: ' + hp, 0, 200);
		}
		
		
	}
};
