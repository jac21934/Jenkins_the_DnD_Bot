tools = {
 	getProf: function(prof){
			var profChar = " ";
			if(Number(prof) == 1){
					profChar = "*";
			}
			else{
					profChar = " ";
			}
			return profChar;
	}
}

module.export = tools;

