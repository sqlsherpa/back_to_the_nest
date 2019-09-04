

let {init, setImagePath, load, on, imageAssets, Sprite, GameLoop} = kontra //create the kontra objects

let { canvas } = init();

//Setup the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let canvasWidthMid = canvas.width/2;
let canvasHeightMid = canvas.height/2;

//bring in the assets
let numAssets = 3;
let assetsLoaded = 0;
on('assetLoaded', (asset,url) => {
	assetsLoaded++;
	console.log("#" + assetsLoaded + " asset loaded");
});

setImagePath('assets/sprites');
load(
	'Chick.png',
	'MotherBirdStandRight.png',
	'EmptyNest.png'
	).then(function(assets){
		console.log("All Assets Successfully Loaded.");

		//Start assigning files to objects
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
			}
		});


		loop.start();


	});

