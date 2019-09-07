

let {init, initKeys, setImagePath, load, on, imageAssets, TileEngine, 
     Sprite, SpriteSheet, Animation, keyPressed, GameLoop} = kontra //create kontra objects

let { canvas } = init();

//unit testing
let isTesting = 1;
let testAnimations = 1;

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

		let chickSprite = Sprite({
				x:100,
				y:448,
				image: imageAssets['Chick']
			});

		
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

		//player settings
		let playerSpeed = 6
		let playerStartPositionX = 64
		let playerStartPositionY = 448
		let lapCount = 0
		let playerDistanceFromNest = 0
		let testDistanceInterval = (500 - playerStartPositionX) / 8

		//enemy settings
		let enemySpeed = 1
		let enemyStartPositionX = canvas.width;
		let enemyStartPositionY = canvas.height;

		//worm settings
		let wormPositionX = 320
		let wormPositionY = 512

		let player = Sprite({
				x:playerStartPositionX,
				y:playerStartPositionY,
				animations: motherBirdFlappingSheet.animations
			});

		var enemyBirdSwarm = [
			Sprite({
				x:enemyStartPositionX,
				y:enemyStartPositionY,
				dx: -enemySpeed,
				dy: -enemySpeed,
				animations: birdEnemyFlappingSheet.animations
			}),
			Sprite({
				x:enemyStartPositionX + 10,
				y:enemyStartPositionY + 10,
				dx: -(enemySpeed + 2),
				dy: -(enemySpeed + 4),
				animations: birdEnemyFlappingSheet.animations
			})

		];

		// let min = 5; 
		// let max = 15;
		// let rand = Math.random();
		// let randomArrayLength = Math.floor(rand * (max - min + 1)) + min;
		// let arr = [];

		// for (int i = 0; i < randomArrayLength; i++){
		// 	array.push(i)
		// }

		// document.write(randomArrayLength);
		// document.write(array.length);

		let worm = Sprite({
				x:wormPositionX,
				y:wormPositionY,
				animations: wormSpriteSheet.animations
			});

		//game loop
		let loop = GameLoop({
			update: function(){
				
				//Sprite Updates
				chickSprite.update();
				player.update();
				worm.update();
				player.playAnimation('idleRight'); //default animation

				//Unit Tests
				if(isTesting = 1){

					if (testAnimations = 1){
						playerDistanceFromNest = player.x - playerStartPositionX;
						//launch the enemy animation
						for (var i = 0, len = enemyBirdSwarm.length; i < len; i++){
								enemyBirdSwarm[i].update();
								enemyBirdSwarm[i].playAnimation('flapLeft');								
						}

						if(player.x >= playerStartPositionX && lapCount < 1){
							player.dx = 1;
							
							//play animations at equal intervals
							if(playerDistanceFromNest > testDistanceInterval * 0){
								player.playAnimation('idleRight');
							}
							if(playerDistanceFromNest > testDistanceInterval * 1){
								player.playAnimation('flapRight');
							}
							if(playerDistanceFromNest > testDistanceInterval * 2){
								player.playAnimation('hopRight');
							}
							if(playerDistanceFromNest > testDistanceInterval * 3){
								player.playAnimation('glideRight');
							}

							if(playerDistanceFromNest > testDistanceInterval * 4){
								player.playAnimation('idleWormRight');
							}
							if(playerDistanceFromNest > testDistanceInterval * 5){
								player.playAnimation('flapWormRight');
							}
							if(playerDistanceFromNest > testDistanceInterval * 6){
								player.playAnimation('hopWormRight');
							}
							if(playerDistanceFromNest > testDistanceInterval * 7){
								player.playAnimation('glideWormRight');
							}
							
							//turn around
							if (playerDistanceFromNest > 500){
								lapCount += 1;
							}
							console.log("Player Distance: " + playerDistanceFromNest)
						}
						if(lapCount > 0 )
						{

							player.dx = -1;

							//play animations at equal intervals
							if(playerDistanceFromNest < testDistanceInterval * 8){
								player.playAnimation('idleLeft');
							}
							if(playerDistanceFromNest < testDistanceInterval * 7){
								player.playAnimation('flapLeft');
							}
							if(playerDistanceFromNest < testDistanceInterval * 6){
								player.playAnimation('hopLeft');
							}
							if(playerDistanceFromNest < testDistanceInterval * 5){
								player.playAnimation('glideLeft');
							}

							if(playerDistanceFromNest < testDistanceInterval * 4){
								player.playAnimation('idleWormLeft');
							}
							if(playerDistanceFromNest < testDistanceInterval * 3){
								player.playAnimation('flapWormLeft');
							}
							if(playerDistanceFromNest < testDistanceInterval * 2){
								player.playAnimation('hopWormLeft');
							}
							if(playerDistanceFromNest < testDistanceInterval * 1){
								player.playAnimation('glideWormLeft');
							}
							//stop the loop
							if (player.x < playerStartPositionX){
								loop.stop();
							}
							console.log("Player Distance: " + playerDistanceFromNest)
						}
					}
				}else
				{
					//Player movements
					if (keyPressed('w')){
						player.y += -playerSpeed;
						player.playAnimation('glideRight');
					}
					if (keyPressed('s')){
						player.y += playerSpeed;
						player.playAnimation('glideLeft');
					}
					if (keyPressed('a')){
						player.x += -playerSpeed;
						player.playAnimation('flapLeft');
					}
					if (keyPressed('d')){
						player.x += playerSpeed;
						player.playAnimation('flapRight');
					}
					if (keyPressed('h')){
						player.playAnimation('idleWormRight');
					}
					if (keyPressed('g')){
						player.playAnimation('idleWormLeft');
					}

					// worm test on arrows
					if (keyPressed('up')){
						player.y += -playerSpeed;
						player.playAnimation('glideWormRight');
					}
					if (keyPressed('down')){
						player.y += playerSpeed;
						player.playAnimation('glideWormLeft');
					}
					if (keyPressed('left')){
						player.x += -playerSpeed;
						player.playAnimation('flapWormLeft');
					}
					if (keyPressed('right')){
						player.x += playerSpeed;
						player.playAnimation('flapWormRight');
					}

					//hop test
					if (keyPressed('j')){
						player.x += -playerSpeed;
						player.playAnimation('hopWormLeft');
					}
					if (keyPressed('k')){
						player.x += playerSpeed;
						player.playAnimation('hopWormRight');
					}
				}
			},
			render: function(){
				tileEngine.render();
				chickSprite.render();
				player.render();
				for (var i = 0, len = enemyBirdSwarm.length; i < len; i++){
					enemyBirdSwarm[i].render();
				};
				worm.render();
				
				
			}
		});


		loop.start();


	});

