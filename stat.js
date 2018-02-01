var Stat =  {
		value: "",
		prof : "",
		bonus: "",
		mainStat: "",
		type: ""		
}


Stat.prototype = {
		get: function(){
				return this['value'];
		},

		set: function(value){
				this['value'] = value;
		}
}


module.exports = Stat;
