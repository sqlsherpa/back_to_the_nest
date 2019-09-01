

let {init, Sprite, GameLoop} = kontra //create the kontra objects

let { canvas } = init();




//create a sprite object
let sprite = Sprite({
	x:0,
	y:0,
	width: 50,
	height: 100,
	color: 'blue',
	dx:2
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
	},
	render: function(){
		sprite.render();
	}
})


loop.start();