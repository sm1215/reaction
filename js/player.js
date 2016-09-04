
var Player = Object.create(Deployable);

Player.spawn = function(props){
	this.init(props);
	this.speed = props['speed'] || 2;
	this.isUp = 0;
	this.isRight = 0;
	this.isDown = 0;
	this.isLeft = 0;
	this.moveTimer = null;

	console.log('x: '+this.loc[0]);
};

Player.move = function(){
	this.moveDebug('[MOVE]');
	isUp = this.isUp;
	isRight = this.isRight;
	isLeft = this.isLeft;
	isDown = this.isDown;
	loc = this.loc;
	distance = this.speed;

	//Up
	if(isUp > 0 && isRight < 1 && isLeft < 1 && isDown < 1){ loc[1] -= distance; }

	//UpRight
	if(isUp > 0 && isRight > 0 && isLeft < 1 && isDown < 1){ loc[1] -= distance; loc[0] += distance; }

	//UpLeft
	if(isUp > 0 && isRight < 1 && isLeft > 0 && isDown < 1){ loc[1] -= distance; loc[0] -= distance; }

	//Right
	if(isUp < 1 && isRight > 0 && isLeft < 1 && isDown < 1){ loc[0] += distance; }
	
	//Down
	if(isUp < 1 && isRight < 1 && isLeft < 1 && isDown > 0){ loc[1] += distance; }

	//DownRight
	if(isUp < 1 && isRight > 0 && isLeft < 1 && isDown > 0){ loc[1] += distance; loc[0] += distance; }

	//DownLeft
	if(isUp < 1 && isRight < 1 && isLeft > 0 && isDown > 0){ loc[1] += distance; loc[0] -= distance; }

	//Left
	if(isUp < 1 && isRight < 1 && isLeft > 0 && isDown < 1){ loc[0] -= distance; }

	this.setLoc(loc);
};

Player.startMove = function(direction){
	switch(direction){
		case 'up': this.isUp = 1; break;
		case 'right': this.isRight = 1; break;
		case 'down': this.isDown = 1; break;
		case 'left': this.isLeft = 1; break;
	}


	if(this.moveTimer){ console.log(this.moveTimer); return; }
	var player = this;
	this.moveTimer = setInterval(
		function(){ 
			console.log('timer running');
			player.move();
		}(player), 50);
};

Player.stopMove = function(direction){
	// switch(direction){
	// 	case 'up': this.isUp = 0; break;
	// 	case 'right': this.isRight = 0; break;
	// 	case 'down': this.isDown = 0; break;
	// 	case 'left': this.isLeft = 0; break;
	// }
	// this.moveDebug('[END]');
	// if(this.isUp < 1 && this.isRight < 1 && this.isDown < 1 && this.isLeft < 1){
	// 	if(this.moveTimer){ clearInterval(this.moveTimer); this.moveTimer = null; }
	// }
};

Player.moveDebug = function(label){
	console.log(label + ' up: ' + this.isUp + ' right: ' + this.isRight + ' down: ' + this.isDown + ' left: ' + this.isLeft);
}