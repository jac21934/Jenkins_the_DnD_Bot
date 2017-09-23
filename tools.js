var aliases = require("./aliases.json");

function parseStringForStat(string){
		var stat = "";

		return stat;
}


function	getProf(prof){
		var profChar = " ";
		if(Number(prof) == 1){
				profChar = "*";
		}
		else{
				profChar = " ";
		}
		return profChar;
}


function	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max + 1);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function parseNumberFromString(Index,someString){
		var periodCheck = false;	
		buffVal = "";
		var numFlag = true;
		var initIndex = Index;
		while(numFlag){
				if( String(Number(someString[Index])) == someString[Index] ){
						buffVal += String(someString[Index])
					//	console.log(someString[Index] + " is a number.") 

				}
				else if((someString[Index] == '.') && (periodCheck == false) ){
						periodCheck = true;
						if(buffVal.length == 0){
								buffVal += "0";
						}
						buffVal += String(someString[Index]);
			//			console.log(someString[Index] + " is a period.") 

				}
				else{
				//		console.log(someString[Index] + " is not a number.") 

						numFlag = false;
				//		Index -=1;
						break;
				}
				if(Index == someString.length -1 ){
					//	console.log(someString[Index] + " is the last digit.") 

						numFlag = false;
				//		Index -=1;
						break;
				}
				Index += 1;

		}
//		console.log("I'm Out!");
		return Number(buffVal)
}

function findSpace(someString, index){
		var spaceIndex = index;
		for(i = index; i >-1; i--){

				if( someString[i] == " "){
						spaceIndex = i;
						break;
				}

		}

		return spaceIndex;
		

}

function  parseSum (someString){

		var checkFlag = true;
		var sumFlag = false;
		var minusFlag = false;
		var Index  = 0;
		var totVal = 0;
		var bufVal = "";
		var bufbufVal;
		while(checkFlag){
				Index = someString.indexOf("+");
				if( Index != -1 && Index != (someString.length -1)){
					
						bufVal = "";
						sumFlag = true;
						var buffArray = parseNumberFromString(Index+1,someString);
												
						if(String(buffArray)[0] == "0" && someString[Index+1] == "."){
								bufVal = String(buffArray).replace("0","");
						}
						else{
								bufVal = buffArray;
						}
						if(someString.indexOf("+" + bufVal) > -1){
								
								someString = someString.replace("+" + bufVal,'');
						}
						else{
								someString = someString.replace("+",'');
						}
						totVal += Number(buffVal);
				}
				else{
						sumFlag = false;
				}
				periodCheck = false;

				Index = someString.indexOf("-");
				if( Index != -1 && Index != (someString.length -1)){
						bufVal = "";
						minusFlag = true;
						var buffArray = parseNumberFromString(Index+1,someString);
						if(String(buffArray)[0] == "0" && someString[Index+1] == "."){
								bufVal = String(buffArray).replace("0","");
						}
						else{
								bufVal = buffArray;
						}
						if(someString.indexOf("-" + bufVal) > -1){
								
								someString = someString.replace("-" + bufVal,'');
						}
						else{
								someString = someString.replace("-",'');
						}
						totVal -= Number(buffVal);
							
				}
				else {
						minusFlag = false;
				}
				if(sumFlag == false && minusFlag == false){
						checkFlag = false;
				}				
		}

		return [totVal, someString];

}



function getDice(someString){
	var numDie = 0;
	var dieMax = 0;
/*	while((someString[0] != "d" && someString.length > 1)){
		someString = someString.replace(someString[0],"");
		console.log(someString);
	}*/
	if( someString[0] == "d"){
		numDie = 1;
	}
	else{
		numDie=parseNumberFromString(0,someString);
		someString = someString.replace(numDie, "");
	}

	if(someString.length == 0){
		dieMax = 0;	
	}		
	else if( someString[0] == "d"){
		dieMax=parseNumberFromString(1,someString);
	}
	else{
		dieMax = 0;	
	}
		

	return [Math.floor(numDie), Math.floor(dieMax)];
}


module.exports = {
		getProf,
		findSpace,
		getRandomInt,
		parseNumberFromString,
		parseSum,
		getDice
}


//module.export = tools;

