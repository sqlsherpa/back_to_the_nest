

let {init, Sprite, GameLoop} = kontra //create the kontra objects

let { canvas } = init();


//bring in an image
let chickImg = new Image();
chickImg.src = 'assets/sprites/chick.png';

let sprite = Sprite({
		x:0,
		y:0,
		dx:2,
		dy:1,
		image: chickImg
	});


//game loop
let loop = GameLoop({
	update: function(){
		sprite.update();

		//wraps the sprite through the canvas
		// if(sprite.x > canvas.width){
		// 	sprite.x = -sprite.width;
		// }

		//bounces inside the canvas
		if(((sprite.width + sprite.x) > canvas.width) || (sprite.x < 0))
		{
			sprite.dx = -sprite.dx
		}
		if(((sprite.height + sprite.y) > canvas.height) || (sprite.y < 0))
		{
			sprite.dy = -sprite.dy
		}
	},
	render: function(){
		sprite.render();
	}
})


loop.start();