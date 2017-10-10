var aliases = require("./aliases.json");

function getAliases(){
		var aliasMessage = "";
		var space = 28;
		var discordMax = 140;
		for(alias in aliases){
				var messageBuff = "";
				var aliasHeader= aliases[alias][0] + Array(space - aliases[alias][0].length).join(" ") + '--   "' +alias + '"   '; ;

				for(i = 0; i < aliases[alias].length; i++){
						if(aliases[alias][i][0] != "\\"){
								messageBuff += '"' +  aliases[alias][i] + '"   ';
						}

				}
					
				if((messageBuff.length + aliasHeader.length) > discordMax){
						var maxIndex = discordMax - (messageBuff.length + aliasHeader.length);
						var buffString = "";
						var newIndex = breakOnCharSpace(messageBuff,maxIndex, '"');
						// 	if(newIndex == maxIndex || newIndex < maxIndex - 15){ 
						// 					buffString = arrBuff[k].slice(maxIndex);
						// 					arrBuff[k] = arrBuff[k].replace(buffString,"-");
						// 					buffString = "-" + buffString;
						// 			}
						// //	
						//	else{
						buffString = messageBuff.slice(newIndex);
						messageBuff = messageBuff.replace(buffString, "");
						//		}
						
						messageBuff += "\n" +Array(space + String('--   ').length).join(" ") +  buffString; 
						
				}


				aliasMessage += aliasHeader + messageBuff + "\n";;


		}
		console.log(aliasMessage);
		return aliasMessage;
}
function breakUpString(someString){

		var buffArr = someString.split("\n");
		console.log(buffArr);
		var charMax = 1999;
		var Arr = [];
		var buffString = buffArr[0] + "\n";

		for(i = 0; i < buffArr.length;i++){
				console.log(buffString.length)
				if(buffString.length + buffArr[i].length < charMax){
						buffString += buffArr[i] + "\n";
				}
				else{
						Arr.push(buffString);
						buffString = "";
				}

		}
//		console.log(Arr);
		return Arr;
	

}


function parseStringForStat(someString){
//	<<<<<<< Updated upstream
    var stat = "";
    for(alias in aliases){
	for(i = 0; i < aliases[alias].length; i++){
	    //						console.log(aliases[alias][i]);
	    if(someString.indexOf(aliases[alias][i]) >-1){
		stat = alias;
		return stat;
	    }
	    else{
		var re = new RegExp(aliases[alias][i]);
		if( someString.match(re) != null){
		    stat = alias;
		    return stat;
		}
	    }
	}
    }
//	=======
	var stat = "";
    for(alias in aliases){
	for(i = 0; i < aliases[alias].length; i++){
	    //						console.log(aliases[alias][i]);
	    if(someString.indexOf(aliases[alias][i]) >-1){
		stat = alias;
//		    >>>>>>> Stashed changes
		return stat;
	    }
	}
    }
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

function breakOnCharSpace(someString, index, char){
    var spaceIndex = index;
    for(i = index; i >-1; i--){

				if( someString[i] == char && i > 0 ){
						if(someString[i-1] == " "){
								spaceIndex = i-1;
								break;
						}
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
    console.log("someString: " + someString);
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
	    console.log(someString);

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
    //	console.log("totVal: " + totVal);
    return [totVal, someString];


}



function getDice(someString){
    var numDie = 0;
    var dieMax = 0;
    /*	while((someString[0] != "d" && someString.length > 1)){
	someString = someString.replace(someString[0],"");
	console.log(someString);
	}*/
    
    if(parseStringForStat(someString) != "")
    {
	numDie = 1;
	dieMax = 20;
    }
    
    else 
    {
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
    }
    return [Math.floor(numDie), Math.floor(dieMax)];
}

function getModFromString(players, id, stat)
{
    var modifier = 0;
    for(i = 0; i < players.length; i++)
    {
	if(players[i].getId() == id)
	{
	    
	    switch(stat){
		//base stats
	    case "str":
		modifier = players[i].getStrmod() + players[i].getStradd();
		break;
	    case "dex":
		modifier = players[i].getDexmod() + players[i].getDexadd();
		break;
	    case "con":
		modifier = players[i].getConmod() + players[i].getConadd();
		break;
	    case "int":
		modifier = players[i].getIntmod()  + players[i].getIntadd();
		break;
	    case "wis":
		modifier = players[i].getWismod() + players[i].getWisadd();
		break;
	    case "cha":
		modifier = players[i].getChamod() + players[i].getChaadd();
		break;
		//strength skills
	    case "strsav":
		modifier = players[i].getStrmod() + players[i].getProfbonus() * players[i].getStrsavprof() + players[i].getStrsavadd();
		break;
	    case "ath":
					modifier = players[i].getStrmod() + players[i].getProfbonus() * players[i].getAthprof() + players[i].getAthadd();
		break;
		//dex skills
	    case "dexsav":
		modifier = players[i].getDexmod() + players[i].getProfbonus() * players[i].getDexsavprof() + players[i].getDexadd();
		break;
	    case "init":
		modifier = players[i].getInit();
		break;
	    case "acr":
		modifier = players[i].getDexmod() + players[i].getProfbonus() * players[i].getAcroprof() + players[i].getAcroadd();
		break;
	    case "soh":
		modifier = players[i].getDexmod() + players[i].getProfbonus() * players[i].getSleightprof() + players[i].getSleightadd();
		break;
	    case "ste":
		modifier = players[i].getDexmod() + players[i].getProfbonus() * players[i].getStealthprof() + players[i].getStealthadd();
		break;
		//con skills
	    case "consav":
		modifier = players[i].getConmod() + players[i].getProfbonus() * players[i].getConsavprof() + players[i].getConsavadd();
		break;
		//int skills
	    case "intsav":
		modifier = players[i].getIntmod() + players[i].getProfbonus() * players[i].getIntsavprof() + players[i].getIntsavadd();
		break;
	    case "arc":
		modifier = players[i].getIntmod() + players[i].getProfbonus() * players[i].getArcanaprof() + players[i].getArcanaadd();
		break;
	    case "his":
		modifier = players[i].getIntmod() + players[i].getProfbonus() * players[i].getHistoryprof() + players[i].getHistoryadd();
		break;
	    case "inv":
		modifier = players[i].getIntmod() + players[i].getProfbonus() * players[i].getInvestprof() + players[i].getInvestadd();
		break;
	    case "rel":
		modifier = players[i].getIntmod() + players[i].getProfbonus() * players[i].getReligionprof() + players[i].getReligionadd();
		break;
	    case "nat":
		modifier = players[i].getIntmod() + players[i].getProfbonus() * players[i].getNatureprof() + players[i].getNatureadd();
		break;
		//wis skills
	    case "wissav":
		modifier = players[i].getWismod() + players[i].getProfbonus() * players[i].getWissavprof() + players[i].getWissavadd();
		break;
	    case "ani":
		modifier = players[i].getWismod() + players[i].getProfbonus() * players[i].getAnimalprof() + players[i].getAnimaladd();
		break;
	    case "ins":
		modifier = players[i].getWismod() + players[i].getProfbonus() * players[i].getInsightprof() + players[i].getInsightadd();
		break;
	    case "med":
		modifier = players[i].getWismod() + players[i].getProfbonus() * players[i].getMedicineprof() + players[i].getMedicineadd();
		break;
	    case "per":
		modifier = players[i].getWismod() + players[i].getProfbonus() * players[i].getPerprof() + players[i].getPeradd();
		break;
	    case "sur":
		modifier = players[i].getWismod() + players[i].getProfbonus() * players[i].getSurvprof() + players[i].getSurvadd();
		break;
		//cha skills
	    case "chasav":
		modifier = players[i].getChamod() + players[i].getProfbonus() * players[i].getChasavprof() + players[i].getChasavadd();
		break;
	    case "dec":
		modifier = players[i].getChamod() + players[i].getProfbonus() * players[i].getDeceptprof() + players[i].getAcroadd();
		break;
	    case "intim":
		modifier = players[i].getChamod() + players[i].getProfbonus() * players[i].getIntimprof() + players[i].getIntimadd();
		break;
	    case "perf":
		modifier = players[i].getChamod() + players[i].getProfbonus() * players[i].getPerformprof() + players[i].getPerformadd();
		break;
	    case "pers":
		modifier = players[i].getChamod() + players[i].getProfbonus() * players[i].getPersprof() + players[i].getPersadd();
		break;
	    default:
		break;
	    }
	    break;
	}
    }
    return modifier;
}


module.exports = {
		getAliases,
    getProf,
    parseStringForStat,
    findSpace,
    getRandomInt,
    parseNumberFromString,
    parseSum,
    getDice,
		breakUpString,
    getModFromString
}


//module.export = tools;

