

let {init, initKeys, setImagePath, load, on, imageAssets, TileEngine, 
     Sprite, SpriteSheet, Animation, keyPressed, GameLoop} = kontra //create kontra objects

let { canvas } = init();

//Setup the screen
canvas.width = 640;
canvas.height = 640;

let canvasWidthMid = canvas.width/2;
let canvasHeightMid = canvas.height/2;

initKeys();

//bring in the assets
let numAssets = 6;
let assetsLoaded = 0;
on('assetLoaded', (asset,url) => {
	assetsLoaded++;
	console.log("#" + assetsLoaded + " asset loaded");
});

//Object management
let sprites = [];

setImagePath('assets/sprites');
//asset load promise so the game starts only after all the assets are loaded..
load(
	'Chick.png',
	'BackToTheNestMap.png',
	'MotherBirdFullSpriteSheet.png',
	'BirdEnemyFullSpriteSheet.png',
	'WormFullSpriteSheet.png',
	'Egg.png'
	).then(function(assets){
		console.log("All Assets Successfully Loaded.");

		//Start assigning files to objects
		let tileEngine = TileEngine({

			// tile size
			tilewidth: 64,
			tileheight: 64,
			//map size in tiles
			width:14,
			height:10,
			//tileset object
			tilesets: [{
				firstgid: 1,
				image: imageAssets['BackToTheNestMap']
			}],
			//layer object
			layers:[{
				name:'collision',
				data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					  0,0,0,0,3,0,5,3,3,0,0,0,0,0,
					  2,2,2,2,2,2,2,2,2,2,2,2,2,2]
				},
				{
				name:'background',
				data:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,
					  1,1,1,1,1,1,1,1,1,1,1,1,1,1,
					  1,1,1,1,1,1,4,1,1,1,1,1,1,1,
					  4,1,1,1,1,1,1,1,1,1,1,1,1,1,
					  1,1,4,1,1,1,1,1,4,1,1,1,1,1,
					  1,1,1,1,1,4,1,1,1,1,1,1,1,1,
					  1,4,1,1,1,1,1,1,1,1,1,1,1,1,
					  1,1,1,1,1,1,1,1,1,1,1,1,1,1,
					  1,6,1,1,3,1,5,3,3,1,1,1,1,1,
					  2,2,2,2,2,2,2,2,2,2,2,2,2,2]
				
			}]
		});

		//Sprite sheets for animations ///////////////////////////////////////////////////////
		let motherBirdFlappingSheet = SpriteSheet({
			image: imageAssets['MotherBirdFullSpriteSheet'],
			frameWidth: 64,
			frameHeight: 64,
			animations: {
				idleRight: {
					frames: 0
				 },
				flapRight: {
					frames: [2,4,6,4],
					frameRate: 15
				},
				hopRight: {
					frames: [0,8,10,8],
					frameRate: 15
				},
				glideRight: {
					frames: 24,
					frameRate: 15
				},
				idleWormRight: {
					frames: 12
				},
				flapWormRight: {
					frames: [14,16,18,16],
					frameRate: 15
				},
				hopWormRight: {
					frames: [12,20,22,20],
					frameRate: 15
				},
				glideWormRight: {
					frames: 26,
					frameRate: 15
				},
				idleLeft: {
					frames: 1
				},
				flapLeft: {
					frames: [3,5,7,5],
					frameRate: 15
				},
				hopLeft: {
					frames: [1,9,11,9],
					frameRate: 15
				},
				glideLeft: {
					frames: 25,
					frameRate: 15
				},
				idleWormLeft: {
					frames: 13
				},
				flapWormLeft: {
					frames: [15,17,19,17],
					frameRate: 15
				},
				hopWormLeft: {
					frames: [1,21,23,21],
					frameRate: 15
				},
				glideWormLeft: {
					frames: 27,
					frameRate: 15
				}

			}
		});

		let birdEnemyFlappingSheet = SpriteSheet({
			image: imageAssets['BirdEnemyFullSpriteSheet'],
			frameWidth: 64,
			frameHeight: 64,
			animations: {
				flapLeft: {
					frames: [0,1,2],
					frameRate: 15
				}
			}
		});

		let wormSpriteSheet = SpriteSheet({
			image: imageAssets['WormFullSpriteSheet'],
			frameWidth: 64,
			frameHeight: 64,
			animations: {
				flapLeft: {
					frames: [0,1,2,3,4,5,6],
					frameRate: 5
				}
			}
		});

		//Initial Properties ///////////////////////////////////////////////////////////////////////////
		//player properties
		let playerStartPositionX = 96;
		let playerStartPositionY = 478;
		let playerHasWorm = 0;
		let gravity = .05;
		let floor = 576;

		//enemy properties
		let enemySpeed = 1;
		let enemyStartPositionX = tileEngine.mapwidth;

		//worm properties
		let wormPositionX = 800;
		let wormPositionY = 576;

		//Swarm properties
		let enemyBirdMin = 1; 
		let enemyBirdMax = 3;
		let enemyBirdVectorXMin = -3.12;
		let enemyBirdVectorXMax = -5.23;
		let enemyBirdVectorYMin = 4.12;
		let enemyBirdVectorYMax = 6.23;
		let swoopRadians = 0;
		let rand = Math.random();
		let randomSwarmSize = Math.floor(rand * (enemyBirdMax - enemyBirdMin + 1)) + enemyBirdMin; //Random between the min and max but ensuring at least the min.
		let enemyBirdSwarmSprites = [];

		

		//Initialize sprites/////////////////////////////////////////////////////////////////
		//Worm Sprite
		let worm = Sprite({
				x:wormPositionX,
				y:wormPositionY,
				radius: 20,
				anchor: {x: 0.5, y: 1},
				collidesWith: sphereCollision,
				animations: wormSpriteSheet.animations
			});
		sprites.push(worm);

		let egg4 = Sprite({
				x:87,
				y:475,
				image: imageAssets['Egg'],
				anchor: {x: 0.5, y: 0.5}
			});
		sprites.push(egg4);

		let egg = Sprite({
				x:80,
				y:485,
				image: imageAssets['Egg'],
				anchor: {x: 0.5, y: 0.5}
			});
		sprites.push(egg);

		let egg2 = Sprite({
				x:85,
				y:485,
				image: imageAssets['Egg'],
				anchor: {x: 0.5, y: 0.5}
			});
		sprites.push(egg2);

		let egg3 = Sprite({
				x:90,
				y:485,
				image: imageAssets['Egg'],
				anchor: {x: 0.5, y: 0.5}
			});
		sprites.push(egg3);

		//Player Mother Bird Sprite
		let player = Sprite({
				x:playerStartPositionX,
				y:playerStartPositionY,
				width: 64,
				height:64,
				ddy:gravity,
				anchor: {x: 0.5, y: 0.5},
				radius: 17,
				collidesWith: sphereCollision,
				animations: motherBirdFlappingSheet.animations,
				playerState: 'IdleRight',
				hasForwardCollision: 0,
				hasDownwardCollision: 0,
				hasCollision: 0,
				distanceFromNest: 0,
				playerSpeed: 3.5,
				update(){
					this.distanceFromNest = this.x - playerStartPositionX; //update the distance from the nest
					
					//Determine any map collisions occuring. //////////////////////////////////////
					this.hasCollision = tileEngine.layerCollidesWith('collision',player)

					if (this.hasCollision == 1){
						let aheadTile = 0;
						let belowTile = 0;

						belowTile = tileEngine.tileAtLayer('collision', {x: player.x, y: player.y + 36})

						if (playerHasWorm == 0){
							aheadTile = tileEngine.tileAtLayer('collision', {x: (player.x + 36), y: player.y})
						}else{
							aheadTile = tileEngine.tileAtLayer('collision', {x: (player.x - 36), y: player.y})
						}

						if(aheadTile > 0){
							this.hasForwardCollision = 1;
						}

						if(belowTile > 0){
							this.hasDownwardCollision = 1;
						}
					}else{
						this.hasForwardCollision = 0;
						this.hasDownwardCollision = 0;
					}

					if(this.hasForwardCollision == 1){
						this.dx = 0 // halt forward movement.
					}

					if(this.distanceFromNest == 0 && playerHasWorm == 1)
					{
						loop.stop();
					}

					//move player toward worm until obtained and then go back to the nest.
					if(playerHasWorm == 0 && this.hasForwardCollision == 0){
						moveToWorm(player,worm);
					}
					else if (playerHasWorm == 1 && this.hasForwardCollision == 0){
						moveToNest(player);
					}

					//space to flap
					if (keyPressed('space')){

						//Upward movement
						this.y -= 5 //Boost upward
						this.ddy = -gravity; //Reverse gravity


						//flap toward worm
						if (this.hasForwardCollision == 0 && playerHasWorm == 0){
							moveToWorm(player,worm);
							this.playerState = 'FlapRight'
						}

						//flap toward nest
						if(this.hasForwardCollision == 0 && playerHasWorm == 1){
							moveToNest(player);
							this.playerState = 'FlapWormLeft'
						}

					}else{
						//Gliding
						this.ddy = gravity;
						if (this.y < floor && playerHasWorm == 0){
							this.playerState = 'GlideRight';
						}else if(this.y < floor && playerHasWorm == 1){
							this.playerState = 'GlideWormLeft';
						}
					}

					//player hopping along ground, set gravity to zero
					if(this.y > (floor - 36)) //36 to adjust for foot position of sprite
					{
						this.y = (floor - 36);
						this.ddy = 0;

						if(playerHasWorm == 1){
								this.playerState = 'HopWormLeft';
							}else{
								this.playerState = 'HopRight';
							}
					}

					//Determine animation to play
					switch(this.playerState){
						case 'IdleRight':
							this.playAnimation('idleRight');
						break;
						case 'IdleLeft':
							this.playAnimation('idleLeft');
						break;
						case 'GlideRight':
							this.playAnimation('glideRight');
						break;
						case 'GlideLeft':
							this.playAnimation('glideLeft');
						break;
						case 'FlapRight':
							this.playAnimation('flapRight');
						break;
						case 'FlapLeft':
							this.playAnimation('flapLeft');
						break;
						case 'HopRight':
							this.playAnimation('hopRight');
						break;
						case 'HopLeft':
							this.playAnimation('hopLeft');
						break;

						case 'IdleWormRight':
							this.playAnimation('idleWormRight');
						break;
						case 'IdleWormLeft':
							this.playAnimation('idleWormLeft');
						break;
						case 'GlideWormRight':
							this.playAnimation('glideWormRight');
						break;
						case 'GlideWormLeft':
							this.playAnimation('glideWormLeft');
						break;
						case 'FlapWormRight':
							this.playAnimation('flapWormRight');
						break;
						case 'FlapWormLeft':
							this.playAnimation('flapWormLeft');
						break;
						case 'HopWormRight':
							this.playAnimation('hopWormRight');
						break;
						case 'HopWormLeft':
							this.playAnimation('hopWormLeft');
						break;

						default: 
						this.playAnimation('glideRight');
					}
					this.advance();
				}
			});
		sprites.push(player);

		//Enemy Bird Sprites
		for (var i = 0; i < randomSwarmSize; i++){
			rand = Math.random();
			let birdSpawnY = Math.floor(rand * (canvasHeightMid - (canvasHeightMid*1.5))) - canvasHeightMid; //random above and to the right

			rand = Math.random();
			let randomSpeedX = Math.floor(rand * (enemyBirdVectorXMax - enemyBirdVectorXMin + i)) + enemyBirdVectorXMin;

			rand = Math.random();
			let randomSpeedY = Math.floor(rand * (enemyBirdVectorYMax - enemyBirdVectorYMin + i)) + enemyBirdVectorYMin;

			let enemyBird = Sprite({
				x:enemyStartPositionX,
				y:canvasHeightMid,
				dx: randomSpeedX,
				dy: randomSpeedY,
				radius: 5,
				anchor: {x: 0.5, y: 0.5},
				collidesWith: sphereCollision,
				animations: birdEnemyFlappingSheet.animations
			});
			enemyBirdSwarmSprites.push(enemyBird)
		}
		

		//Chick Sprite
		let chickSprite = Sprite({
				x:120,
				y:485,
				radius: 2,
				anchor: {x: 0.5, y: 0.5},
				collidesWith: sphereCollision,
				image: imageAssets['Chick']
			});
		sprites.push(chickSprite);

		//Add the sprites to the tile map so the camera and the tilemap are synced
		for (var i = 0; i < sprites.length; i ++){
			tileEngine.addObject(sprites[i]);
		}
		for (var i = 0; i < enemyBirdSwarmSprites.length; i ++){
			tileEngine.addObject(enemyBirdSwarmSprites[i]);
		}

////////////////////////////////////////////////////////////////////////////////////////////
//											game loop
////////////////////////////////////////////////////////////////////////////////////////////
		let loop = GameLoop({
			update: function(){
				
				//update all living sprites -- dead ones are filtered at the end of this loop
				sprites.map(sprite => {
						sprite.update()
				});

				//tileEngine testing
				if(player.x >= canvasWidthMid){
					tileEngine.sx += player.playerSpeed;
				}else if (playerHasWorm == 1) {
					tileEngine.sx -= player.playerSpeed;
				}

				
					

				// 	console.log("tile ahead: " + tileEngine.tileAtLayer('collision', {x: (player.x + 64), y: player.y}) + " tileEngine:height " + tileEngine.mapheight);
				// 	console.log("tile below: " + tileEngine.tileAtLayer('collision', {x: player.x, y: player.y + 64}));
					
				// }

				if(worm.collidesWith(player)){
					playerHasWorm = 1
					worm.ttl = 0;
					tileEngine.removeObject('worm');
				}
				
				//Enemy Logic //////////////////////////////////////////////////////////////
				//Enemy birds
				if (playerHasWorm == 1){
					for (var i = 0; i < enemyBirdSwarmSprites.length; i++){

						swoopRadians += .0125
						enemyBirdSwarmSprites[i].y = canvasHeightMid + ((canvas.height/4 + player.y/20) * Math.sin(swoopRadians));
						enemyBirdSwarmSprites[i].update();
						enemyBirdSwarmSprites[i].playAnimation('flapLeft');
						//Collision detection
						if(enemyBirdSwarmSprites[i].collidesWith(player)){
							loop.stop();
						}								
					}
				}

				sprites = sprites.filter(sprite => sprite.isAlive());
			},
			render: function(){
				tileEngine.renderLayer('background');
				sprites.map(sprite => sprite.render()); //render each sprite

				if(playerHasWorm == 1){
					for (var i = 0; i < enemyBirdSwarmSprites.length; i++){
						enemyBirdSwarmSprites[i].render();
					}
				}
						
			}
		});


		loop.start();


	});

//special functions
function sphereCollision(object){
  let dx = this.x - object.x;
  let dy = this.y - object.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  return distance < this.radius + object.radius;
}

function moveToWorm(player, worm){
	//is the worm alive?
	if (worm.isAlive == 0){
		return;
	}else{
		//where is the bird in relation to the worm
		let wormPositionX = worm.x;
		let playerPositionX = player.x;

		if(wormPositionX > playerPositionX){
			player.dx = player.playerSpeed;
		}else{
			player.dx = -player.playerSpeed;
		}
		return;
	}
}

function moveToNest(player){
	//Distance to nest
	if (player.distanceFromNest == 0){
		player.dx = 0; //stop travelling
		return;
	}else{
		
		if(player.distanceFromNest > 0){
			player.dx = -player.playerSpeed;
		}else{
			player.dx = player.playerSpeed;
		}
		return;
	}
}
