

let {init, setImagePath, load, on, imageAssets, TileEngine, Sprite, GameLoop} = kontra //create the kontra objects

let { canvas } = init();

//Setup the screen
canvas.width = 1600;//window.innerWidth;
canvas.height = 1600;//window.innerHeight;

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
	'MotherBirdStandRight.png',
	'EmptyNest.png',
	'BackToTheNestMap.png'
	).then(function(assets){
		console.log("All Assets Successfully Loaded.");

		//Start assigning files to objects
		let tileEngine = TileEngine({

			// tile size
			tilewidth: 16,
			tileheight: 16,
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
				      1,1,1,1,1,1,4,1,1,1,
				      4,1,1,1,1,1,1,1,1,1,
				      1,1,4,1,1,1,1,1,4,1,
				      1,1,1,1,1,4,1,1,1,1,
				      1,4,1,1,1,1,1,1,1,1,
				      1,1,1,1,1,1,1,1,1,1,
				      1,1,3,1,3,1,1,3,3,1,
				      2,2,2,2,2,2,2,2,2,2]
			}]
		});

		let chickSprite = Sprite({
				x:0,
				y:0,
				dx:.25,
				dy:.5,
				image: imageAssets['Chick']
			});

		let motherBirdStandRightSprite = Sprite({
				x:200,
				y:100,
				dx:.75,
				dy:.25,
				image: imageAssets['MotherBirdStandRight']
			});

		let emptyNestSprite = Sprite({
				x:500 ,
				y:500 ,
				anchor: {x:.5,y:1},
				image: imageAssets['EmptyNest']
			});

		//Create the platform
		let platformSprite = Sprite({

		});

		//game loop
		let loop = GameLoop({
			update: function(){

				//Full Screen resize update
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;

				//Derived sizes by screen
				canvasWidthMid = canvas.width/2;
				canvasHeightMid = canvas.height/2;
				
				//Sprite Updates
				chickSprite.update();
				motherBirdStandRightSprite.update();
				emptyNestSprite.update();

				//wraps the sprite through the canvas x and y axis
				if(chickSprite.x > canvas.width){
					chickSprite.x = -chickSprite.width;
				}
				if(chickSprite.y > canvas.height){
					chickSprite.y = -chickSprite.height;
				}

				if(motherBirdStandRightSprite.x > canvas.width){
					motherBirdStandRightSprite.x = -motherBirdStandRightSprite.width;
				}
				if(motherBirdStandRightSprite.y > canvas.height){
					motherBirdStandRightSprite.y = -motherBirdStandRightSprite.height;
				}


			},
			render: function(){
				chickSprite.render();
				motherBirdStandRightSprite.render();
				emptyNestSprite.render();
				tileEngine.render();
			}
		});


		loop.start();


	});

