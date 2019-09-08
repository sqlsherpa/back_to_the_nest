

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
let numAssets = 5;
let assetsLoaded = 0;
on('assetLoaded', (asset,url) => {
	assetsLoaded++;
	console.log("#" + assetsLoaded + " asset loaded");
});

//special functions
function sphereCollision(object){
  let dx = this.x - object.x;
  let dy = this.y - object.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  return distance < this.radius + object.radius;
}

setImagePath('assets/sprites');
//asset load promise so the game starts only after all the assets are loaded..
load(
	'Chick.png',
	'BackToTheNestMap.png',
	'MotherBirdFullSpriteSheet.png',
	'BirdEnemyFullSpriteSheet.png',
	'WormFullSpriteSheet.png'
	).then(function(assets){
		console.log("All Assets Successfully Loaded.");

		//Start assigning files to objects
		let tileEngine = TileEngine({

			// tile size
			tilewidth: 64,
			tileheight: 64,
			//map size in tiles
			width:10,
			height:10,
			//tileset object
			tilesets: [{
				firstgid: 1,
				image: imageAssets['BackToTheNestMap']
			}],
			//layer object
			layers:[{
				name:'background',
				data:[1,1,1,1,1,1,1,1,1,1,
				      1,1,1,1,1,1,1,1,1,1,
				      1,1,1,1,1,1,4,1,1,1,
				      4,1,1,1,1,1,1,1,1,1,
				      1,1,4,1,1,1,1,1,4,1,
				      1,1,1,1,1,4,1,1,1,1,
				      1,4,1,1,1,1,1,1,1,1,
				      1,1,1,1,1,1,1,1,1,1,
				      1,6,1,1,3,1,5,3,3,1,
				      2,2,2,2,2,2,2,2,2,2]
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

		//Settings ///////////////////////////////////////////////////////////////////////////
		//player settings
		let playerSpeed = 3.5
		let playerStartPositionX = 64
		let playerStartPositionY = 448
		let lapCount = 0
		let playerDistanceFromNest = 0
		let testDistanceInterval = (500 - playerStartPositionX) / 8
		let playerHasWorm = 0
		let gravity = .05

		//enemy settings
		let enemySpeed = 1
		let enemyStartPositionX = canvas.width + 30;

		//worm settings
		let wormPositionX = 576
		let wormPositionY = 512

		//Swarm Initial settings
		let enemyBirdMin = 1; 
		let enemyBirdMax = 3;
		let enemyBirdVectorXMin = -3.12;
		let enemyBirdVectorXMax = -5.23;
		let enemyBirdVectorYMin = 4.12;
		let enemyBirdVectorYMax = 6.23;
		let swoopRadians = 0;
		let rand = Math.random();
		let randomSwarmSize = Math.floor(rand * (enemyBirdMax - enemyBirdMin + 1)) + enemyBirdMin; //Random between the min and max but ensuring at least the min.
		let enemyBirdSwarmArray = [];

		

		//Initialize sprites/////////////////////////////////////////////////////////////////
		//Player Mother Bird Sprite
		let player = Sprite({
				x:playerStartPositionX,
				y:playerStartPositionY,
				ddy:gravity,
				anchor: {x: 0.5, y: 0.5},
				radius: 17,
				collidesWith: sphereCollision,
				animations: motherBirdFlappingSheet.animations
			});

		//Enemy Bird Sprites
		for (var i = 0; i < randomSwarmSize; i++){
			rand = Math.random();
			let birdSpawnX = canvas.width;
			let birdSpawnY = Math.floor(rand * (canvasHeightMid - (canvasHeightMid*1.5))) - canvasHeightMid; //random above and to the right

			rand = Math.random();
			let randomSpeedX = Math.floor(rand * (enemyBirdVectorXMax - enemyBirdVectorXMin + i)) + enemyBirdVectorXMin;

			rand = Math.random();
			let randomSpeedY = Math.floor(rand * (enemyBirdVectorYMax - enemyBirdVectorYMin + i)) + enemyBirdVectorYMin;

			console.log("Slot: " + i + " speedx: " + randomSpeedX + " speedy: " + randomSpeedY + " yspawn "+ birdSpawnY);
			let enemyBird = Sprite({
				x:birdSpawnX,
				y:canvasHeightMid,
				dx: randomSpeedX,
				dy: randomSpeedY,
				radius: 5,
				anchor: {x: 0.5, y: 0.5},
				collidesWith: sphereCollision,
				animations: birdEnemyFlappingSheet.animations
			});
			enemyBirdSwarmArray.push(enemyBird)
		}

		//Chick Sprite
		let chickSprite = Sprite({
				x:100,
				y:448,
				radius: 2,
				anchor: {x: 0.5, y: 0.5},
				collidesWith: sphereCollision,
				image: imageAssets['Chick']
			});

		//Worm Sprite
		let worm = Sprite({
				x:wormPositionX,
				y:wormPositionY,
				radius: 20,
				anchor: {x: 0.5, y: 1},
				collidesWith: sphereCollision,
				animations: wormSpriteSheet.animations
			});

////////////////////////////////////////////////////////////////////////////////////////////
//											game loop
////////////////////////////////////////////////////////////////////////////////////////////
		let loop = GameLoop({
			update: function(){
				
				//Player Logic ////////////////////////////////////////////
				player.playAnimation('idleRight'); //default animation
				playerDistanceFromNest = player.x - playerStartPositionX; //update the distance from the nest

				if(playerDistanceFromNest < 0){
					loop.stop();
				}

				if(player.x > worm.x){
					playerHasWorm = 1
				}
				//Auto dx toward worm, once worm is obtained, auto -dx
				if(playerHasWorm == 0){
					player.dx = playerSpeed;
					player.playAnimation('glideRight');
				}
				else{
					player.dx = -playerSpeed;
					player.playAnimation('glideWormLeft');
				}

				//Spacebar or right click to flap upward
				if (keyPressed('space')){
					player.ddy = -gravity;

					if(playerHasWorm == 1){
						player.playAnimation('flapWormLeft');
					}
					else{
						player.playAnimation('flapRight');
					}
				}else{
					player.ddy = gravity;
				}

				
				player.update();

				//Enemy Logic //////////////////////////////////////////////////////////////
				//Enemy birds
				if (playerHasWorm == 1){
					for (var i = 0; i < enemyBirdSwarmArray.length; i++){

						swoopRadians += .0125
						enemyBirdSwarmArray[i].y = canvasHeightMid + ((canvas.height/4 + player.y/20) * Math.sin(swoopRadians));
						// if (enemyBirdSwarmArray[i].y < (canvasHeightMid - 200)){
						// 	enemyBirdSwarmArray[i].y = 10 * Math.sin(swoopRadians);
						// }else if (enemyBirdSwarmArray[i].y > (canvasHeightMid + 200)){
						// 	enemyBirdSwarmArray[i].y = 10 * -Math.sin(swoopRadians);
						// }
						enemyBirdSwarmArray[i].update();
						enemyBirdSwarmArray[i].playAnimation('flapLeft');
						//Collision detection
						if(enemyBirdSwarmArray[i].collidesWith(player)){
							loop.stop();
						}								
					}
				}

				//Simple sprite Updates
				chickSprite.update();
				worm.update();
				
			},
			render: function(){
				tileEngine.render();
				chickSprite.render();
				player.render();

				for (var i = 0; i < enemyBirdSwarmArray.length; i++){
					enemyBirdSwarmArray[i].render();
				};

				//Render the worm until the player has it.
				if (playerHasWorm == 0){
					worm.render();
				}
				
				
				
			}
		});


		loop.start();


	});

