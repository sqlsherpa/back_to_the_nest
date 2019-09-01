

let {init, Sprite, GameLoop} = kontra //create the kontra objects

let { canvas } = init();

//create a sprite object
let sprite = Sprite({
	x:100,
	y: 50,
	width: 50,
	height: 100,
	color: 'green'
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