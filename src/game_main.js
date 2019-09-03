

let {init, Sprite, GameLoop} = kontra //create the kontra objects

let { canvas } = init();

let canvasWidthMid = canvas.width/2;
let canvasHeightMid = canvas.height/2;
let earthRadius = 75;

//bring in the assets
let chickImg = new Image();
chickImg.src = 'assets/sprites/Chick@16px.png';

let motherBirdStandRightImg = new Image();
motherBirdStandRightImg.src = 'assets/sprites/MotherBirdStandRight@16px.png';

let emptyNestImg = new Image();
emptyNestImg.src = 'assets/sprites/emptyNest@32px.png';

let chickSprite = Sprite({
		x:0,
		y:0,
		dx:.25,
		dy:.5,
		image: chickImg
	});

let motherBirdStandRightSprite = Sprite({
		x:200,
		y:100,
		dx:.75,
		dy:.25,
		image: motherBirdStandRightImg
	});

let earthSprite = Sprite({
		x:canvasWidthMid,
		y:canvasHeightMid,
		color: 'YellowGreen',
		radius:earthRadius,
		render: function(){
			this.context.fillStyle = this.color;
			this.context.beginPath();
			this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			this.context.fill();
		}
	});

let emptyNestSprite = Sprite({
		x:earthSprite.x ,
		y:earthSprite.y - earthSprite.radius,
		anchor: {x:.5,y:1},
		image: emptyNestImg
	});

let thetaRad = 0;
let thetaDeg = 0;

//game loop
let loop = GameLoop({
	update: function(){
		earthSprite.update();
		chickSprite.update();
		motherBirdStandRightSprite.update();
		emptyNestSprite.update();

		//rotation
		thetaRad = thetaRad + 0.025;
		thetaDeg = thetaRad * (180/Math.PI) ;
		
		emptyNestSprite.x = canvasWidthMid + earthRadius * Math.cos(thetaRad);
		emptyNestSprite.y = canvasHeightMid + earthRadius * Math.sin(thetaRad);
		emptyNestSprite.rotation = thetaDeg
		//wraps the sprite through the canvas x axis
		// if(chickSprite.x > canvas.width){
		// 	chickSprite.x = -chickSprite.width;
		// }

		//bounces inside the canvas
		// if(((chickSprite.width + chickSprite.x) > canvas.width) || (chickSprite.x < 0))
		// {
		// 	chickSprite.dx = -chickSprite.dx
		// }
		// if(((chickSprite.height + chickSprite.y) > canvas.height) || (chickSprite.y < 0))
		// {
		// 	chickSprite.dy = -chickSprite.dy
		// }

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
		earthSprite.render();
		chickSprite.render();
		motherBirdStandRightSprite.render();
		emptyNestSprite.render();
	}
})


loop.start();