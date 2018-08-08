
var fs = require('fs');
var tools = require("./tools.js"); 
var config = require("./config.json");
var armor = require("./inventory/armor.json");

function Player() {}



Player.prototype = {

		///////////////////////////

		initialize: function(){
				this.parseNotes();
				this.setMods();
				this.parseArmor();
		},

		parseArmor: function(){
				var armor_type = "none";
				if(this["armor"].get() == "na"){
						return;
				}
				
				for( ar in armor){
						if(this["armor"].get() == armor[ar][0]){
								armor_type = ar;
								break;
						}
				}
				var newAC = armor[armor_type][2];
				var ACdexBuff = 0;
				if(armor[armor_type][3] != "na"){
						if(armor[armor_type][3] == "Inf"){
								ACdexBuff = Number(this["dex"]["modifier"]);
						}
						
						else{							
								ACdexBuff = Math.min(Number(this["dex"]["modifier"]), Number(armor[armor_type][3]));
						}
				}
				newAC = Number(newAC) + Number(ACdexBuff);			
				this["ac"].set(newAC);
				
		},

		
		
		getStatsMessage: function(){

				var statsMessage = "";
				var space = 4;
				var headerLength = String(this["name"].get()).length + String("Level ").length + String(this["level"].get()).length + String(this["class"].get()).length;


				var defHeader = "AC = " + String(Number(this["ac"].get()) + Number(this["ac"]["bonus"]) ) + "   |   INIT = " + String(Number(this["init"].get()) + Number(this["init"]["bonus"])) + "   |   SPD = " + String(Number(this["spd"].get()) +Number(this["spd"]["bonus"])) + "   |   PER = " + String(10 + Number(this["per"]["bonus"]) + Number(this["per"]["prof"])*Number(this["prof"].get()) + Number(this["wis"]["modifier"])) + "   |   HP = " + String(Number(this["hp"].get()) + Number(this["hp"]["bonus"])) + "\n";

				if(defHeader.length > headerLength){
						space = Math.ceil((defHeader.length - headerLength)/2) +1;
				}
				var messageHeader = this["name"].get() + Array(space).join(" ") + "Level " + this["level"].get() + Array(space).join(" ") + this["class"].get() + "\n";

				fillerLength = Math.max(messageHeader.length, defHeader.length);

				var messagefiller = Array(fillerLength).join("-") + "\n";
				var deffiller = Array(defHeader.length).join("-") + "\n";
				
				statsMessage += messageHeader + messagefiller + defHeader + messagefiller;
				for(key in this){
						if(this[key]["type"] == "stat"){
								statsMessage += key.toUpperCase() + " = " + Number(Number(this[key].get()) + Number(this[key]["bonus"])) + " (" + String(this[key]["modifier"]) + ")\n";
						}
				}
				var profMessage = "Proficiency Bonus = " + this["prof"].get() + "\n";

				var filler = Array(profMessage.length).join("-") + "\n";

				statsMessage += filler + profMessage;

				return statsMessage;

		},



		getSkillsMessage: function(){

				var skillsMessage = "";
				var space = 30;
				var messageHeader = this["name"].get() + Array((space - this["name"].get().length) - String("Skills").length).join(" ") + "Skills" +  "\n";
				skillsMessage += messageHeader + Array(messageHeader.length).join("-")  + "\n";

				var counter = 0;
				var oldStat = "str";
				for( key in this){
						if( this[key]["type"] == "skill"){
								if( this[key]["mainStat"] != oldStat){
										if( counter <= 3){
												for( i = counter; i < oldStat.length; i++){
														skillsMessage += oldStat[i].toUpperCase() + "|                   | |" + "\n";;
												}
										}
										skillsMessage += Array(messageHeader.length).join("-")  + "\n"
										oldStat = this[key]["mainStat"];
										counter = 0;
								}
								
								if(counter < 3){
										skillsMessage += this[key]["mainStat"][counter].toUpperCase();
								}
								else{
										skillsMessage += " ";
								}
								skillsMessage += "| " + this[key]["name"] + Array(18 - this[key]["name"].length).join(" ") +  " |";
								skillsMessage += tools.getProf(this[key]["prof"]) + "| (" +String( Number(this[this[key]["mainStat"]]["modifier"]) + Number(this[key]["bonus"]) + Number(this[key]["prof"]) * Number(this["prof"].get()) )+")" ;
								skillsMessage += "\n";
								counter ++;

						}
						
				}
				skillsMessage += Array(messageHeader.length).join("-")  + "\n"
				return skillsMessage;
		},
		getBonusMessage: function(){


				var bonusMessage = "";
				var space = 28;
				var messageHeader = this["name"].get() + Array((space - this["name"].get().length) - String("Bonus").length).join(" ") + "Bonus" +  "\n";
				bonusMessage += messageHeader + Array(messageHeader.length).join("-")  + "\n";

				var counter = 0;
				var oldStat = "COM";

				for( key in this){
						if( this[key]["type"] == "combat"){
								
								if(counter < 3){
										bonusMessage += oldStat[counter].toUpperCase();
								}
								else{
										bonusMessage += " ";
								}
								bonusMessage += "| " + this[key]["name"] + Array(18 - this[key]["name"].length).join(" ") +  " |";
								bonusMessage +=  " (" +String( Number(this[key]["bonus"])  )+")" ;
								bonusMessage += "\n";
								counter ++;

						}
				}
				bonusMessage +=  Array(messageHeader.length).join("-")  + "\n";

				oldStat = "ATTR";
				counter = 0;
				
				for( key in this){
						if( this[key]["type"] == "stat"){
								
								if(counter < 4){
										bonusMessage += oldStat[counter].toUpperCase();
								}
								else{
										bonusMessage += " ";
								}
								bonusMessage += "| " + this[key]["name"] + Array(18 - this[key]["name"].length).join(" ") +  " |";
								bonusMessage +=  " (" +String( Number(this[key]["bonus"])  )+")" ;
								bonusMessage += "\n";
								counter ++;

						}
				}
				bonusMessage +=  Array(messageHeader.length).join("-")  + "\n";
				
				
				oldStat = "str";
				counter = 0;
				for( key in this){
						if( this[key]["type"] == "skill"){
								if( this[key]["mainStat"] != oldStat){
										if( counter <= 3){
												for( i = counter; i < oldStat.length; i++){
														bonusMessage += oldStat[i].toUpperCase() + "|                   | " + "\n";;
												}
										}
										bonusMessage += Array(messageHeader.length).join("-")  + "\n"
										oldStat = this[key]["mainStat"];
										counter = 0;
								}
								
								if(counter < 3){
										bonusMessage += this[key]["mainStat"][counter].toUpperCase();
								}
								else{
										bonusMessage += " ";
								}
								bonusMessage += "| " + this[key]["name"] + Array(18 - this[key]["name"].length).join(" ") +  " |";
								bonusMessage += " (" +String( Number(this[key]["bonus"])  )+")" ;
								bonusMessage += "\n";
								counter ++;

						}
						
				}
				bonusMessage += Array(messageHeader.length).join("-")  + "\n"
				return bonusMessage;
		},

		getNotesMessage: function(){
				var notesMessage = "";
				var notesBuff = this["notes"].get();
				var notesMax = 0;
				var space = 4;
				var spaceArr = Array(space).join(" ");
				var discordMax = config.discordWidth;
				var notesArr = [];
				if(notesBuff.length >0){
						for(j = 0; j < notesBuff.length;j++){
								var noteLength = notesBuff[j].length;
								noteLength += String(j+1).length + 2 + space;
								if(noteLength > notesMax){
										notesMax = noteLength;
								}
								var arrBuff = notesBuff[j].split("\n");
								var k = 0;
								while( k < arrBuff.length) {
										if( (arrBuff[k].length + String(j+1).length + 2 + space) >= discordMax) {
												var maxIndex = discordMax - (String(j+1).length + 2 + space);
												var buffString = "";
												var newIndex = tools.findSpace(arrBuff[k],maxIndex);
												// 	if(newIndex == maxIndex || newIndex < maxIndex - 15){ 
												// 					buffString = arrBuff[k].slice(maxIndex);
												// 					arrBuff[k] = arrBuff[k].replace(buffString,"-");
												// 					buffString = "-" + buffString;
												// 			}
												// //	
												//	else{
												buffString = arrBuff[k].slice(newIndex);
												arrBuff[k] = arrBuff[k].replace(buffString, "");
												//		}
												if( k < arrBuff.length - 1){
														arrBuff[k+1] = buffString + " " + arrBuff[k+1];
												}
												else{
														arrBuff.push(buffString);
												}
												
												

										}
										k++;
								}
								notesArr.push(arrBuff);
								if(noteLength > discordMax){
										
										
								}
								
								//								notesMessage += "(" + String(Number(j + 1)) + ")   " + notesBuff[j] + "\n\n";
						}
						notesMax = Math.min(notesMax,discordMax);
						
						notesMessage += this["name"].get() + Array(Math.floor(notesMax/2 - 4)).join(" ") + "Notes\n";
						notesMessage += Array(notesMax).join("-") + "\n";
						for(j = 0; j < notesArr.length;j++){
								notesMessage += "(" +  String(Number(j + 1)) + ")";
								var frontSpace = Array(String("(" +  String(Number(j + 1)) + ")").length).join(" ");
								for(k=0; k < notesArr[j].length;k++){
										if(k == 0){
												notesMessage += spaceArr + notesArr[j][k] + "\n";
										}
										else{
												notesMessage += frontSpace + spaceArr + notesArr[j][k] + "\n";
										}
								}
								notesMessage += "\n";
								//notesMessage += "(" + String(Number(j + 1)) + ")" + Array(space).join(" ") +  notesBuff[j] + "\n\n";
						}
						
				}
				else{
						notesMessage = this["name"].get() + " has no notes saved.\n";
				}

				return notesMessage;

		},

		parseNotes: function(){
				for( key in this){
						if( "bonus" in this[key]){
								this[key]["bonus"] = 0;
						}
				}

				
				var notes = this["notes"].get();
				if(notes.length == 0){
						console.log("No Notes!");
						return;
				}
				for(k=0; k < notes.length; k++){
						note = notes[k].trim().split(/ +/g).join("");
						var buffString = tools.parseStringForStat(String(notes[k]));
						var buffArr = tools.parseSum(String(note));
						var buffSum = buffArr[0];
						var buffAdd = 0;
						if( buffString in this){
								this[buffString]["bonus"] = this[buffString]["bonus"] + Number(buffSum); 
						}
				}
				
				this.setMods();

		},


		getInvMessage: function(){
				var invMessage = "";
				var invBuff = this["inventory"].get();
				var invMax = 0;
				var space = 4;
				var spaceArr = Array(space).join(" ");
				var discordMax = config.discordWidth;
				var invArr = [];
				if(invBuff.length >0){
						for(j = 0; j < invBuff.length;j++){
								var noteLength = invBuff[j].length;
								noteLength += String(j+1).length + 2 + space;
								if(noteLength > invMax){
										invMax = noteLength;
								}
								var arrBuff = invBuff[j].split("\n");
								var k = 0;
								while( k < arrBuff.length) {
										if( (arrBuff[k].length + String(j+1).length + 2 + space) >= discordMax) {
												var maxIndex = discordMax - (String(j+1).length + 2 + space);
												var buffString = "";
												var newIndex = tools.findSpace(arrBuff[k],maxIndex);
												// 	if(newIndex == maxIndex || newIndex < maxIndex - 15){ 
												// 					buffString = arrBuff[k].slice(maxIndex);
												// 					arrBuff[k] = arrBuff[k].replace(buffString,"-");
												// 					buffString = "-" + buffString;
												// 			}
												// //	
												//	else{
												buffString = arrBuff[k].slice(newIndex);
												arrBuff[k] = arrBuff[k].replace(buffString, "");
												//		}
												if( k < arrBuff.length - 1){
														arrBuff[k+1] = buffString + " " + arrBuff[k+1];
												}
												else{
														arrBuff.push(buffString);
												}
												
												

										}
										k++;
								}
								invArr.push(arrBuff);
								if(noteLength > discordMax){
										
										
								}
								
								//								notesMessage += "(" + String(Number(j + 1)) + ")   " + notesBuff[j] + "\n\n";
						}
						invMax = Math.min(invMax,discordMax);
						
						invMessage += this["name"].get() + Array(Math.floor(invMax/2 - 4)).join(" ") + "Inventory\n";
						var headerLength = invMessage.length;

						if(headerLength > invMax){
								if(headerLength > discordMax){
										//nothing
								}
								else{
										invMax = headerLength;
								}
						}
						invMessage += Array(invMax).join("-") + "\n";
						for(j = 0; j < invArr.length;j++){
								invMessage += "(" +  String(Number(j + 1)) + ")";
								var frontSpace = Array(String("(" +  String(Number(j + 1)) + ")").length).join(" ");
								for(k=0; k < invArr[j].length;k++){
										if(k == 0){
												invMessage += spaceArr + invArr[j][k] + "\n";
										}
										else{
												invMessage += frontSpace + spaceArr + invArr[j][k] + "\n";
										}
								}
								invMessage += "\n";
								//invMessage += "(" + String(Number(j + 1)) + ")" + Array(space).join(" ") +  invBuff[j] + "\n\n";
						}
						
				}
				else{
						invMessage = this["name"].get() + " has no items saved.\n";
				}

				return invMessage;

		},


		
		setMods: function(){
				for( key in this){
						if(this[key]["type"] == "stat"){
								this[key]["modifier"] = String(Number(Math.floor( (Number(this[key].get()) + Number(this[key]["bonus"]) - 10)/2)));
						}
				}

				this["init"].set(String(Number(this["dex"]["modifier"]) + Number(this["init"]["bonus"])));
				
				this["prof"].set(String(Math.floor(( Number(this["level"].get()) + 7)/4) + Number(this["prof"]["bonus"])));
				
				
				
		}

};


module.exports = Player;









