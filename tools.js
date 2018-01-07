var aliases = require("./aliases.json");
var config = require("./config.json");
var regex = require("./RegEx.json");

function getAliases(){
		var aliasMessage = "";
		var space = 28;
		var discordMax = config.discordWidth;
		for(alias in aliases){
				var messageBuff = "";
				var aliasHeader = "";
				if(aliases[alias][0][0] != "\\"){
						aliasHeader= aliases[alias][0] + Array(space - aliases[alias][0].length).join(" ") + '--   "' +alias + '"   '; ;
				}
				else{
						aliasHeader= alias + Array(space - String(alias).length).join(" ") + '--   "' + alias + '"   '; ;
				}
				
				
				for(i = 0; i < aliases[alias].length; i++){
						if(aliases[alias][i][0] != "\\"){
								messageBuff += '"' +  aliases[alias][i] + '"   ';
						}

				}
				
				if((messageBuff.length + aliasHeader.length) > discordMax){
						var maxIndex = discordMax - (messageBuff.length + aliasHeader.length);
						var buffString = "";
						var newIndex = breakOnCharSpace(messageBuff,maxIndex, '"', ' ');
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


				aliasMessage += aliasHeader + messageBuff + "\n\n";


		}
		return aliasMessage;
}




function breakUpString(someString, someBreak){

		var buffArr = someString.split(someBreak);
		var charMax = config.discordMax;
		var Arr = [];
		var buffString = "";//buffArr[0] + "\n";

		for(i = 0; i < buffArr.length;i++){
				if(buffString.length + buffArr[i].length < charMax){
						buffString += buffArr[i] + someBreak;
				}
				else{
						Arr.push(buffString);
						buffString = buffArr[i] + someBreak;
				}

		}
		if(Arr[Arr.length-1] != String(buffString)){

				Arr.push(buffString);
		}
		//		console.log(Arr);
		return Arr;
		

}


function parseStringForStat(someString){
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
		var stat = "";
    for(alias in aliases){
				for(i = 0; i < aliases[alias].length; i++){
						//						console.log(aliases[alias][i]);
						if(someString.indexOf(aliases[alias][i]) >-1){
								stat = alias;
								return stat;
						}
				}
    }
    return stat;
}

function parseAlias(someString){
    var stat = "";
		var aliasString = "";
    for(alias in aliases){
				for(i = 0; i < aliases[alias].length; i++){
						//						console.log(aliases[alias][i]);
						if(someString.indexOf(aliases[alias][i]) >-1){
								stat = alias;
								aliasString =  aliases[alias][i];
								return [stat, aliasString];
						}
						else{
								var re = new RegExp(aliases[alias][i]);
								if( someString.match(re) != null){
										stat = alias;
										aliasString = aliases[alias][i];
										return [stat, aliasString];
								}
						}
				}
    }
		var stat = "";
    for(alias in aliases){
				for(i = 0; i < aliases[alias].length; i++){
						//						console.log(aliases[alias][i]);
						if(someString.indexOf(aliases[alias][i]) >-1){
								stat = alias;
								return [stat, aliasString];
						}
				}
    }
    return [stat, aliasString];
}


function inWords (num) {
		var a = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
		
    if (num > 19) return num.toString();
		else return a[num];
		
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

function findNumberIndex(someString){
		for(i = 0; i < someString.length; i++){
				//				console.log(someString[i]);
				if(String(Number(someString[i])) == someString[i]){
						
						return i;
				}
				
		}
		return -1;

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

function breakOnCharSpace(someString, index, char, breakchar){
    var spaceIndex = index;
    for(i = index; i >-1; i--){

				if( someString[i] == char && i > 0 ){
						if(someString[i-1] == breakchar){
								spaceIndex = i-1;
								break;
						}
				}
    }
		
    return spaceIndex;
    

}

function parseSum(someString){
		var re =  new RegExp(regex.sumCheck);
		var reSplit = new RegExp(regex.sumPrefix);
		var buff = someString.match(re);
		var sum = 0;
		while((buff = someString.match(re)) != null){
				someString = someString.replace(re, "");
				console.log(buff);
				
				var sumBuff = Number(buff[0].replace(reSplit,""));
				console.log(buff[0])
				if( buff[0][0] == "-"){
						sumBuff = -1 * sumBuff;
				}
				sum += Number(sumBuff);
				
		}

		console.log(sum);

		return [sum.toFixed(2), someString];
		
}

// function  parseSum (someString){

//     var checkFlag = true;
//     var sumFlag = false;
//     var minusFlag = false;
//     var Index  = 0;
//     var totVal = 0;
//     var bufVal = "";
//     var bufbufVal;
// 		//    console.log("someString: " + someString);
//     while(checkFlag){
// 				Index = someString.indexOf("+");
// 				if( Index != -1 && Index != (someString.length -1)){
						
// 						bufVal = "";
// 						sumFlag = true;
// 						var buffArray = parseNumberFromString(Index+1,someString);
						
// 						if(String(buffArray)[0] == "0" && someString[Index+1] == "."){
// 								bufVal = String(buffArray).replace("0","");
// 						}
// 						else{
// 								bufVal = buffArray;
// 						}
// 						if(someString.indexOf("+" + bufVal) > -1){
								
// 								someString = someString.replace("+" + bufVal,'');
// 						}
// 						else{
// 								someString = someString.replace("+",'');
// 						}
// 						console.log(someString);

// 						totVal += Number(buffVal);
// 				}
// 				else{
// 						sumFlag = false;
// 				}
// 				periodCheck = false;

// 				Index = someString.indexOf("-");
// 				if( Index != -1 && Index != (someString.length -1)){
// 						bufVal = "";
// 						minusFlag = true;
// 						var buffArray = parseNumberFromString(Index+1,someString);
// 						if(String(buffArray)[0] == "0" && someString[Index+1] == "."){
// 								bufVal = String(buffArray).replace("0","");
// 						}
// 						else{
// 								bufVal = buffArray;
// 						}
// 						if(someString.indexOf("-" + bufVal) > -1){
								
// 								someString = someString.replace("-" + bufVal,'');
// 						}
// 						else{
// 								someString = someString.replace("-",'');
// 						}
// 						totVal -= Number(buffVal);
						
// 				}
// 				else {
// 						minusFlag = false;
// 				}
// 				if(sumFlag == false && minusFlag == false){
// 						checkFlag = false;
// 				}				
//     }
//     //	console.log("totVal: " + totVal);
//     return [totVal, someString];


// }


function getDice(someString){
		var numDie = 0;
		var dieMax = 0;
		var dice = [];


    if(parseStringForStat(someString) != "")
    {
				dice = [[1,20]];
    }
		else{
				
			//	re = new RegExp("\\b(([1-9])([0-9]*))?d([1-9])([0-9]*)\\b");
				re = new RegExp(regex.dieCheck);
				
				var buff;
				// console.log(someString.match(re));
				
				while((buff = someString.match(re)) != null){
						//				console.log(someString.match(re));
						
						var die = buff[0].split("d");
						//				console.log(die);
						if( die[0] == ''){
								
								dice.push( [ Number(1) , Number(die[1]) ] );
						}
						else{
								dice.push( [ Number(die[0]) , Number(die[1]) ] );
								
						}

						someString = someString.replace(re, "");
						
				}
		}

		return [dice, someString];
		
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

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}



function getRollMessage(numDieArr, maxDieArr, modifier, players, id, sumFlag, advFlag, disFlag,rollType){
		var rollMessage = "";

		var numDie = 0;
		var maxCheck = 0;
					var name = "";
						for(i=0; i < players.length;i++){
								if(id == players[i].getId()){
										name = players[i].getName();
										break;
								}
								
						}
								

		for(i = 0; i < numDieArr.length; i++){
				numDie += Number(numDieArr[i]);
		}

		for(i = 0; i < maxDieArr.length; i++){
				maxCheck += Number(maxDieArr[i]);
		}

		// console.log( advFlag);
		// console.log(disFlag);
		
		if(isNaN(numDie) || isNaN(maxCheck) || (numDieArr.length == 0) || (maxDieArr.length == 0) ){
		 		rollMessage += "I didn't understand that input. I can take values like 3d6 + 2 or 12d13 - 21 or strength.\n";
		}
		else if ( numDieArr.length != maxDieArr.length){
				rollMessage += "The number of dice vector and number of sides vector have different lengths! I do not know how this happened. Please tell Jacob."; 
		}
		else if(numDie > 100){
				rollMessage += "Please roll one hundred or less dice.\n";
		}
		else if(numDie == 0){
				rollMessage += "Ok rolling zero dice...\n";
		}
		else if(((numDieArr.length >1)
						 || (maxDieArr.length > 1)
						 || (numDieArr[0] !=1)
						 || (maxDieArr[0] !=20) )
						&& (advFlag || disFlag)
					 ){

				rollMessage += "You can only roll 1d20 with advantage or disadvantage right now.";
		}
		else{
				
				rollMessage += "Rolling ";

				for(k = 0; k < numDieArr.length; k++){
						rollMessage	+= numDieArr[k] + "d"+ maxDieArr[k];

						if(numDieArr.length > 2){

								if(k < numDieArr.length - 1){
										rollMessage += ", ";
										
								
								}

								if( k == numDieArr.length - 2){

										rollMessage += "and ";
								}
						}
						else if(numDieArr.length == 2){
								if( k < numDieArr.length - 1){
										rollMessage += " and ";
								}
						}
				}
				
				if (Number(modifier) != 0){
						if (modifier < 0){
								if(numDieArr.length == 1){
								rollMessage += modifier;
								}
								else{
										rollMessage += " - " + Math.abs(modifier);
								}
						}
						else if (modifier >0){
								if(numDieArr.length > 1){
										rollMessage += " + " + modifier;
								}
								else{
										rollMessage += "+" + modifier;
								}
						}
				}

				if( rollType != ""){
						for( alias in aliases){
								if (rollType == alias){
										rollMessage += " (" + toTitleCase(aliases[alias][0]) + ")";
								}
								
						}
				}
				
				if(advFlag)
				{
						rollMessage += " with advantage";
				}
				if(disFlag)
				{
						rollMessage += " with disadvantage";
				}
				if(name != ""){
						rollMessage += " for " + name + "\n";
				}
				else{
						rollMessage += "\n";
						
				}
				var filler = Array(rollMessage.length).join("-") + "\n";
				if(sumFlag == false){
						rollMessage += filler;
				}
				
				var rollSum = 0;
				var multiRoll = false
				if(numDieArr.length > 1){
						multiRoll = true;
				}
				for(j = 0; j < numDieArr.length; j++){
						if(multiRoll){
								rollMessage += numDieArr[j] + "d" + maxDieArr[j] + ":\n";
								rollMessage += Array(String(numDieArr[j] + "d" + maxDieArr[j] + ":").length + 1).join("-") + "\n" ;
						}
						for(k = 0; k < numDieArr[j]; k++) {
								if(multiRoll){
										rollMessage += "   ";
								}
								
								var dieRoll = getRandomInt(1, maxDieArr[j]);

								if (sumFlag == false) {
										rollMessage += dieRoll;
										if(maxDieArr[j] == 20){
												if( dieRoll == 20){
														rollMessage += " *Crit*";
												}
												else if(dieRoll == 1){
														rollMessage += " *Crit Fail*";
												}
										}
										rollMessage += "\n";
										if (advFlag || disFlag)
										{
												var dieRollNew = getRandomInt(1, maxDieArr[j]);
												rollMessage += dieRollNew;
												if(maxDieArr[j] == 20){
														if( dieRollNew == 20){
																rollMessage += " *Crit*";
														}
														else if(dieRollNew == 1){
																rollMessage += " *Crit Fail*";
														}
												}
												rollMessage += "\n";
										}
										if(advFlag)
										{
												dieRoll = Math.max(dieRoll, dieRollNew);
										}
										else if(disFlag)
										{
												dieRoll = Math.min(dieRoll, dieRollNew);
										}
								}
								rollSum += dieRoll;
						}
						if(multiRoll && (j < numDieArr.length - 1)){
								rollMessage += "\n";
						}

				}

				var sumMessage = "";
				var modMessage = "";
				var totMessage = "";
				var advMessage = "";
				var maxFill = 0;
				if(numDie > 1){
						sumMessage += "Sum: " + rollSum + "\n";
				}
				if(advFlag)
				{
						advMessage += "Max: " + dieRoll + "\n";
				}
				if(disFlag)
				{
						advMessage += "Min: " + dieRoll + "\n";
				}
				if(modifier != ""){
						modMessage += "Modifier: " + modifier + "\n";	
						var totalSum = rollSum+modifier;
						totMessage += "Total Sum: " + totalSum + "\n";	
				}
				if( numDie>1 || modifier !="" || disFlag || advFlag){
						if(sumFlag == true){
								maxFill = Math.max(String(sumMessage).length, String(modMessage).length, String(totMessage).length, String(filler).length, String(advMessage).length);
						}
						else{
								maxFill = Math.max(String(sumMessage).length, String(modMessage).length, String(totMessage).length, String(advMessage).length);
						}
						filler = Array(maxFill).join("-") + "\n";
						rollMessage +=filler;
						if(advFlag || disFlag)
						{
								rollMessage += advMessage;
						}
						if(numDie > 1){
								rollMessage += sumMessage;
						}
						if(modifier != ""){
								rollMessage += modMessage;
								rollMessage += totMessage;
						}
				}
		}
		
		
		return rollMessage;

}

module.exports = {
		toTitleCase,
		inWords,
		getAliases,
    getProf,
    parseStringForStat,
    findSpace,
    getRandomInt,
		findNumberIndex,
    parseNumberFromString,
//		parseSumNew,
    parseSum,
    getDice,
		breakUpString,
    getModFromString,
		getRollMessage
}


//module.export = tools;

