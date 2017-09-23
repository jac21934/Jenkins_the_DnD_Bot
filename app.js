const Discord = require("discord.js");
const ytdl = require("ytdl-core");
var fs = require('fs');

var goldFile = require("./inventory/gold.json");
var Player = require('./player.js');
const config = require("./config.json");
var tools = require("./tools.js"); 


const client = new Discord.Client();
var players = []; 
var gold = goldFile.gold;
var restrictPlay = "any";

var voiceChannel = null; 
var dispatcher = null;
const broadcast = client.createVoiceBroadcast();

function addAditionalModifier(id, args){



}


function set(id, args){

		var message = "";

		if(args.length > 1){
				if (args[0] == "gold"){
						gold = Number(args[1]).toFixed(2);
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
										players[i].setMods();
										break;
								}
						}
				}
		}

		else{
				message += "Please give me something to set and its values.\n"
		}

		return message;
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
function messageSend(message, text,messagefile = ""){
		var textToSend = "```" + text + "\n```";
		if(messagefile != ""){
				message.channel.send(textToSend, {
						file: messagefile
				});
		}
		else{
				message.channel.send(textToSend);

		}
}

var commands = {
    "ping": {
				permissions: "any",
        description: "responds pong, useful for checking if bot is alive",
        process: function(client, message, args) {
            messageSend(message, message.author.username + " pong!");
            if(args.length >0){
								messageSend(message, "note that \ping takes no arguments!");
            }
        }
    },
		"test" : {
				permissions: "any",
				description: "A testbed function for adding new functionality to Jenkins. Use with caution.",
				process: function(client, message, args, id){
						if(args.length >0){
								var num = Number(args[0]);
								var testMessage = Array(num).join("-");
								messageSend(message,testMessage);
						}
				}
				
		},
		"close": {
				permissions: "administrator",
        description: "Turns me off. Needs admin permissions.",
        process: function(client, message, args, id=0) {
						messageSend(message,"Shutting down.");
						client.destroy().then(function(){
								process.exit(0);	
						});
				}
    },
		"reboot": {
				permissions: "any",
        description: "Reboots me.",
        process: function(client, message, args, id=0) {
						const { spawn } = require('child_process')
						messageSend(message,"Rebooting.");

						
						client.destroy().then(function(){
								const child = spawn('nodejs', ['app.js'], {
										detached: true,
										stdio: ['ignore']
								});
								
								child.unref();
								

								process.exit(0);	
						});
				}
    },
		"update": {
				permissions: "any",
        description: "Updates from get repo and reboots.",
        process: function(client, message, args, id=0) {
						const { spawn } = require('child_process');
						messageSend(message,"Updating from git repo.");

						
						client.destroy().then(function(){
								const child = spawn('nodejs', ['app.js'], {
										detached: true,
										stdio: ['ignore']
								});
								
								child.unref();
								

								process.exit(0);	
						});
				}
    },		
		"save": {
				permissions: "any",
        description: "Saves all player profiles and gold.",
        process: function(client, message, args,id=0) {

						save();

						messageSend(message,"Saving Profiles.\n");

				}
    },

		"map":{
				permissions: "any",
				description: "Shows a map of Faerun.",
				process: function(client, message, args, id=0){
						mapMessage = "A Map of Faerun\n";
						mapFile = "./Faerun_map.jpg";
						messageSend(message,mapMessage,mapFile);
				}
				

		},
		"say":{
				permisssions: "any",
				description: "Makes me say something.",
				process: function(client,message,args,id){


						var sayMessage =  args.join(" ");
						// Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
						message.delete().catch(O_o=>{}); 
						// And we get the bot to say the thing: 
						
						var mickel = ["poop", "eldritch ", "vibrant ", "breezy ", "silky ", "bountiful ", "literally on fire "];
						var mickelparts = ["face", "butt", "foot","head", "buttocks","buttock", "nostril","growth", "skeleton", "aqueous humor", '"breasts"'];
						
						
						if(id == 152235945368879105){
								
								sayMessage += "\nP.S.: Mickel has a " + String(mickel[tools.getRandomInt(0, mickel.length - 1)]) + String(mickelparts[tools.getRandomInt(0, mickelparts.length-1)]) +".\n";
						}

						//	sayMessage = "hello";
						messageSend(message,sayMessage);

				}
		},
		"set":{
				permissions: "any",
				description: "Sets stats or gold to a given value.",
				process: function(client,message,args,id){
						setMessage = set(id, args);
						messageSend(message,setMessage);
				}
		},
		"stats":{
				permissions: "any",
				description: "Shows character stats and modifiers.",
				process: function(client,message,args,id){
						
						if( args.length > 0){
								for(i=0; i< players.length;i++){
										playerName = players[i].getName().toLowerCase();
										
										if( playerName.indexOf(" ") > -1){
												if( playerName.slice(0, playerName.indexOf(" ")) == args[0].toLowerCase()){
														var statsMessage =players[i]. getStatsMessage();
														messageSend(message,statsMessage);
														break;
												}
										}
										
										name = String(args.join(" ")).toLowerCase();
										if (name == players[i].getName().toLowerCase()){
												var statsMessage = players[i].getStatsMessage();
												messageSend(message,statsMessage);
												break;
										}
								}
								
						}

						else{
								for(i=0; i< players.length;i++){
										if (id == players[i].getId()){
												var statsMessage = players[i].getStatsMessage();
												messageSend(message,statsMessage);
												break;
										}
								}
						}
				}						
		},
		"skills":{
				permissions: "any",
				description: "Shows your character's skills, proficiencies and modifiers. You can give me the first name of someone to see their notes",
				process: function(client,message,args,id){
						if( args.length > 0){
								for(i=0; i< players.length;i++){
										
										
										playerName = players[i].getName().toLowerCase();
										
										if( playerName.indexOf(" ") > -1){
												if( playerName.slice(0, playerName.indexOf(" ")) == args[0].toLowerCase()  ){
														var skillsMessage = players[i].getSkillsMessage();
														messageSend(message,skillsMessage);
														break;
												}
										}
										
										name = String(args.join(" ")).toLowerCase();
										if (name == players[i].getName().toLowerCase()){
												var skillsMessage = players[i].getSkillsMessage();
												messageSend(message,skillsMessage);
												break;
										}
								}
								
						}
						
						else{
								for(i=0; i< players.length;i++){
										if (id == players[i].getId()){
												var skillsMessage = players[i].getSkillsMessage();
												messageSend(message,skillsMessage);
												break;
										}
								}
						}
						
						
				}
		},
		"roll":{
				permissions: "any",
				description: "Give a number of die with modifier(s) to roll and show result, (1d4 + 10 - 5 or 5d17 - 5). Put sum at the end if you don't want to see the individual rolls.",
				process: function(client,message,args,id){
						
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
						
						var buff= tools.parseSum(totArgs);
						var modifier = Number(buff[0]);
						totArgs = buff[1];
						if( Number(modifier) > 0){
								modchar = "+";
						}
						else if(Number(modifier) < 0){
								modchar = "-";
						}
						buff = tools.getDice(totArgs);

						numDie = Number(buff[0]);
						maxDie = Number(buff[1]);


						var rollMessage = "";


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
								if (Number(modifier) != 0){
										if (modifier < 0){
												rollMessage += modifier;
										}
										else if (modifier >0){
												rollMessage += "+" + modifier;
										}
								}
								
								rollMessage += "\n";
								var filler = Array(rollMessage.length).join("-") + "\n";
								if(sumFlag == false){
										rollMessage += filler;
								}
								var rollSum = 0;
								for( i = 0; i < numDie; i++){
										var dieRoll = tools.getRandomInt(1,maxDie);
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


						messageSend(message,rollMessage);

						
						
				}
		},
		"gold":{
				permissions: "any",
				description: "Shows the party's gold. Can be added and subtracted from (i.e. +100 - 50 +...).",
				process: function(client,message,args,id){
						
						var goldMessage = "";
						totArgs = args.join("");
						if (totArgs.length < 1){}
						else {
								var goldBuff = Number(tools.parseSum(totArgs)[0]);
								gold = Number(Number(gold) +  Number(goldBuff));
								if(goldBuff >= 0){
										goldMessage += "Adding " + Number(goldBuff).toFixed(2) + "gp\n";
								} 
								else if(goldBuff < 0){
										goldMessage += "Removing " + Number(goldBuff).toFixed(2) + "gp\n";
								}
						}
						
						goldMessage += "Total gold: " + Number(gold).toFixed(2) + "gp\n";
						messageSend(message,goldMessage);
						
						
				}
				
				
		},
		
		"play":{
				permissions: restrictPlay,
				description: "Give end of youtube address (everything after watch?v=) to play audio.",
				process: function(client,message,args,id=0){
						if( args.length >= 1){
								const streamOptions = {seek: 0, volume: 1};
								var video_id = args[0];
								
								var playMessage = "Playing " + args[0] + "\n";
								message.channel.send(playMessage);
								var stream = ytdl("https://www.youtube.com/watch?v=" + video_id, {filter: 'audioonly'});
								//console.log("Streaming audio from https://www.youtube.com/watch?v=" + video_id );	
								dispatcher = client.voiceConnections.first().playStream(stream, streamOptions);
   		 					
						}
				}
		},
		"stop":{
				permissions: restrictPlay,
				description: "Stops audio.",
				process: function(client,message,args,id=0){
						var stopMessage = "Stopping stream.";
						messageSend(message, stopMessage);
		 				dispatcher.end();
				}
		},
		"pause":{
				permissions: restrictPlay,
				description: "Pauses audio.",
				process: function(client,message,args,id=0){
						var pauseMessage = "Pausing stream.";
						messageSend(message, pauseMessage);
 						dispatcher.pause();
				}
		},
		"resume":{
				permissions: restrictPlay,
				description: "Resumes audio.",
				process: function(client,message,args,id=0){
						var resumeMessage = "Resuming stream.";
						messageSend(message, resumeMessage);
		 				dispatcher.resume();
				}
		},
		"restrict":{
				permissions: "administrator",
				description: "",
				process: function(client,message,args,id=0){
						
						var restrictMessage = "Setting music restrictions from " + restrictPlay + " to ";
 						restrictPlay = "admin";
						restrictMessage += restrictPlay + "\n"; 
						messageSend(message,restrictMessage);
						
				}
		},
		"unrestrict":{
				permissions: "administrator",
				description: "",
				process: function(client,message,args,id=0){
						
						var restrictMessage = "Setting music restrictions from " + restrictPlay + " to ";
 						restrictPlay = "any";
						restrictMessage += restrictPlay + "\n"; 
						messageSend(message,restrictMessage);
						
				}
		},

		"players":{
				permissions: "any",
				description: "Shows the list of players.",
				process: function(client,message,args,id=0){
						var playersMessage= "";
						
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
						
						messageSend(message, playersMessage);
						
						
				}
				
				
				
		},
		
		"defs":{
				permissions: "any",
				description: "Shows the list of players' defenses.",
				process: function(client,message,args,id=0){
						var defsMessage= "";
						
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
						
						messageSend(message,defsMessage);
						
				}

		},
		"notes":{
				permissions: "any",
				description: 'You can "add" or "remove"/"rm" notes about your characters. You can also give me the first name of any players to view their notes.',
				process: function(client,message,args,id){
						notesMessage = "";
						var playerNotes = false;
						for(i=0; i< players.length;i++){
								
								var playerName = players[i].getName().toLowerCase();
								
								if( playerName.indexOf(" ") > -1){
										if( playerName.slice(0, playerName.indexOf(" ")) == args[0].toLowerCase()  ){
												var notesMessage = players[i].getNotesMessage();
												playerNotes = true;
												break;
										}
								}
								
								name = String(args.join(" ")).toLowerCase();
								if (name == players[i].getName().toLowerCase()){
										var notesMessage = players[i].getNotesMessage();
										playerNotes = true;
										break;
								}
						}

						
						if(playerNotes == false){
								if(args[0] == "add"){
										args.shift();
										var note = message.content.replace("\\notes","");
										note = note.replace("add", "");
										note = note.replace(/^\s+|\s+$/g, "");
										for(i = 0; i < players.length; i++){
												if(players[i].getId() == id){
														var notesBuff = players[i].getNotes();
														notesBuff.push(note);
														players[i].setNotes(notesBuff);
														notesMessage += "Added to " + players[i].getName() + "'s notes.\n";
														

												}
										}
								}
								else if (args[0] == "rm" || args[0] == "remove"){
										if( args.length == 1){
												notesMessage += "Please specify which note to remove.";
										}
										else{
												for(i = 0; i < players.length; i++){
														if(players[i].getId() == id){
																var notesBuff = players[i].getNotes();
																var newNotes = [];
																var rmFlag = false;
																
																for(j = 0; j < notesBuff.length; j++){
																		var addFlag = true;
																		for(k = 1; k < args.length; k++){
																				if( args[k] == String(Number(j+1)) ){
																						addFlag = false;
																						rmFlag = true;
																						break;
																				}
																				
																		}
																		if(addFlag){
																				newNotes.push(notesBuff[j]);
																		}
																		else{
																				notesMessage += "Removing note (" + String(j+1) + ") from " + players[i].getName() + "'s notes.\n";
																		}
																		
																}
																if(rmFlag == false){
																		notesMessage += "I cannot remove notes that do not exist!";
																}

																players[i].setNotes(newNotes);
																
																break;
														}
														
												}
										}
								}
								else{

										for(i = 0; i < players.length; i++){
												if(players[i].getId() == id){
														notesMessage = players[i].getNotesMessage();
														break;
												}
										}

								}
						}
						
						
						
						messageSend(message,notesMessage);
				}
		}
}
function checkMessageForCommand(message, isEdit) {
		//filter for prefix and bots
		if(message.author.bot || message.content.indexOf(config.prefix) !== 0 ){
				return;
		}
		
		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		if(command == "help") {
				var dashSpace = "--      ";
				var frontLength = 11;
				var helpMessage = "";
				helpMessage +=	"help" + Array(frontLength - String("help").length).join(" ") + dashSpace + "Shows this text.\n\n";
				for( com in commands){
						if( commands.hasOwnProperty(com) && commands[com].description != "") {
								var discordMax = 120;
								var descLength = String(commands[com].description).length;
								var descArr = [];
								descLength += frontLength + dashSpace.length;
								var arrBuff = String(commands[com].description).split("\n");
								
								var k = 0;
								while( k < arrBuff.length) {
								 		if( (arrBuff[k].length + frontLength +dashSpace.length) >= discordMax) {
								 				var maxIndex = discordMax - (frontLength+ dashSpace.length);
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
								
								helpMessage +=	String(com) + Array(frontLength - String(com).length).join(" ");
								var frontSpace = Array(frontLength).join(" ");
								for(k=0; k < arrBuff.length;k++){
						 				if(k == 0){
						 						helpMessage += dashSpace + arrBuff[k] + "\n";
						 				}
						 				else{
												helpMessage += frontSpace + Array(dashSpace.length).join(" ")  + arrBuff[k] + "\n";
						 				}
					   		}
								helpMessage += "\n";
								//notesMessage += "(" + String(Number(j + 1)) + ")" + Array(space).join(" ") +  notesBuff[j] + "\n\n";
						}
						
						
						
				}
				messageSend(message,helpMessage);
				return;
					
		}
		var cmd = commands[command];
		if(String(cmd) == "undefined"){
				return;
		}

		var id = 0;
		if (message.channel.type == "dm"){
				id = message.channel.recipient.id;

		}

		else{
				id = message.member.id;
		}

		if(true){
				try{
						cmd.process(client,message,args,id);
				} catch(e){
						var msgTxt = "command " + command + " failed :(\n";
						if(config.debug){
								msgTxt +=  e.stack;
						}

						messageSend(message,msgTxt);
				}
		}
		else{
				msgTxt = "You do not have the neccesarry permissions for this command.\n";
				messageSend(message,msgTxt);
		}

}


client.on("message", async message => {
		checkMessageForCommand(message, false);	
});


client.login(config.token);
