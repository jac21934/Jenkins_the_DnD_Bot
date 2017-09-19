
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
var fs = require('fs');

var goldFile = require("./inventory/gold.json");
var Player = require('./player.js');
const config = require("./config.json");


const client = new Discord.Client();
var players = []; 
var gold = goldFile.gold;
var restrictPlay = false;
 
var voiceChannel = null; 
var dispatcher = null;
const broadcast = client.createVoiceBroadcast();


function set(id, args){

		var message = "```";

		if(args.length > 1){
				if (args[0] == "gold"){
						gold = args[1];
						message += "Setting gold to " + Number(gold).toFixed(2) + "gp.";
				}
				else{
						for(i=0; i< players.length;i++){
								if (id == players[i].getId()){
										
										switch(String(args[0]).toLowerCase()){
										case "name":
												var name = args.shift();
												name = name.join(" ");
												players[i].setName(name);
												message += "Setting name to " + name + ".\n";
												break;
										case "level":
												players[i].setLevel(args[1]);
												message += "Setting level to " + args[1] + ".\n";
												break;
										case "class":
												players[i].setClass(args[1]);
												message += "Setting class to " + args[1] + ".\n";
												break;
										case "str":
												players[i].setStr(args[1]);
												message += "Setting STR to " + args[1] + ".\n";
												break;
										case "dex":
												players[i].setDex(args[1]);
												message += "Setting DEX to " + args[1] + ".\n";
												break;
										case "con":
												players[i].setCon(args[1]);
												message += "Setting CON to " + args[1] + ".\n";
												break;
										case "int":
												players[i].setInt(args[1]);
												message += "Setting INT to " + args[1] + ".\n";
												break;
										case "wis":
												players[i].setWis(args[1]);
												message += "Setting WIS to " + args[1] + ".\n";
												break;
										case "cha":
												players[i].setCha(args[1]);
												message += "Setting CHA to " + args[1] + ".\n";
												break;
										case "ac":
												players[i].setAc(args[1]);
												message += "Setting AC to " + args[1] + ".\n";
												break;
										case "init":
												players[i].setInit(args[1]);
												message += "Setting INIT to " + args[1] + ".\n";
												break;
										case "spd":
												players[i].setSpd(args[1]);
												message += "Setting SPD to " + args[1] + ".\n";
												break;
										case "hp":
												players[i].setHp(args[1]);
												message += "Setting HP to " + args[1] + ".\n";
												break;
										default:
												message += "Invalid argument " + args[0] + ".\n"
												break;
										}
										break;
								}
						}
				}
		}

		else{
				message += "Please give me something to set and its values.\n"
		}
		message +="```";
		return message;
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

function parseNumberFromString(Index,someString){
	var periodCheck = false;	
	buffVal = "";
	var numFlag = true;
	var initIndex = Index;
	while(numFlag){
		if( String(Number(someString[Index])) == someString[Index] 
		|| ((someString[Index] == '.') && periodCheck == false) ){
			if(String(someString[Index]) == '.'){
				periodCheck = true;
				if(buffVal.length == 0){
					buffVal += "0";
				}
			}
			buffVal += String(someString[Index]);
		}
		else{
			numFlag = false;
			Index -=1;
		}
		if(Index == someString.length -1 ){
			numFlag = false;
			Index -=1;
		}
		Index += 1;

	}

	return Number(buffVal)
}

function parseSum(someString){

		var checkFlag = true;
		var sumFlag = false;
		var minusFlag = false;
		var Index  = 0;
		var totVal = 0;
		var bufVal = "";
		while(checkFlag){
				Index = someString.indexOf("+");
				if( Index != -1 && Index != (someString.length -1)){
					sumFlag = true;
					someString = someString.replace('+','');
					var buffArray = parseNumberFromString(Index,someString);
					someString = someString.replace(buffArray,'');
					totVal += Number(buffVal);
				}
				else{
					sumFlag = false;
				}
				periodCheck = false;

				Index = someString.indexOf("-");
				if( Index != -1 && Index != (someString.length -1)){
					minusFlag = true;
					someString = someString.replace('-','');
					var buffArray = parseNumberFromString(Index,someString);
					someString = someString.replace(buffArray,'');
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

function save(callback){
		var json = "";
		for(i=0; i < players.length; i++){
				json = JSON.stringify(players[i]);
				var name = players[i].getName().split(" ");
				name = name.join("_");

				fs.writeFile("./players/" + name + ".json", json, function(err) {
						if(err) {
								return console.log(err);
	    			}
				});
		}

		var goldString = '{"gold" : ' + gold + '}';	
		fs.writeFile("./inventory/gold.json", goldString, function(err) {
		    if(err) {
						return console.log(err);
	    	}	
		});
		
		if(callback){callback();}

}


function getStatsMessage(index){


		//	var perProf = players[index].getPerception();
		//	var perModifier = String(10 + players[index].getWismod() + players[index].getProfbonus()*players[index].getPerception());


		var statsMessage = "```";
		var space = 4;
		var headerLength = String(players[index].getName()).length + String("Level ").length + String(players[index].getLevel()).length + String(players[index].getClass()).length;


		var defHeader = "AC = " + players[index].getAc() + "   |   INIT = " + players[index].getInit() + "   |   SPD = " + players[index].getSpd() + "   |   PER = " + players[index].getPer() + "   |   HP = " + players[index].getHp() + "\n";

		if(defHeader.length > headerLength){
				space = Math.ceil((defHeader.length - headerLength)/2) +1;
		}



		var messageHeader = players[index].getName() + Array(space).join(" ") + "Level " + players[index].getLevel() + Array(space).join(" ") + players[index].getClass() + "\n";

		fillerLength = Math.max(messageHeader.length, defHeader.length);

		var messagefiller = Array(fillerLength).join("-") + "\n";
		var deffiller = Array(defHeader.length).join("-") + "\n";
		
		statsMessage += messageHeader + messagefiller + defHeader + messagefiller;
		statsMessage += "STR = " + players[index].getStr() + " (" + String(players[i].getStrmod()) + ")\n";
		statsMessage += "DEX = " + players[index].getDex() + " (" + String(players[i].getDexmod()) + ")\n";
		statsMessage += "CON = " + players[index].getCon() + " (" + String(players[i].getConmod()) + ")\n";
		statsMessage += "INT = " + players[index].getInt() + " (" + String(players[i].getIntmod()) + ")\n";
		statsMessage += "WIS = " + players[index].getWis() + " (" + String(players[i].getWismod()) + ")\n";
		statsMessage += "CHA = " + players[index].getCha() + " (" + String(players[i].getChamod()) + ")\n";


		var profMessage = "Proficiency Bonus = " + players[index].getProfbonus() + "\n";

		var filler = Array(profMessage.length).join("-") + "\n";

		statsMessage += filler + profMessage;

		statsMessage +="```";
		return statsMessage;

}

function getProf(prof){
		var profChar = " ";
		if(Number(prof) == 1){
				profChar = "*";
		}
		else{
				profChar = " ";
		}
		return profChar;
}


function getSkillsMessage(index){

		var skillsMessage = "```";
		var space = 30;
		var messageHeader = players[index].getName() + Array(space - players[index].getName().length).join(" ") +  "\n";
		skillsMessage += messageHeader + Array(messageHeader.length).join("-")  + "\n";

		skillsMessage += "S| STR Saving Throw  |" + getProf(players[index].getStrsavprof()) + "| (" + String(Number(players[index].getStrmod() + players[index].getProfbonus()*players[index].getStrsavprof())) + ")" +  "\n"; 
		skillsMessage += "T| Athletics         |" + getProf(players[index].getAthprof()) + "| (" + String(Number(players[index].getStrmod() +  players[index].getProfbonus()*players[index].getAthprof())) + ")" + "\n"; 	
		skillsMessage += "R|                   | |" + "\n"; 
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//dex

		skillsMessage += "D| DEX Saving Throw  |" + getProf(players[index].getDexsavprof()) + "| (" + String(Number(players[index].getDexmod() +  players[index].getProfbonus()*players[index].getDexsavprof())) + ")" + "\n"; 
		skillsMessage += "E| Acrobatics        |" + getProf(players[index].getAcroprof()) + "| (" + String(Number(players[index].getDexmod() +  players[index].getProfbonus()*players[index].getAcroprof())) + ")" + "\n"; 	
		skillsMessage += "X| Sleight of Hand   |" + getProf(players[index].getSleightprof()) + "| (" + String(Number(players[index].getDexmod() +  players[index].getProfbonus()*players[index].getSleightprof())) + ")" + "\n"; 
		skillsMessage += " | Stealth           |" + getProf(players[index].getStealthprof()) + "| (" + String(Number(players[index].getDexmod() +  players[index].getProfbonus()*players[index].getStealthprof())) + ")" +"\n"; 
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//con
		skillsMessage += "C| CON Saving Throw  |" + getProf(players[index].getConsavprof()) + "| (" + String(Number(players[index].getConmod() +  players[index].getProfbonus()*players[index].getConsavprof())) + ")" + "\n"; 
		skillsMessage += "O|                   | |" + "\n"; 	
		skillsMessage += "N|                   | |" + "\n"; 
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//int
		skillsMessage += "I| INT Saving Throw  |" + getProf(players[index].getIntsavprof()) + "| (" + String(Number(players[index].getIntmod() +  players[index].getProfbonus()*players[index].getIntsavprof())) + ")" + "\n"; 
		skillsMessage += "N| Arcana            |" + getProf(players[index].getArcanaprof()) + "| (" + String(Number(players[index].getIntmod() +  players[index].getProfbonus()*players[index].getArcanaprof())) + ")" + "\n"; 	
		skillsMessage += "T| History           |" + getProf(players[index].getHistoryprof()) + "| (" + String(Number(players[index].getIntmod() +  players[index].getProfbonus()*players[index].getHistoryprof())) + ")" + "\n"; 
		skillsMessage += " | Investigation     |" + getProf(players[index].getInvestprof()) + "| (" + String(Number(players[index].getIntmod() +  players[index].getProfbonus()*players[index].getInvestprof())) + ")" + "\n"; 
		skillsMessage += " | Nature            |" + getProf(players[index].getNatureprof()) + "| (" + String(Number(players[index].getIntmod() +  players[index].getProfbonus()*players[index].getNatureprof())) + ")" + "\n"; 
		skillsMessage += " | Religion          |" + getProf(players[index].getReligionprof()) + "| (" + String(Number(players[index].getIntmod() +  players[index].getProfbonus()*players[index].getReligionprof())) + ")" + "\n"; 		
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//wis
		skillsMessage += "W| WIS Saving Throw  |" + getProf(players[index].getWissavprof()) + "| (" + String(Number(players[index].getWismod() +  players[index].getProfbonus()*players[index].getWissavprof())) + ")"+ "\n"; 
		skillsMessage += "I| Animal Handling   |" + getProf(players[index].getAnimalprof()) + "| (" + String(Number(players[index].getWismod() +  players[index].getProfbonus()*players[index].getAnimalprof())) + ")"+ "\n"; 	
		skillsMessage += "S| Insight           |" + getProf(players[index].getInsightprof()) + "| (" + String(Number(players[index].getWismod() +  players[index].getProfbonus()*players[index].getInsightprof())) + ")"+ "\n"; 
		skillsMessage += " | Medicine          |" + getProf(players[index].getMedicineprof()) + "| (" + String(Number(players[index].getWismod() +  players[index].getProfbonus()*players[index].getMedicineprof())) + ")"+ "\n"; 
		skillsMessage += " | Perception        |" + getProf(players[index].getPerprof()) + "| (" + String(Number(players[index].getWismod() +  players[index].getProfbonus()*players[index].getPerprof())) + ")"+ "\n"; 	
		skillsMessage += " | Survival          |" + getProf(players[index].getSurvprof()) + "| (" + String(Number(players[index].getWismod() +  players[index].getProfbonus()*players[index].getSurvprof())) + ")"+ "\n"; 	
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//cha
		skillsMessage += "C| CHA Saving Throw  |" + getProf(players[index].getChasavprof()) + "| (" + String(Number(players[index].getChamod() +  players[index].getProfbonus()*players[index].getChasavprof())) + ")"+ "\n"; 
		skillsMessage += "H| Deception         |" + getProf(players[index].getDeceptprof()) + "| (" + String(Number(players[index].getChamod() +  players[index].getProfbonus()*players[index].getDeceptprof())) + ")"+  "\n"; 	
		skillsMessage += "A| Intimidation      |" + getProf(players[index].getIntimprof()) + "| (" + String(Number(players[index].getChamod() +  players[index].getProfbonus()*players[index].getIntimprof())) + ")"+  "\n"; 
		skillsMessage += " | Performance       |" + getProf(players[index].getPerformprof()) + "| (" + String(Number(players[index].getChamod() +  players[index].getProfbonus()*players[index].getPerformprof())) + ")"+  "\n"; 
		skillsMessage += " | Persuasion        |" + getProf(players[index].getPersprof()) + "| (" + String(Number(players[index].getChamod() +  players[index].getProfbonus()*players[index].getPersprof())) + ")"+  "\n"; 	
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"

		skillsMessage += "```";
		return skillsMessage;
}

function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max + 1);
		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function PlayStream(streamUrl) {

    const streamOptions = {seek: 0, volume: 1};
    console.log("Streaming audio from " + streamUrl);

    if (streamUrl) {
        const stream = ytdl(streamUrl, {filter: 'audioonly'});
        const dispatcher = bot.voiceConnections.first().playStream(stream, streamOptions);
    }
}



client.on("ready", () => {

		voiceChannel = client.channels.find('name', 'The Game');
		voiceChannel.join().then(connection => console.log(`Connected to ${voiceChannel.name}`)).catch(console.error);
		
		// This event will run if the bot starts, and logs in, successfully.
		console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
		// Example of changing the bot's playing game to something useful. `client.user` is what the
		// docs refer to as the "ClientUser".

		client.user.setGame(`on ${client.guilds.size} servers`);

		const dirname = './players/';
		
		fs.readdirSync(dirname).forEach(file => {
				json = fs.readFileSync(dirname+file, "utf8");
				player = JSON.parse(json);
				player.__proto__ = Player.prototype;
				player.setMods();
				players.push(player);
		})





});


client.on("message", async message => {
		// This event will run on every single message received, from any channel or DM.
		
		// It's good practice to ignore other bots. This also makes your bot ignore itself
		// and not get into a spam loop (we call that "botception").
		if(message.author.bot) return;
		
		// Also good practice to ignore any message that does not start with our prefix, 
		// which is set in the configuration file.
		if(message.content.indexOf(config.prefix) !== 0) return;
		
		// Here we separate our "command" name, and our "arguments" for the command. 
		// e.g. if we have the message "\say Is this the real life?" , we'll get the following:
		// command = say
		// args = ["Is", "this", "the", "real", "life?"]
		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		
		if(command == "test"){
			var someString = args.join("");	

			var testMessage = "```";
			var sum = getDice(someString);
			testMessage += sum + "\n";
			testMessage += "```";
			message.channel.send(testMessage);

		}


		if(command == "close"){
				
				if(message.member.hasPermission("ADMINISTRATOR")){

						//save(() => process.exit() );
	 					process.exit();

				}
				else{
						message.channel.send("```You're not my boss!\n```");
				}

		}


		else if(command == "save"){

				save();

				message.channel.send("```Saving Profiles.\n```");
		}

		else if(command == "map"){

				mapMessage = "```A Map of Faerun\n```"
				message.channel.send(mapMessage, {
						file: "./Faerun_map.jpg" 
				});
		}

		else if(command === "ping") {
				const m = await message.channel.send("Ping?");
				m.edit("```Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms```");
		}
		
		else if(command === "say") {
				// makes the bot say something and delete the message. As an example, it's open to anyone to use. 
				// To get the "message" itself we join the `args` back into a string with spaces: 
				var id = 0;
				if (message.channel.type == "dm"){
						id = message.channel.recipient.id;

				}

				else{
						id = message.member.id;
				}
			

				var sayMessage = "```";
				sayMessage +=  args.join(" ") + "\n";
				// Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
				message.delete().catch(O_o=>{}); 
				// And we get the bot to say the thing: 
	
				var mickel = ["poop", "eldritch ", "vibrant ", "breezy ", "silky ", "bountiful ", "literally on fire "];
				var mickelparts = ["face", "butt", "foot","head", "buttocks","buttock", "nostril","growth", "skeleton", "aqueous humor", '"breasts"'];
 

				if(id == 152235945368879105){

					sayMessage += "\nP.S.: Mickel has a " + String(mickel[getRandomInt(0, mickel.length - 1)]) + String(mickelparts[getRandomInt(0, mickelparts.length-1)]) +".\n";
				}
				sayMessage += "```";
				message.channel.send(sayMessage);
		}

		else if (command == "set"){
				var setMessage= "";
				var id = 0;
				if (message.channel.type == "dm"){
						id = message.channel.recipient.id;

				}

				else{
						id = message.member.id;
				}

				setMessage = set(id, args);
				message.channel.send(setMessage);

		}

		else if(command == "stats"){

				
				var id = 0;
				if (message.channel.type == "dm"){
						id = message.channel.recipient.id;

				}

				else{
						id = message.member.id;
				}
				if( args.length > 0){
						for(i=0; i< players.length;i++){


								playerName = players[i].getName().toLowerCase();

								if( playerName.indexOf(" ") > -1){
										if( playerName.slice(0, playerName.indexOf(" ")) == args[0].toLowerCase()){
												var statsMessage = getStatsMessage(i);
												message.channel.send(statsMessage);
												break;
										}
								}
								
								name = String(args.join(" ")).toLowerCase();
								if (name == players[i].getName().toLowerCase()){
										var statsMessage = getStatsMessage(i);
										message.channel.send(statsMessage);
										break;
								}
						}
						
				}

				else{
						for(i=0; i< players.length;i++){
								if (id == players[i].getId()){
										var statsMessage = getStatsMessage(i);
										message.channel.send(statsMessage);
										break;
								}
						}
				}
				

		}

		else if(command == "skills"){

				
				var id = 0;
				if (message.channel.type == "dm"){
						id = message.channel.recipient.id;

				}

				else{
						id = message.member.id;
				}
				if( args.length > 0){
						for(i=0; i< players.length;i++){


								playerName = players[i].getName().toLowerCase();

								if( playerName.indexOf(" ") > -1){
										if( playerName.slice(0, playerName.indexOf(" ")) == args[0].toLowerCase()){
												var skillsMessage = getSkillsMessage(i);
												message.channel.send(skillsMessage);
												break;
										}
								}
								
								name = String(args.join(" ")).toLowerCase();
								if (name == players[i].getName().toLowerCase()){
										var skillsMessage = getSkillsMessage(i);
										message.channel.send(skillsMessage);
										break;
								}
						}
						
				}

				else{
						for(i=0; i< players.length;i++){
								if (id == players[i].getId()){
										var skillsMessage = getSkillsMessage(i);
										message.channel.send(skillsMessage);
										break;
								}
						}
				}
				

		}


  	else if(command === "roll") {
				
				var sumFlag = false;

				////////////////////////////////// Parsing input
				var totArgs = args.join("").toLowerCase();
				
				if( totArgs.indexOf("sum") != -1){
					sumFlag = true;
					totArgs = totArgs.replace("sum","");
				}

				var numDie = 0;
				var maxDie = 0;
				var modChar = "";
				var buff= parseSum(totArgs);
				var modifier = buff[0];
				totArgs = buff[1];
				if( modifier > 0){
					modchar = "+";
				}
				else if(modifier < 0){
					modchar = "-";
				}
				buff = getDice(totArgs);

				numDie = buff[0];
				maxDie = buff[1];


				var rollMessage = "```";


				if(numDie > 100){
						rollMessage += "Please roll one hundred or less dice.\n";
				}
				else if(maxDie == 0){
					rollMessage += "I didn't understand that input. I can take values like 3d6 + 2 or 12d13 - 21.\n";
				}
				else if(numDie == 0){
					rollMessage += "Ok rolling zero dice...\n";
				}
				else{
					rollMessage += "Rolling " + numDie + "d"+ maxDie;
					if (modifier != "" || modifier != 0){
							if (modChar == "-"){
									rollMessage += modifier;
							}
								else if (modChar == "+"){
									rollMessage += modChar + modifier;
							}
					}
					
					rollMessage += "\n";
						var filler = Array(rollMessage.length - 3).join("-") + "\n";
					if(sumFlag == false){
							rollMessage += filler;
					}
					var rollSum = 0;
					for( i = 0; i < numDie; i++){
							var dieRoll = getRandomInt(1,maxDie);
								if (sumFlag == false){
									rollMessage += dieRoll;
										if(maxDie == 20){
											if( dieRoll == 20){
													rollMessage += " *Crit*";
											}
											else if(dieRoll == 1){
													rollMessage += " *Crit Fail*";
											}
									}
									rollMessage += "\n";
							}
							rollSum += dieRoll;
					}
					var sumMessage = "";
					var modMessage = "";
					var totMessage = "";
					var maxFill = 0;
					if(numDie > 1){
						sumMessage += "Sum: " + rollSum + "\n";
					}
					if(modifier != ""){
						modMessage += "Modifier: " + modifier + "\n";	
						var totalSum = rollSum+modifier;
						totMessage += "Total Sum: " + totalSum + "\n";	
					}
					if( numDie>1 || modifier !=""){
						if(sumFlag == true){
							maxFill = Math.max(String(sumMessage).length, String(modMessage).length, String(totMessage).length, String(filler).length);
						}
						else{
							maxFill = Math.max(String(sumMessage).length, String(modMessage).length, String(totMessage).length);
						}
						filler = Array(maxFill).join("-") + "\n";
						rollMessage +=filler;
						if(numDie > 1){
								rollMessage += sumMessage;
						}
						if(modifier != ""){
							rollMessage += modMessage;
							rollMessage += totMessage;
						}

					}
			}

		rollMessage += "```";

		message.channel.send(rollMessage);


		}


		else if(command === "gold") {
				var goldMessage = "```";
				totArgs = args.join("");
				if (totArgs.length < 1){}
				else {
					var goldBuff = parseSum(totArgs)[0];
					gold += goldBuff;
					if(goldBuff >= 0){
						goldMessage += "Adding " + goldBuff + "gp\n";
					} 
					else if(goldBuff < 0){
						goldMessage += "Removing " + goldBuff + "gp\n";
					}
				}
				

				goldMessage += "Total gold: " + Number(gold).toFixed(2) + "gp\n```";
				message.channel.send(goldMessage);
				
		}


		else if(command === "help") {

				var helpMessage = "```help       --      Shows this text\n\n"
						+ "roll       --      Give a number of die with modifier(s) to roll and show result (1d4 + 10 - 5 or 5d17 - 5).\n"
						+ "                   Put sum at the end if you don't want to see the individual rolls.\n\n"
						+ "gold       --      Shows the party's gold. Can be added and subtracted from ( +100 - 50 +...).\n\n"
						+ "stats      --      Shows your charaster's stats and modifiers. You can also give me the first name\n"
						+ "                   of someone to see their stats\n\n"
						+ "skills     --      Shows your character's skills, proficiencies and modifiers.\n\n"
						+ "defs       --      A list of everyone's defensive and combat related stats.\n\n"
						+ "map        --      Shows a map of Faerun.\n\n"
						+ "players    --      Lists all players names, levels, and classes.\n\n"
						+ "set        --      Give the name of something and the value to change it to (gold 100 or STR 18).\n\n"
						+ "play       --      Give end of youtube address (everything after watch?v=) to play audio.\n\n"
						+ "stop       --      Stops audio.\n\n"
						+ "pause      --      Pauses audio.\n\n"
						+ "resume     --      Resumes audio.\n\n"
						+ "save       --      Saves all profiles and current gold.\n\n"
						+ "close      --      Shuts me down. Needs admin privileges.\n";		
				
				
				
				helpMessage += "```";
				message.channel.send(helpMessage);
				
		}


		else if(command == "play"){

				if( (restrictPlay == false) || message.member.hasPermission("ADMINISTRATOR")){
						if( args.length >= 1){
								const streamOptions = {seek: 0, volume: 1};
								var video_id = args[0];
								
								var playMessage = "```Playing " + args[0] + "\n```";
								message.channel.send(playMessage);
								var stream = ytdl("https://www.youtube.com/watch?v=" + video_id, {filter: 'audioonly'});
								console.log("Streaming audio from https://www.youtube.com/watch?v=" + video_id );	
								dispatcher = client.voiceConnections.first().playStream(stream, streamOptions);
   		 					
						}
				}
		}


		else  if(command == "stop"){
				if( (restrictPlay == false) || message.member.hasPermission("ADMINISTRATOR")){
 						dispatcher.end();
				}
		}

		else if(command == "pause"){
				if( (restrictPlay == false) || message.member.hasPermission("ADMINISTRATOR")){
 						dispatcher.pause();
				}
		}

		else if(command == "resume"){
				if( (restrictPlay == false) || message.member.hasPermission("ADMINISTRATOR")){
 						dispatcher.resume();
				}
		}

		else if(command == "restrict"){
				if( message.member.hasPermission("ADMINISTRATOR")){
						var restrictMessage = "Setting music restrictions from " + restrictPlay + " to ";
 						restrictPlay = !restrictPlay;
						restrictMessage += restrictPlay + "\n"; 
						message.channel.send(restrictMessage);
				}


		}

		else if(command == "players"){

				var playersMessage= "```";

				var buffMessage = "";
				var regionSize = 25;
				var maxSize = 0;

				var playersHeader = "Name" + Array(regionSize - String("Name").length).join(" ") + "Level" + Array(regionSize - String("Level").length).join(" ") + "Class" + "\n"; 

				for(i = 0; i < players.length; i++){
						if(players[i].getClass() != "Dungeon Master"){
								buffMessage += players[i].getName() + Array(regionSize - String(players[i].getName()).length).join(" ") + "Level " + players[i].getLevel() + Array(regionSize - String("Level " + players[i].getLevel()).length).join(" ") + players[i].getClass() + "\n"; 

								if(players[i].getClass().length > maxSize){
										maxSize = players[i].getClass().length;
								}
								

						}	
				}

				playersMessage += playersHeader + Array(2*regionSize + maxSize -1).join("-") + "\n" + buffMessage;
				
				playersMessage += "```";
				message.channel.send(playersMessage);
				
				

		}

		else if(command == "defs"){

				var defsMessage= "```";

				var buffMessage = "";
				var regionSize = 10;
				var nameregionSize =30;
				var maxSize = 0;

				var defsHeader = "Name" + Array(nameregionSize - String("Name").length).join(" ") + "AC" + Array(regionSize - String("AC").length).join(" ") + "INIT" + Array(regionSize - String("INIT").length).join(" ") + "SPD" + Array(regionSize - String("SPD").length).join(" ")  + "PER" + Array(regionSize - String("PER").length).join(" ")  +  "HP" + "\n"; 

				for(i = 0; i < players.length; i++){

						if(players[i].getClass() != "Dungeon Master"){
								buffMessage += players[i].getName() + Array(nameregionSize - String(players[i].getName()).length).join(" ")  + players[i].getAc() + Array(regionSize - String(players[i].getAc()).length).join(" ") + players[i].getInit() + Array(regionSize - String(players[i].getInit()).length).join(" ") + players[i].getSpd() + Array(regionSize - String(players[i].getSpd()).length).join(" ") + players[i].getPer() + Array(regionSize - String(players[i].getPer()).length).join(" ") + players[i].getHp() + "\n"; 

								if(String(players[i].getSpd()).length > maxSize){
										maxSize = String(players[i].getSpd()).length;

								}
								
						}	
				}

				maxSize = Math.max(defsHeader.length, 2*regionSize + nameregionSize + maxSize);

				defsMessage += defsHeader + Array(maxSize).join("-") + "\n" + buffMessage;
				
				defsMessage += "```";
				message.channel.send(defsMessage);
				
				

		}
});


client.login(config.token);
