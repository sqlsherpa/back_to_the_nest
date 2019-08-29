

;(function ( $, window, document, undefined){


	var gameName = 'backToTheNest',
		defaults = {
			canvasSize: {x:640,y:690}
		};

	//plugin constructor
	function Game(element, options){

		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = gameName;


		//Initialize the game
		this.init();
	}

	//avoid game.prototype conflicts
	$.extend(Game.prototype, {

			init: function(){
				this.aFunction();
			},
			aFunction:function(){
				console.log('Game Initialized');
			}
	});

	//lightweight plugin wrapper around constructor 
	//preventing against multiple instantiations

	$.fn[ gameName ] = function( options ){

		this.each(function() {
				if (!$.data( this, "plugin_" + gameName)){
					 $.data( this, "plugin_" + gameName, new Game(this, options));
				}
		});

		//chain jQuery functions
		return this;
	};

})( jQuery, window, document);