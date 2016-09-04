var Deployable = {
	id: '',
	$elem: '',
	height: 0,
	width: 0,
	loc: [],
	backgroundColor: '',

	init: function(props){
		this.id = props['id'];// || 'dep_' + Math.floor((Math.random() * 1000) + 1);
		this.height = props['height'] || 50;
		this.width = props['width'] || 50;
		this.color = props['color'] || '#000000';

		if(props['loc']){
			this.loc = props['loc'];
		} else{
			this.loc[0] = Math.floor((Math.random() * 500) + 1);
			this.loc[1] = Math.floor((Math.random() * 500) + 1);
		}
	},

	draw: function($where){
		if($where){
			this.$elem = $('<div>').css({
				height: this.height,
				width: this.width,
				position: 'absolute',
				left: this.loc[0] + 'px',
				top: this.loc[1] + 'px',
				backgroundColor: this.color
			}).attr('id', this.id).appendTo($where);
		}
	},

	setLoc: function(loc){
		this.loc = loc;
		this.$elem.css({
			left: this.loc[0],
			top: this.loc[1]
		});
	}
}