const Discord = require("discord.js");
const client = new Discord.Client();


const ytdl = require("ytdl-core");
var fs = require('fs');

var goldFile = require("./inventory/gold.json");
var Player = require('./player.js');
var Stat = require('./stat.js');
const config = require("./config.json");
var tools = require("./tools.js"); 
var regex = require("./RegEx.json");

var perm = require("./permissions.json");
var armor = require("./inventory/armor.json");
var spells =  require("./inventory/spells.json");


var players = []; 
var gold = goldFile.gold;
var restrictPlay = "any";

var voiceChannel = null; 
var dispatcher = null;
const broadcast = client.createVoiceBroadcast();



function set(id, args){

    var message = "";

    if(args.length > 1){
				if (args[0] == "gold"){
						gold = Number(args[1]).toFixed(2);
						message += "Setting gold to " + Number(gold).toFixed(2) + "gp.";
				}
				else{
						// var statBuff = tools.parseStringForStat(String(args.join(" ")));
						var statBuff = tools.parseStringForStat(String(args[0]));
						if(statBuff in players[id]){
								args.shift();
								totArgs = args.join(" "); 
								players[id][statBuff].set(totArgs);
								message += "Setting " + players[id]["name"].get() + "'s " + players[id][statBuff]["name"] + " to " + totArgs + ".\n";
								players[id].setMods();
								
						}
						else{
								message += "Invalid argument " + args[0] + ".\n"
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
    for(id in players){
				json = JSON.stringify(players[id], null, '\t');
				var name = players[id]["name"].get().split(" ");
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
				var stats = {};
				json = fs.readFileSync(dirname+file, "utf8");
				
				json = JSON.parse(json);
				for( key in json){
						newStat = json[key];
						Object.setPrototypeOf(newStat,Stat.prototype);
						stats[key] = newStat;
				}

				Object.setPrototypeOf(stats, Player.prototype);
				stats.initialize();
				players[stats["id"].get()] =  stats;
				stats = {};

    });
});


function close(reboot=false){
		if(reboot == true){
				const { spawn } = require('child_process')
				
					client.destroy().then(function(){
								var com = "";
								if(process.platform == "win32"){
										com = "node";
								}
								else if(process.platform == "linux"){
										com = "nodejs";
								}
								const child = spawn(com, ['app.js'], {
										detached: true,
										stdio: ['ignore']
								});
								
								child.unref();
								

								process.exit(0);	
					});
		}
		else{
				client.destroy().then(function(){
						process.exit(0);	
				});
		}
}

function messageSend(message, text, messagefile = "", breakChar = '\n'){


		if (text.length > config.discordMax){
				
				var arr = tools.breakUpString(text, breakChar);
				
				for(i=0; i < arr.length;i++){
						messageSend(message, String(arr[i]));
				}

		}
		else{
				var textToSend = "```\n" + text + "\n```";		
				//				var textToSend = text;
				if(messagefile != ""){
						message.channel.send(textToSend, {
								file: messagefile
						});
				}
				else{
						message.channel.send(textToSend);
						
				}
		}
}
var commands = {
		"test" : {
				permissions: "any",
				description: 'A testbed function for Jenkins.',
				process: function(client,message,args,id){
						players[id].parseNotes();
				}
		},
		"attack" : {
				permissions: "any",
				description: 'Rolls the saved attack for this character.',
				process: function(client,message,args,id){

						
						args.unshift(players[id]["attack"].get());
						
						commands["roll"].process(client, message, args, id);
						
				}
		},
		"spell" : {
				permissions: "any",
				description: 'Give me a spell name (or part of one) to learn more about that spell.',
				process: function(client,message,args,id){
						spellMessage = "";
						if(args.length > 0){
								var spellFound = false;;
								totArgs = args.join(" ").toLowerCase();
								var spellVec = [];
								for( spell in spells){

										if(spells[spell]["name"].toLowerCase() == totArgs){
												spellVec = [ spell ];
												break;
										}

										if( spells[spell]["name"].toLowerCase().indexOf(totArgs) >-1){
												//spellFound = true;
												spellVec.push(spell);
										}
								}
								if(spellVec.length == 1){
										spell = spellVec[0];
										spellMessage += String(spells[spell]["name"]) + "\n";
										var spellBuff = ""
										
										spellBuff += "Level: " + spells[spell]["level"] + "\n";
										spellBuff += "School: " + tools.toTitleCase(spells[spell]["school"]) + "\n";
										spellBuff += "Casting Time: " + spells[spell]["casting_time"] + "\n";
										spellBuff += "Components: "
										if(spells[spell]["components"]["material"] == true){
												spellBuff += "M";
										}
										if(spells[spell]["components"]["material"] == true
											 && (spells[spell]["components"]["somatic"] == true
													 || spells[spell]["components"]["verbal"] == true)){
												
												spellBuff += ", ";
										}
										
										if(spells[spell]["components"]["somatic"] == true){
												spellBuff += "S";
										}
										
										if(spells[spell]["components"]["somatic"] == true
											 && spells[spell]["components"]["verbal"] == true){
												
												spellBuff += ", ";
										}
										
										if(spells[spell]["components"]["verbal"] == true){
												spellBuff += "V";
										}
										
										if(spells[spell]["components"]["material"] == false
											 && spells[spell]["components"]["somatic"] == false
											 && spells[spell]["components"]["verbal"] == false){
												
												spellBuff += "None";
										}
										spellBuff += "\n";
										
										var re = new RegExp(regex.costCheck);
										if(spells[spell]["components"]["materials_needed"] != null){
												var matList = spells[spell]["components"]["materials_needed"];
												for(var j = 0; j < matList.length;j++){
														rebuff = matList[j].match(re);
														if(rebuff != null){
																spellBuff += "Cost: " + rebuff[0] + "\n";
																break;
														}
												}
												
												//.match(re);
										}
										
										spellBuff += "Range: " + spells[spell]["range"] + "\n";
										spellBuff += "Duration: " +spells[spell]["duration"] + "\n";
										var maxWidth = Math.max(tools.getMaxWidth(spellBuff)+1,spellMessage.length);
										maxWidth = Math.min(maxWidth,config.discordWidth);
										spellMessage += Array(maxWidth).join("-") + "\n";
										spellMessage += spellBuff;
										
										maxWidth = Math.min(tools.getMaxWidth(spells[spell]["description"]),config.discordWidth);
										spellMessage += Array(maxWidth).join("-") + "\n";
										spellMessage += spells[spell]["description"];
										if(spells[spell]["higher_levels"] != null){
												spellMessage += "\n\n" + spells[spell]["higher_levels"] + "\n";
										}
										
								}
								else if(spellVec.length == 0){
										spellMessage += "I don't recognize the spell " + totArgs;
								}
								else if(spellVec.length > 1){
										for(var k = 0; k <spellVec.length;k++){
												spellVec[k] = spells[spellVec[k]]["name"];
										}
										spellVec.sort();
										spellMessage += "These spells all matched your request:" + "\n";
										var spellNameBuff = ""
										for(var k = 0; k <spellVec.length;k++){
												spellNameBuff += spellVec[k] +"\n";
										}
										var maxNameWidth = spellMessage.length;
										maxNameWidth= Math.max(tools.getMaxWidth(spellNameBuff), maxNameWidth);
										maxNameWidth = Math.min(maxNameWidth, config.discordWidth);
										spellMessage += Array(maxNameWidth).join("-") + "\n";
										spellMessage += spellNameBuff;
								}
								
						}
						else{
								spellMessage += "Please give me the name of a spell.";
								
						}
						messageSend(message,spellMessage);
				}
		},
		
		
		"armor" : {
				permissions: "any",
				description: "This command changes the armor you have equipped.",
				process: function(client, message, args, id) 
	      {
						var armorMessage = "";
						var numTypes = Object.keys(armor).length;
						var newAC;
						var ACdexBuff;

						if(args[0]=="equip" || args[0]=="unequip")
						{
								var valid_armor = 0;
								var armor_type;
								if(args[0]=="unequip")
								{
										armor_type = "none";
										armorMessage += "Unequipping armor.\n"
										
								}
								else
								{
										args.shift();
										armor_type = args.join("");
								}
								for (ar in armor)
								{
										if(ar == armor_type)
												valid_armor = 1;
								}
								if(valid_armor)
								{
										players[id]["armor"].set(armor[armor_type][0]);
										players[id].parseArmor();
	
										if(armor_type != "none"){
												armorMessage += "Equipping " + players[id]["armor"].get() + " armor on " + players[id]["name"].get() + ".\n";
										}
										
										armorMessage += players[id]["name"].get() + "'s new AC should be " + players[id]["ac"].get() + ".\n";
										
								}
								else
								{
									armorMessage += "Invalid armor type.";
								}
						}
						else if(args.length == 0)
						{
								armorMessage += players[id]["name"].get() + " is wearing ";
								if(players[id]["armor"].get() != "none"){
										
										armorMessage += players[id]["armor"].get() + " armor.\n";
								}
								else{
										armorMessage += "no armor.\n";
								}
						}
						else
						{
								armorMessage += "Unacceptable arguments for armor command.";
						}

						messageSend(message, armorMessage);
				}
				
		},
		"close": {
				permissions: "administrator",
				description: "Turns me off. Needs admin permissions.",
				process: function(client, message, args, id=0) {
						save();
						messageSend(message,"Shutting down.");
						// client.destroy().then(function(){
						// 		process.exit(0);	
						// });
						
						setTimeout(close, 1000);
				}
		},
		"reboot": {
				permissions: "any",
				description: "Reboots me.",
				process: function(client, message, args, id=0) {
						messageSend(message,"Rebooting.");
						var reboot = true;
						setTimeout(close, 1000, reboot);
						// client.destroy().then(function(){
						// 		var com = "";
						// 		if(process.platform == "win32"){
						// 				com = "node";
						// 		}
						// 		else if(process.platform == "linux"){
						// 				com = "nodejs";
						// 		}
						// 		const child = spawn(com, ['app.js'], {
						// 				detached: true,
						// 				stdio: ['ignore']
						// 		});
								
						// 		child.unref();
								

						// 		process.exit(0);	
						// });
				}
		},
		"update": {
				permissions: "administrator",
				description: "Updates from git repo and reboots.",
				process: function(client, message, args, id=0) {
						const { spawn } = require('child_process');
						messageSend(message,"Updating from git repo.");

						var fetch = spawn('git', ['pull']);
						fetch.stdout.on('data',function(data){
						});
						
						
						client.destroy().then(function(){
								var com = "";
								if(process.platform == "win32"){
										com = "node";
								}
								else if(process.platform == "linux"){
										com = "nodejs";
								}
								const child = spawn(com, ['app.js'], {
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
						mapFile = "./map.jpg";
						messageSend(message,mapMessage,mapFile);
				}
				

		},
		"say":{
				permissions: "any",
				description: "Makes me say something.",
				process: function(client,message,args,id){


						var sayMessage =  args.join(" ");
						// Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
						message.delete().catch(O_o=>{}); 
						// And we get the bot to say the thing: 
						
						var mickelDescription = ["poop", "eldritch ", "vibrant ", "breezy ", "silky ", "bountiful ", "literally on fire "];
						var mickelparts = ["face", "butt", "foot","head", "buttocks","buttock", "nostril","growth", "skeleton", "aqueous humor", '"breasts"'];
						
						
						if(id == 152235945368879105){
								
								sayMessage += "\nP.S.: Mickel has a " + String(mickelDescription[tools.getRandomInt(0, mickel.length - 1)]) + String(mickelparts[tools.getRandomInt(0, mickelparts.length-1)]) +".\n";
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
						var statsMessage = "";
						
						if( args.length > 0){
								var name = String(args.join(" ")).toLowerCase();
								for(key in players){
										if(players[key]["name"].get().toLowerCase().indexOf(name) == 0){
												statsMessage =players[key].getStatsMessage();
												break;
												
										}
								}
						}
						
						else{
								statsMessage = players[id].getStatsMessage();
						}
						messageSend(message,statsMessage);
				}						
		},
		"skills":{
				permissions: "any",
				description: "Shows your character's skills, proficiencies and modifiers. You can give me the first name of someone to see their skills.",
				process: function(client,message,args,id){
						var skillsMessage = "";
						if( args.length > 0){
								var name = String(args.join(" ")).toLowerCase();
								for(key in players){
										if(players[key]["name"].get().toLowerCase().indexOf(name) == 0){
												skillsMessage = players[key].getSkillsMessage();
												break;
												
										}
								}
						}
						
						else{
								skillsMessage = players[id].getSkillsMessage();
								
								
								
						}
						messageSend(message,skillsMessage);

				}
		},
		"bonuses":{
				permissions: "any",
				description: "Shows your character's additional modifiers that have been extracted from your notes. You can give me the first name of someone to see their bonuses.",
				process: function(client,message,args,id){
						var bonusMessage = "";
						if( args.length > 0){
								var name = String(args.join(" ")).toLowerCase();
								for(key in players){
										if(players[key]["name"].get().toLowerCase().indexOf(name) == 0){
												bonusMessage = players[key].getBonusMessage();
												break;
												
										}
								}
						}
						
						else{
								bonusMessage = players[id].getBonusMessage();
								
								
								
						}
						messageSend(message,bonusMessage);

				}
		},
		
		"roll":{
				permissions: "any",
				description: "Give a number of die with modifier(s) to roll and show result, (1d4 + 10 - 5 or 5d17 - 5). Put sum at the end if you don't want to see the individual rolls.",
				process: function(client,message,args,id){

						var sumFlag = false;
						var advFlag = false;
						var disFlag = false;

						////////////////////////////////// Parsing input
						var totArgs = args.join("").toLowerCase();
						
						if( totArgs.indexOf("sum") != -1){
								sumFlag = true;
								totArgs = totArgs.replace("sum","");
						}
						else{
								if(totArgs.indexOf("adv") != -1)
								{
										advFlag = true;
										totArgs = totArgs.replace("adv","");
								}
								if(totArgs.indexOf("dis") != -1)
								{
										disFlag = true;
										totArgs = totArgs.replace("dis","");
								}	
						}

						if( advFlag && disFlag ){
								advFlag = false;
								disFlag = false;
						}
						
						var rollMessage = "";

						var numDieArr = [];
						var maxDieArr = [];
						var dice = [];
						var modifier = 0;

						totArgs = args.join(" ").toLowerCase();
						re = new RegExp(regex.statAdditionCheck);
						
						var buff;
						while((buff = totArgs.match(re)) != null){
								modifier += tools.getModFromString(players,id,tools.parseStringForStat(buff[3]));
								totArgs = totArgs.replace(buff[0], "");
								
						}
						var buffArr = tools.getDice(totArgs);
						dice = buffArr[0];
						
						for(k = 0; k < dice.length; k++){
								numDieArr.push(Number(dice[k][0]));
								maxDieArr.push(Number(dice[k][1]));
						}

						
						
						var	buff= tools.parseSum(buffArr[1].replace(/ +/g, ""))
						modifier += Number(buff[0])
						modifier += tools.getModFromString(players,id,tools.parseStringForStat(buffArr[1]));
						

						
						

						
						var rollType = tools.parseStringForStat(buffArr[1]);
						

						

						rollMessage = tools.getRollMessage(numDieArr,maxDieArr, modifier, players, id, sumFlag, advFlag, disFlag, rollType);
						
						messageSend(message,rollMessage);
						
						
						
						
				}
		},
		
		"aliases":{
				permissions: "any",
				description: "Shows the aliases of all the different stats and skills that roll and notes can understand.",
				process: function(client,message,args,id){
						var aliasMessage = tools.getAliases();
						messageSend(message, aliasMessage, "", "\n\n");
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
								if(tools.parseStringForStat(args.join(" ")) == "div"){

										var numPlayers = 0;										

										for( id in players){
												if( players[id]["name"].get() != "The DM"){
														numPlayers++;
												}
										}
										
										var divGold = Number(gold/numPlayers).toFixed(2);
										goldMessage += "Dividing " + Number(gold).toFixed(2) + "gp amongst the party into " + tools.inWords(numPlayers) + " parts of " + divGold + "gp.\n";
										var divMessage = Array(goldMessage.length).join("-");
										goldMessage += divMessage + '\n';
										var max = 0;
										for(id in players){
												if(id != config.DM_ID){
														players[id]["gold"].set(Number(Number(players[id]["gold"].get()) +Number( divGold)).toFixed(2));

														var buffMessage = "Adding " + divGold + " to " + players[id]["name"].get() + "'s gold.\n" 
														if (buffMessage.length > max){
																max = buffMessage.length;
														}

														
														goldMessage += buffMessage
												}
										}
										gold = 0;

										max = Math.max(max, String("Total gold: " + Number(gold).toFixed(2) + "gp\n").length);
										divMessage = Array(max).join("-");
										goldMessage += divMessage + '\n';
								}
								else if( tools.parseStringForStat(args.join(" ")) == "give"){
										var giveGold = 0;
										var index = tools.findNumberIndex(args.join(" "));
										if( index == -1){
												var re = new RegExp("\\ball\\b");
												if( args.join(" ").match(re) != null){
														giveGold = players[id]["gold"].get();
												}
												else{
														goldMessage += "Please state how much gold you want to give to the party.\n"
														messageSend(message, goldMessage);
														return;
												}
										}
										else{
												giveGold = tools.parseNumberFromString(index, args.join(" "));
										}
										if(giveGold > players[id]["gold"].get()){
												giveGold = players[id]["gold"].get();
										}
										players[id]["gold"].set(Number(Number(players[id]["gold"].get()) - Number( giveGold)).toFixed(2));
										gold = Number(Number(gold) +  Number(giveGold));
										goldMessage += players[id]["name"].get() + " has given " + String(Number(giveGold).toFixed(2)) + "gp to the party.\n";
								}
								
								
								
								
								else if( tools.parseStringForStat(args.join(" ")) == "take"){

										var takeGold = 0;
										var index = tools.findNumberIndex(args.join(" "));
										if( index == -1){
												var re = new RegExp("\\ball\\b");
												if( args.join(" ").match(re) != null){
														takeGold = gold;
												}
												else{
														goldMessage += "Please state how much gold you want to take from the party.\n"
														messageSend(message, goldMessage);
														return;
												}
										}
										else{
												takeGold = tools.parseNumberFromString(index, args.join(" "));
										}
										if(takeGold > gold){
												takeGold = gold;
										}
										players[id]["gold"].set(Number(Number(players[id]["gold"].get()) + Number( takeGold)).toFixed(2));
										gold = Number(Number(gold) -  Number(takeGold));
										goldMessage += players[id]["name"].get() + " has taken " + String(Number(takeGold).toFixed(2)) + "gp from the party.\n";
										
								}
								
								
								
								else{
										var goldBuff = Number(tools.parseSum(totArgs)[0]);
										gold = Number(Number(gold) +  Number(goldBuff));
										if(goldBuff >= 0){
												goldMessage += "Adding " + Number(goldBuff).toFixed(2) + "gp\n";
										} 
										else if(goldBuff < 0){
												goldMessage += "Removing " + Number(goldBuff).toFixed(2) + "gp\n";
										}
								}
						}
						
						
						goldMessage += "Total gold: " + Number(gold).toFixed(2) + "gp\n";
						messageSend(message,goldMessage);
						
						
				}


		},

		"mygold":{
				permissions: "any",
				description: "Shows your personal gold. Can be added and subtracted from (i.e. +100 - 50 +...).",
				process: function(client,message,args,id){
						
						var goldMessage = "";
						totArgs = args.join("");
						
						if (totArgs.length < 1){}
						else {

								if( (tools.parseStringForStat(args.join(" ")) == "take") || (tools.parseStringForStat(args.join(" ")) == "give") ){
										commands["gold"].process(client, message, args, id);
										return;
								}
								
								var goldBuff = Number(tools.parseSum(totArgs)[0]);
								players[id]["gold"].set(Number(Number(players[id]["gold"].get()) +  Number(goldBuff)));
								if(goldBuff >= 0){
										goldMessage += "Adding " + Number(goldBuff).toFixed(2) + "gp\n";
								} 
								else if(goldBuff < 0){
										goldMessage += "Removing " + Number(goldBuff).toFixed(2) + "gp\n";
								}
						}
						
						goldMessage += players[id]["name"].get() + "'s total gold: " + Number(players[id]["gold"].get()).toFixed(2) + "gp\n";
						messageSend(message,goldMessage);
						
				}
		},



		"play":{
				permissions: restrictPlay,
				description: "Give end of youtube address (everything after watch?v=) to play audio.",
				process: function(client,message,args,id=0){
						if( args.length >= 1){
								console.log(dispatcher);
								if(dispatcher != null){
										commands["stop"].process(client, message, args, id);
										setTimeout( commands["play"].process, 1000, client, message, args, id);
								}
								else{
										// if(dispatcher != null){
										// 		console.log("killing stream");
										// 		dispatcher.end();
										// 		dispatcher = null;
										// }
										const streamOptions = {seek: 0, volume: 1};
										var video_id = args[0];
										
										var playMessage = "Playing " + args[0];
										var stream = ytdl("https://www.youtube.com/watch?v=" + video_id, {filter: 'audioonly'});
										var info = ytdl.getInfo("https://www.youtube.com/watch?v=" + video_id);
										console.log("Streaming audio from https://www.youtube.com/watch?v=" + video_id );	
										console.log(dispatcher);
										dispatcher = client.voiceConnections.first().playStream(stream, streamOptions);
										dispatcher.once("end", reason =>{
												dispatcher = null;
										});
										
										messageSend(message, playMessage);
								}
						}
				}
		},
		"stop":{
				permissions: restrictPlay,
				description: "Stops audio.",
				process: function(client,message,args,id=0){
						var stopMessage = "Stopping stream.";
						if(dispatcher != null){
								dispatcher.end();
								dispatcher = null;
								messageSend(message, stopMessage);
								
						}

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
 						restrictPlay = "administrator";
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
						
						var playersHeader = "Name" + Array(regionSize - String("Name").length).join(" ") + "Level" + Array(regionSize - String("Level").length).join(" ") + "Class" + Array(regionSize - String("Class").length).join(" ") + "Gold" +  "\n"; 
						
						for(id in players){
								if(players[id]["class"].get() != "Dungeon Master"){
										buffMessage += players[id]["name"].get() + Array(regionSize - String(players[id]["name"].get()).length).join(" ") + "Level " + players[id]["level"].get() + Array(regionSize - String("Level " + players[id]["level"].get()).length).join(" ") + players[id]["class"].get() + Array(regionSize - String(players[id]["class"].get()).length).join(" ") + String(Number(players[id]["gold"].get()).toFixed(2)) + "gp" +  "\n"; 
										
										if(players[id]["class"].get().length > maxSize){
												maxSize = players[id]["class"].get().length;
										}
										
										
								}	
						}
						
						playersMessage += playersHeader + Array(3*regionSize + maxSize -1).join("-") + "\n" + buffMessage;
						
						messageSend(message, playersMessage);
						
						
				}
				
				
				
		},

		"defs":{
				permissions: "any",
				description: "Shows the list of players' defenses and combat related stats.",
				process: function(client,message,args,id=0){
						var defsMessage= "";
						
						var buffMessage = "";
						var regionSize = 10;
						var nameregionSize =30;
						var maxSize = 0;
						
						var defsHeader = "Name" + Array(nameregionSize - String("Name").length).join(" ") + "AC" + Array(regionSize - String("AC").length).join(" ") + "INIT" + Array(regionSize - String("INIT").length).join(" ") + "SPD" + Array(regionSize - String("SPD").length).join(" ")  + "PER" + Array(regionSize - String("PER").length).join(" ")  +  "HP" + "\n"; 
						
						for(id in players){
								
								if(players[id]["class"].get() != "Dungeon Master"){
										buffMessage += players[id]["name"].get() + Array(nameregionSize - String(players[id]["name"].get()).length).join(" ")  + players[id]["ac"].get() + Array(regionSize - String(players[id]["ac"].get()).length).join(" ") + players[id]["init"].get() + Array(regionSize - String(players[id]["init"].get()).length).join(" ") + players[id]["spd"].get() + Array(regionSize - String(players[id]["spd"].get()).length).join(" ") + players[id]["per"].get() + Array(regionSize - String(players[id]["per"].get()).length).join(" ") + players[id]["hp"].get() + "\n"; 
										
										if(String(players[id]["spd"].get()).length > maxSize){
												maxSize = String(players[id]["spd"].get()).length;
												
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
				description: 'You can "add" or "remove"/"rm" notes about your characters. You can also give me the first name of any players to view their notes. These notes are parsed for any additional modifiers your character recieves, which can be view using '  + config.prefix + 'bonuses command. This means you can give me a note like "My Ring of Names give me +4 to PER/perception" and I will update your stats accordingly.',
				process: function(client,message,args,id){

						var notesMessage = "";
						
						
						var playerNotes = false;
						var name = args.join(" ").toLowerCase();

						
						if( args.length > 0){
								for(key in players){
										if(players[key]["name"].get().toLowerCase().indexOf(name) == 0){
												notesMessage = players[key].getNotesMessage();
												break;
												
										}
								}
						}
						else{
								notesMessage = players[id].getNotesMessage();
								playerNotes = true;
								
						}
						
						
						
						
						if(playerNotes == false){
								if(args[0] == "add"){
										args.shift();
										var note = message.content.replace("\\notes","");
										note = note.replace("add", "");
										note = note.replace(/^\s+|\s+$/g, "");
										var notesBuff = players[id]["notes"].get();
										notesBuff.push(note);
										players[id]["notes"].set(notesBuff);
										notesMessage += "Added to " + players[id]["name"].get() + "'s notes.\n";
										players[id].parseNotes();
								}
								else if (args[0] == "rm" || args[0] == "remove") {
										if( args.length == 1){
												notesMessage += "Please specify which note to remove.";
										}
										else{
												
												var notesBuff = players[id]["notes"].get();
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
																notesMessage += "Removing note (" + String(j+1) + ") from " + players[id]["name"].get() + "'s notes.\n";
														}
														
												}
												if(rmFlag == false){
														notesMessage += "I cannot remove notes that do not exist!";
												}
												
												players[id]["notes"].set(newNotes);
												players[id].parseNotes();
												
										}
								}
								// else{

								// 		notesMessage = players[id].getNotesMessage();
										
								// }
						}
						
						
						messageSend(message,notesMessage);
				}
		},
		"inv" : {
				permissions: "any",
				description: 'You can "add" or "remove"/"rm" items in your characters\' inventory.',
				process: function(client,message,args,id){
						var invMessage = "";
						
						
						var playerInv = false;
						var name = args.join(" ").toLowerCase();
						
						if( args.length > 0){
								var name = String(args.join(" ")).toLowerCase();
								for(key in players){
										if(players[key]["name"].get().toLowerCase().indexOf(name) == 0){
												invMessage = players[key].getInvMessage();
												break;
												
										}
								}
						}
						
						else{
								invMessage = players[id].getInvMessage();
								playerInv = true;
								
						}
						
						
						
						
						if(playerInv == false){
								if(args[0] == "add"){
										args.shift();
										var inv = message.content.replace("\\inv","");
										inv = inv.replace("add", "");
										inv = inv.replace(/^\s+|\s+$/g, "");
										var invBuff = players[id]["inventory"].get();
										invBuff.push(inv);
										players[id]["inventory"].set(invBuff);
										invMessage += "Added to " + players[id]["name"].get() + "'s inv.\n";
								}
								else if (args[0] == "rm" || args[0] == "remove") {
										if( args.length == 1){
												invMessage += "Please specify which item to remove.";
										}
										else{
												
												var invBuff = players[id]["inventory"].get();
												var newInv = [];
												var rmFlag = false;
												
												for(j = 0; j < invBuff.length; j++){
														var addFlag = true;
														for(k = 1; k < args.length; k++){
																if( args[k] == String(Number(j+1)) ){
																		addFlag = false;
																		rmFlag = true;
																		break;
																}
																
														}
														if(addFlag){
																newInv.push(invBuff[j]);
														}
														else{
																invMessage += "Removing item (" + String(j+1) + ") from " + players[id]["name"].get() + "'s inventory.\n";
														}
														
												}
												if(rmFlag == false){
														invMessage += "I cannot remove items that do not exist!";
												}
												
												players[id]["inventory"].set(newInv);
											
										}
								}
								// else{

								// 		invMessage = players[id].getInvMessage();
										
								// }
						}
						
						messageSend(message,invMessage);
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
								var discordMax = config.discordWidth;
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
				
				
				messageSend(message, helpMessage, "", "\n\n" );
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

		
		if( (cmd.permissions == "administrator" && (perm.admin.indexOf(id) > -1))|| cmd.permissions == "any" ){
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
