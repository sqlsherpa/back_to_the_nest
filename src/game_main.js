

let {init, Sprite, GameLoop} = kontra //create the kontra objects

let { canvas } = init();

//create a sprite object
let sprite = Sprite({
	x:0,
	y: 0,
	width: 50,
	height: 100,
	color: 'green',
	dx:1,
	dy:0.5
});

//game loop 60fps

let loop = GameLoop({
	update: function(){
		sprite.update();
	},
	render: function(){
		sprite.render();
	}
})


loop.start();