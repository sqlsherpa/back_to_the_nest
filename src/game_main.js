

let {init, setImagePath, load, on, imageAssets, TileEngine, Sprite, SpriteSheet, Animation, GameLoop} = kontra //create the kontra objects

let { canvas } = init();

//Setup the screen
canvas.width = 640;
canvas.height = 640;

let canvasWidthMid = canvas.width/2;
let canvasHeightMid = canvas.height/2;

//bring in the assets
let numAssets = 4;
let assetsLoaded = 0;
on('assetLoaded', (asset,url) => {
	assetsLoaded++;
	console.log("#" + assetsLoaded + " asset loaded");
});

setImagePath('assets/sprites');
//asset load promise so the game starts only after all the assets are loaded..
load(
	'Chick.png',
	'MotherBirdWorm.png',
	'BackToTheNestMap.png',
	'MotherBirdFlapping.png',
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

		let motherBird = Sprite({
				x:64,
				y:448,
				image: imageAssets['MotherBirdWorm']
			});

		let motherBirdFlappingSheet = SpriteSheet({
			image: imageAssets['MotherBirdFlapping'],
			frameWidth: 64,
			frameHeight: 64,
			animations: {
				flap: {
					frames: '0..2',
					frameRate: 15
				}
			}
		});
		
		let motherBirdFlappingAnimation = Sprite({
			x:200,
			y:100,
			dx:1.75,
			dy:1.25,
			animations: motherBirdFlappingSheet.animations

		});

		//game loop
		let loop = GameLoop({
			update: function(){
				
				//Sprite Updates
				chickSprite.update();
				motherBird.update();
				motherBirdFlappingAnimation.update();
				

				//wraps the sprite through the canvas x and y axis
				if(motherBirdFlappingAnimation.x > canvas.width){
					motherBirdFlappingAnimation.x = -motherBirdFlappingAnimation.width;
				}
				if(motherBirdFlappingAnimation.y > canvas.height){
					motherBirdFlappingAnimation.y = -motherBirdFlappingAnimation.height;
				}

			},
			render: function(){
				tileEngine.render();
				chickSprite.render();
				motherBird.render();
				motherBirdFlappingAnimation.render();
				
				
			}
		});


		loop.start();


	});

