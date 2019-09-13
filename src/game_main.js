
let {init, initKeys, setImagePath, load, on, imageAssets, TileEngine, 
     Sprite, SpriteSheet, Animation, keyPressed, Context, GameLoop} = kontra //create kontra objects
let { canvas, context} = init();

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

		//Start assigning files to objects ///////////////////////////////////////

		//Base tile engine
		let tileEngine = TileEngine({

			// tile size
			tilewidth: 64,
			tileheight: 64,
			//map size in tiles
			width:2,
			height:10,
			//tileset object
			tilesets: [{
				firstgid: 1,
				image: imageAssets['BackToTheNestMap']
			}],
			//layer object
			layers:[{
				name:'collision',
				data:[0,0,
					  0,0,
					  0,0,
					  0,0,
					  0,0,
					  0,0,
					  0,0,
					  0,0,
					  0,0,
					  2,2]
				},
				{
				name:'background',
				data:[1,1,
					  1,1,
					  1,1,
					  4,1,
					  1,1,
					  1,1,
					  1,4,
					  1,1,
					  1,6,
					  2,2,]
				
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
		 
		//Initial Chunk Append /////////////////////////////////////////////////////////////////////////
		tileEngine = addChunkToMap(tileEngine);

		//Initial Properties ///////////////////////////////////////////////////////////////////////////
		//player properties
		let playerStartPositionX = 96;
		let playerStartPositionY = 478;
		let playerHasWorm = 0;
		let gravity = .05;
		let floor = 576;
		let eggCountMax = 0;
		let eggCountCurrent = 0;
		let spacebarUsed = 0;

		//worm properties
		let wormPositionX = tileEngine.mapwidth - 100;
		let wormPositionY = 576;
		let wormdt = 0; //Track time worm is carried, this is for enemy behavior.

		//Swarm properties
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

		let egg = Sprite({
				x:80,
				y:485,
				image: imageAssets['Egg'],
				anchor: {x: 0.5, y: 0.5}
			});
		sprites.push(egg);

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
				hasEnemyCollision: 0,
				distanceFromNest: 0,
				playerSpeed: 3.5,
				isVulnerable:1,
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
						spacebarUsed = 1;
						
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
					if(this.y > (floor - 36) && keyPressed('space') == false) //36 to adjust for foot position of sprite
					{
						this.y = (floor - 36);
						this.ddy = 0;

						if(playerHasWorm == 1){
								this.playerState = 'HopWormLeft';
							}else{
								this.playerState = 'HopRight';
							}
					}

					//celing boundary
					if(this.y < 0)
					{
						this.y = 0;
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
				enemyBirdSwarmSprites.map(sprite => {
					sprite.update(player)
					sprite.playAnimation('flapLeft');
				});

				//Screen Traversal
				if(player.x >= canvas.width/2){
					tileEngine.sx += player.playerSpeed;
				}else if (playerHasWorm == 1) {

					tileEngine.sx += -player.playerSpeed*2
					console.log(tileEngine.sx);
				}

				if(worm.collidesWith(player)){
					
					playerHasWorm = 1;
					worm.ttl = 0;
					
				}

				if (playerHasWorm == 1){
					wormdt += 1/60;
					//Release a bird every 1 second
					if (wormdt > 1){
						wormdt = 0;
						spawnEnemyBird(tileEngine, birdEnemyFlappingSheet, enemyBirdSwarmSprites);
					}
				}

				//Worm successfully brought back to nest event
				if(player.distanceFromNest <= 0 && playerHasWorm == 1)
				{
					//increment egg count
					eggCountCurrent += 1;
					if (eggCountCurrent > eggCountMax){
						eggCountMax += 1;
					}
					
					
					//drop the worm
					playerHasWorm = 0;
					//reset worm time
					wormdt = 0;

					//Grow the map
					tileEngine = addChunkToMap(tileEngine);

					//Reposition the worm
					worm.ttl = 999999;
					worm.x = tileEngine.mapwidth - 100;
					sprites.push(worm);

					//Re-Sync Objects
					for (var i = 0; i < sprites.length; i ++){
						tileEngine.addObject(sprites[i]);
					}
					for (var i = 0; i < enemyBirdSwarmSprites.length; i ++){
						tileEngine.addObject(enemyBirdSwarmSprites[i]);
					}
					
				}
				sprites = sprites.filter(sprite => sprite.isAlive());
				enemyBirdSwarmSprites = enemyBirdSwarmSprites.filter(sprite => sprite.isAlive());
			},
			render: function(){
				tileEngine.renderLayer('background');
				sprites.map(sprite => sprite.render()); //render each sprite
				enemyBirdSwarmSprites.map(sprite => sprite.render());//render enemy bird swarm

				//Helpful Messages/////////////////////////////////////
				context.font = "30px Verdana";
				// Create gradient
				var gradient = context.createLinearGradient(0, canvas.width/4, canvas.width - canvas.width/4, 0);
				gradient.addColorStop("0"," magenta");
				gradient.addColorStop("0.5", "blue");
				gradient.addColorStop("1.0", "red");
				// Fill with gradient
				context.fillStyle = gradient;
				if(spacebarUsed == 0){
				context.fillText("Hit spacebar to fly!", canvas.width/4, canvas.height/2);
				context.fillText("Bring back a worm to produce an egg", 30, canvas.height/1.8);
				}

				if (player.hasEnemyCollision == 1){
					//Game Over
					context.fillText("GAME OVER!", canvas.width/4, canvas.height/2);
					//Display egg score
					context.fillText("Hit enter to continue", canvas.width/4, canvas.height/1.5);
					loop.stop();
				}

				//egg count display/////////////////////////////////////////
				var eggImg = imageAssets['Egg'];
				context.drawImage(eggImg,0,0);
				context.fillText(eggCountCurrent,64,64);
			}
		});


		loop.start();

		
		if (loop.isStopped && keyPressed('enter')){
			loop.start();
			console.log("Enter heard, loop is stopped: " + loop.isStopped)
		}

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
	if (player.distanceFromNest <= 0){
		player.dx = 0; //stop travelling
		return;
	}else{
		
		if(player.distanceFromNest > 0){
			player.dx = -player.playerSpeed;
		}
		return;
	}
}

function spawnEnemyBird(engine, spriteSheet,spriteArray){
	
	let enemyBirdVectorXMin = -3.12;
	let enemyBirdVectorXMax = -5.23;
	let enemyBirdVectorYMin = 4.12;
	let enemyBirdVectorYMax = 6.23;
	rand = Math.random();
	let randomSpeedX = Math.floor(rand * (enemyBirdVectorXMax - enemyBirdVectorXMin + 1)) + enemyBirdVectorXMin;

	rand = Math.random();
	let randomSpeedY = Math.floor(rand * (enemyBirdVectorYMax - enemyBirdVectorYMin + 1)) + enemyBirdVectorYMin;

	let enemyStartPositionX = engine.mapwidth;
	let enemyStartPositionY = Math.floor(rand * ((canvas.height - canvas.height/4) - canvas.height/4)) + canvas.height/4;

	let enemyBird = Sprite({
		x:enemyStartPositionX,
		y:enemyStartPositionY,
		dx: randomSpeedX,
		dy: randomSpeedY,
		swoopRadians: 0,
		radius: 5,
		anchor: {x: 0.5, y: 0.5},
		collidesWith: sphereCollision,
		animations: spriteSheet.animations,
		update(player){
			
			this.swoopRadians += .0125
			this.y = enemyStartPositionY + ((canvas.height/4) * Math.sin(this.swoopRadians));
			console.log("in update x: " + this.x + " y pos: " + this.y + " swoop radians: " + this.swoopRadians);
			this.dy = 0
			this.x -= 2
			//Collision detection
			if(this.collidesWith(player)){
				player.hasEnemyCollision = 1;
			}
				
			if(this.x < 0){
				this.ttl = 0;//set as dead
				engine.removeObject(this); //destroy the object
			}
		}
	});
	spriteArray.push(enemyBird);
	engine.addObject(enemyBird);
	
}

function addChunkToMap(tileEngine){
	//Try to append a "block" of background
	let thisBackground = tileEngine.layers[1]['data'];
	let thisBackgroundCurrentPosition = 0;
	let thisBackgroundWidth = tileEngine.width;
	let nextBackground = [];

	//append to existing map
	for(var row = 0; row < 10; row++){

		//feed existing map in
		for(var col = 0; col < thisBackgroundWidth; col++){
			
			nextBackground.push(thisBackground[thisBackgroundCurrentPosition]); 
			thisBackgroundCurrentPosition += 1;
		}
		//Append
		for(var col = 0; col < 8; col++){

			//8 columns
			if(row == 9){
				nextBackground.push(2);
			}else{
				nextBackground.push(1);
			}
		}
	}

	let collisionBackgroundTransform = nextBackground;
	collisionBackgroundTransform = collisionBackgroundTransform.map( function(tile) {
		if(tile < 2){
			return 0;
		}
		if(tile == 4){
			return 0;
		}
		else{
			return tile;
		}
	});

	thisBackgroundWidth = (thisBackgroundCurrentPosition + 80)/10

	//apparently I have to replace the entire tile engine
	tileEngine = TileEngine({

		// tile size
		tilewidth: 64,
		tileheight: 64,
		//map size in tiles
		width:thisBackgroundWidth,
		height:10,
		//tileset object
		tilesets: [{
			firstgid: 1,
			image: imageAssets['BackToTheNestMap']
		}],
		//layer object
		layers:[{
			name:'collision',
			data:collisionBackgroundTransform
			},
			{
			name:'background',
			data:nextBackground
			
		}]
	});

	return tileEngine;
}

//todo
//Egg count at top DONE
//Establish a ceiling DONE
//Instead of complicating with egg reduction, just going to make it a one hit and you have to restart affair. DONE
//back to nest turnaround and reposition the worm DONE
//Enemy waves DONE
//Game start instructions DONE
//Map generation Almost Done need to randomize clouds and obstacles, should be easy.
//Scoring - I think this is just going to be a personal best of egg count. Just need to display best on top right.
//Restart game after game stops. In progress
//Fix camera movement
//sound
//music
//Library recompile
//minify