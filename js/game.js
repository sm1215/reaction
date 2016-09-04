var game = {
	world: null,
	context: null,
	regs: [],
	regCount: 2,
	timerSpeed: 100,
	bounds: {},
	moveRegs: null,
	reactWeight: 0.1666666666666667,

	init: function(){
		var world = $('#world')[0],
			context = world.getContext('2d'),
			regs = [],
			bounds = {
				x: $('#world').outerWidth(),
				y: $('#world').outerHeight()
			};

		this.world = world;
		this.context = context;
		this.bounds = bounds;

		for (var i = 0; i < this.regCount; i++) {
			regs[i] = this.createReagent({
				height: 50,
				width: 50,
				position: {
					x: this.getRandomValue(0, bounds.x - 50),
					y: this.getRandomValue(0, bounds.y - 50)
				},
				destination: {
					// x: this.getRandomValue(0, bounds.x - 50),
					// y: this.getRandomValue(0, bounds.y - 50)
					x: 400,
					y: 300
				}
			});
			this.renderReagent(regs[i]);
		};
		
		this.regs = regs;
		
		this.startAllReagents();
	},

	createReagent: function(props){
		var reagent = {},
			height = props['height'] || 100,
			width = props['width'] || 100,
			position = {
				x: props['position']['x'] || ($('#world').outerWidth() / 2) - width,
				y: props['position']['y'] || ($('#world').outerHeight() / 2) - height
			},
			destination = {
				x: props['destination']['x'] || ($('#world').outerWidth() / 2) - width,
				y: props['destination']['y'] || ($('#world').outerHeight() / 2) - height
			}
			color = props['color'] || this.getRandomColor();

		reagent.height = height;
		reagent.width = width;
		reagent.position = { x: position.x, y: position.y };
		reagent.destination = { x: destination.x, y: destination.y };
		reagent.color = color;
		return reagent;
	},

	moveReagent: function(reg){
		var moveX = 10,
			moveY = 10;

		//Check to see if we're close to the destination, if we are get a new one
		if(Math.abs(reg.destination.x - reg.position.x) < 10){
			reg.destination.x = this.getRandomValue(0, this.bounds.x - 50);
		} 

		//Check to see if we're close to the destination, if we are get a new one
		if(Math.abs(reg.destination.y - reg.position.y) < 10){
			reg.destination.y = this.getRandomValue(0, this.bounds.y - 50);
		} 

		//Try moving towards the destination
		try{ 
			if(reg.position.x > reg.destination.x){
				moveX = -Math.abs(moveX);
			}	
		} catch(err){
			console.log('reg.position.x: ', reg.position.x);
			console.log('reg.destination.x: ', reg.destination.x);
			console.log('moveY: ', moveX);
			this.stopAllReagents();
		}

		//Try moving towards the destination
		try{ 
			if(reg.position.y > reg.destination.y){
				moveY = -Math.abs(moveY);
			}
		} catch(err){
			console.log('reg.position.y: ', reg.position.y);
			console.log('reg.destination.y: ', reg.destination.y);
			console.log('moveY: ', moveY);
			this.stopAllReagents();
		}

		reg.position.x += moveX;
		reg.position.y += moveY;
	},

	clearReagent: function(reg){
		this.context.clearRect(reg['position']['x'], reg.position.y, reg.width, reg.height);
	},

	renderReagent: function(reg){
		this.context.fillStyle = 'rgb(' + reg.color + ')';
		this.context.fillRect(reg.position.x, reg.position.y, reg.width, reg.height);
	},

	checkReagentCollisions: function(index){
		var regs = this.regs,
			reg1 = regs[index];

		for (var i = 0; i < regs.length; i++) {
			if(i !== index){
				var reg2 = regs[i];

				if(reg1.position.x < reg2.position.x + reg2.width &&
					reg1.position.x + reg1.width > reg2.position.x &&
					reg1.position.y < reg2.position.y + reg2.height &&
					reg1.height + reg1.position.y > reg2.position.y){

					this.createReaction(reg1, reg2);
				}
			}
		};
	},

	//ideas for reactions
	//red explodes - divides into smaller squares
	//green absorbs - groups 2 squares into one
	//blue bounces - bounces away at an increased speed

	//locking these ideas to the colors might be bad,
	//since this won't create much variety between the reactions and the colors
	//one color will just perpuate the same behavior
	createReaction: function(reg1, reg2){
		var reactWeight = this.reactWeight,
			reg1ColorSplit = reg1.color.split(','),
			reg1Color = {
				r: reg1ColorSplit[0],
				b: reg1ColorSplit[1],
				g: reg1ColorSplit[2]
			},
			reg2ColorSplit = reg2.color.split(','),
			reg2Color = {
				r: reg2ColorSplit[0],
				b: reg2ColorSplit[1],
				g: reg2ColorSplit[2]
			}
			regColorDifferences = {
				r: Math.abs(reg1ColorSplit[0] - reg2ColorSplit[0]),
				g: Math.abs(reg1ColorSplit[1] - reg2ColorSplit[1]),
				b: Math.abs(reg1ColorSplit[2] - reg2ColorSplit[2])
			},
			winningNumber = Math.max(regColorDifferences.r, regColorDifferences.g, regColorDifferences.b),
			winningColor = null,
			newReg1Color = [],
			newReg2Color = [];

		if(winningNumber === regColorDifferences.r){
			winningColor = 'r';
			losingColor1 = 'g';
			losingColor2 = 'b';
		} else if(winningNumber === regColorDifferences.g){
			winningColor = 'g';
			losingColor1 = 'r';
			losingColor2 = 'b';
		} else if(winningNumber === regColorDifferences.b){
			winningColor = 'b';
			losingColor1 = 'r';
			losingColor2 = 'g';
		}

		//Take away 1/6 of losing reg's 'winningColor'
		//Add it to winning reg's 'winninColor'

		//Take away 1/6 of losing reg's 'winningColor'
		//Add it to losing reg's 'losingColor1'

		//Take away 1/6 of losing reg's 'winningColor'
		//Add it to losing reg's 'losingColor2'

		//If the difference of the winningColor is positive, reg1 wins
		//else reg2 wins
		if(regColorDifferences[winningColor] > 0){
			
			var loss = Math.floor(reg2Color[winningColor] * reactWeight);
			reg2Color[winningColor] = parseInt(reg2Color[winningColor]) - (loss * 2);

			if(this.getRandomValue(1, 2) > 1){
				reg2Color[losingColor1] = parseInt(reg2Color[losingColor1]) + loss;
			} else {
				reg2Color[losingColor2] = parseInt(reg2Color[losingColor2]) + loss;
			}
		} else {

			var loss = Math.floor(reg1Color[winningColor] * reactWeight);
			reg1Color[winningColor] = parseInt(reg1Color[winningColor]) - (loss * 2);

			if(this.getRandomValue(1, 2) > 1){
				reg1Color[losingColor1] = parseInt(reg1Color[losingColor1]) + loss;
			} else {
				reg1Color[losingColor2] = parseInt(reg1Color[losingColor2]) + loss;
			}
		}

		reg1.color = reg1Color.r + ',' + reg1Color.g + ',' + reg1Color.b;
		reg2.color = reg2Color.r + ',' + reg2Color.g + ',' + reg2Color.b;

		this.moveReagentsApart(reg1, reg2);

		// console.log('reg1 color: ', reg1.color);
		// console.log('reg2 color: ', reg2.color);
	},

	//just tried to invert the original destination to get them heading
	//in different directions, but this had a poor result
	moveReagentsApart: function(reg1, reg2){
		// var bounds = this.bounds,
		// 	newDestination1 = {
		// 		x: reg1.destination.x * -1,
		// 		y: reg1.destination.y * -1
		// 	},
		// 	newDestination2 = {
		// 		x: reg2.destination.x * -1,
		// 		y: reg2.destination.y * -1
		// 	};

		// if(newDestination1.x < 0){ newDestination1.x = 0; }
		// if(newDestination1.y < 0){ newDestination1.y = 0; }
		// if(newDestination1.x > bounds.x){ newDestination1.x = bounds.x; }
		// if(newDestination1.y > bounds.y){ newDestination1.y = bounds.y; }

		// if(newDestination2.x < 0){ newDestination2.x = 0; }
		// if(newDestination2.y < 0){ newDestination2.y = 0; }
		// if(newDestination2.x > bounds.x){ newDestination2.x = bounds.x; }
		// if(newDestination2.y > bounds.y){ newDestination2.y = bounds.y; }

		// reg1.destination.x = newDestination1.x;
		// reg1.destination.y = newDestination1.y;
		// reg2.destination.x = newDestination2.x;
		// reg2.destination.y = newDestination2.y;
	},

	//starts the timer for movement
	startAllReagents: function(){
		var regs = this.regs,
			timerSpeed = this.timerSpeed;
		
		this.moveRegs = setInterval(function(){
			for (var i = 0; i < regs.length; i++) {
				game.clearReagent(regs[i]);
				game.moveReagent(regs[i]);
				game.checkReagentCollisions(i);
				game.renderReagent(regs[i]);
			};
		}, timerSpeed);
	},

	//stops the timer for movement
	stopAllReagents: function(){
		window.clearTimeout(game.moveRegs);
	},

	//generates a random rgb value to use as a color
	getRandomColor: function(){
		var color = [];

		for (var i = 0; i < 3; i++) {
			color.push(this.getRandomValue(0, 255));
		};

		return color.join(',');
	},

	getRandomValue: function(min, max){
		return Math.ceil(Math.random() * (max - min) + min);
	}
}