

let {init, Sprite, GameLoop} = kontra //create the kontra objects

let { canvas } = init();

let canvasWidthMid = canvas.width/2;
let canvasHeightMid = canvas.height/2;

//bring in an image
let chickImg = new Image();
chickImg.src = 'assets/sprites/chick.png';

let chickSprite = Sprite({
		x:0,
		y:0,
		dx:2,
		dy:1,
		image: chickImg
	});

let earthSprite = Sprite({
		x:canvasWidthMid,
		y:canvasHeightMid,
		color: 'YellowGreen',
		radius:50,
		render: function(){
			this.context.fillStyle = this.color;
			this.context.beginPath();
			this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			this.context.fill();
		}
	});

//game loop
let loop = GameLoop({
	update: function(){
		chickSprite.update();
		earthSprite.update();

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


	},
	render: function(){
		chickSprite.render();
		earthSprite.render();
	}
})


loop.start();