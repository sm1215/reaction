document.addEventListener('DOMContentLoaded', function(e){
	init();
});

var engine = {
	now: null,
	dt: 0,
	last: null,
	step: 1/60,

	frame: function(){
		now = engine.timestamp();
		last = engine.last;
		dt = engine.dt + Math.min(1, (now - last) / 1000);
		step = engine.step;

		// console.log('now: ', now, ' dt: ', dt);

		while(dt > step){
			dt = dt - step;
			engine.update(step);
		}

		engine.render(dt);
		this.last = now;

		requestAnimationFrame(engine.frame);
	},

	timestamp: function(){
		return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	},

	update: function(tFrame){
	},
	render: function(dt){}

}

var capture = {
	playerInput: function(){
		document.addEventListener('keydown', function(e){
			var keycode = (e.keyCode ? e.keyCode : e.which);
			if(keycode == 87){ player.startMove('up'); }	//W key
			if(keycode == 65){ player.startMove('left'); }	//A key
			if(keycode == 83){ player.startMove('down'); }	//S key
			if(keycode == 68){ player.startMove('right'); }	//D key
		});

		document.addEventListener('keyup', function(e){
			var keycode = (e.keyCode ? e.keyCode : e.which);
			if(keycode == 87){ player.stopMove('up'); }		//W key
			if(keycode == 65){ player.stopMove('left'); }	//A key
			if(keycode == 83){ player.stopMove('down'); }	//S key
			if(keycode == 68){ player.stopMove('right'); }	//D key
		});
	}
}

var player = {
	startMove: function(direction){
		console.log('start moving in direction: ', direction);
	},

	stopMove: function(direction){
		console.log('stop moving in direction: ', direction);
	}

}

function init(){
	engine.frame();
	capture.playerInput();
}