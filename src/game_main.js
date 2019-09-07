

let {init, initKeys, setImagePath, load, on, imageAssets, TileEngine, 
     Sprite, SpriteSheet, Animation, keyPressed, GameLoop} = kontra //create the kontra objects

let { canvas } = init();

//Setup the screen
canvas.width = 640;
canvas.height = 640;

let canvasWidthMid = canvas.width/2;
let canvasHeightMid = canvas.height/2;

initKeys();

//bring in the assets
let numAssets = 3;
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

		let player = Sprite({
				x:64,
				y:448,
				animations: motherBirdFlappingSheet.animations
			});

		//player settings
		let playerSpeed = 6

		//game loop
		let loop = GameLoop({
			update: function(){
				
				//Sprite Updates
				chickSprite.update();
				player.update();

				player.playAnimation('idleRight');

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
			},
			render: function(){
				tileEngine.render();
				chickSprite.render();
				player.render();
				
				
			}
		});


		loop.start();


	});

