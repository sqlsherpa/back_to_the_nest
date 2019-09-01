

kontra.init();//create the kontra object


//create a sprite object
var sprite = kontra.sprite({
	x:100,
	y: 50,
	width: 50,
	height: 100,
	color: 'green'
});

//game loop 60fps

var loop = kontra.gameLoop({
	update: function(){
		sprite.update();
	},
	render: function(){
		sprite.render();
	}
})


loop.start();