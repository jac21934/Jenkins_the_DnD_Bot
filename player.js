
var fs = require('fs');
var tools = require("./tools.js"); 



function Player() {
	this._id = 0;
	this._name = "";	
	//Player Level
	this._level = 0;
	this._class = "";
	//Stats
	this._str = 0;
	this._dex = 0;
	this._con = 0;
	this._int = 0;
	this._wis = 0;
	this._cha = 0;
	//modifiers
	this._strmod = 0;
	this._dexmod = 0;
	this._conmod = 0;
	this._intmod = 0;
	this._wismod = 0;
	this._chamod = 0;
	this.profbonus=0;
	//Armor stuff
	this._ac  = 0;
	this._init = 0;	
	this._spd = 0;
	this._per = 0;
	//HP
	this._hp = 0;
	//skills
		//strength
	this._strsavprof	= 0;
	this._athprof		= 0;
		//dex
	this._dexsavprof 	= 0;
	this._acroprof		= 0;
	this._sleightprof 	= 0;
	this._stealthprof 	= 0;
		//con
	this._consavprof	= 0;
		//int
	this._intsavprof	= 0;
	this._arcanaprof	= 0;
	this._historyprof	= 0;
	this._investprof	= 0;
	this._natureprof	= 0;
	this._religionprof	= 0;

		//wisdom
	this._wissavprof	= 0;
	this._animalprof	= 0;
	this._insightprof	= 0;
	this._medicineprof	= 0;
	this._perprof		= 0;
	this._survprof		= 0;
	//cha
	this._chasavprof	= 0;
	this._deceptprof	= 0;
	this._intimprof		= 0;
	this._performprof	= 0;	
	this._persprof		= 0;

	//Notes:
	this._notes			="0";	
}



Player.prototype = {
	getId: function(){
		return this._id;
	},

	getName: function(){
		return this._name;
	},
	getLevel: function(){
		return this._level;
	},
	getClass: function(){
		return this._class;
	},	
	getStr: function(){
		return this._str;
	},
	getDex: function(){
		return this._dex;
	},
	getCon: function(){
		return this._con;
	},
	getInt: function(){
		return this._int;
	},
	getWis: function(){
		return this._wis;
	},
	getCha: function(){
		return this._cha;
	},

	getStrmod: function(){
		return this._strmod;
	},
	getDexmod: function(){
		return this._dexmod;
	},
	getConmod: function(){
		return this._conmod;
	},
	getIntmod: function(){
		return this._intmod;
	},
	getWismod: function(){
		return this._wismod;
	},
	getChamod: function(){
		return this._chamod;
	},
	getProfbonus: function(){
		return this._profbonus;
	},

	getAc: function(){
		return this._ac;
	},
	getInit: function(){
		return this._init;
	},
	getSpd: function(){
		return this._spd;
	},
	getHp: function(){
		return this._hp;
	},
	getPer: function(){
		return this._per;
	},

		//strength
	getStrsavprof: function(){
		return this._strsavprof;
	},
	getAthprof: function(){
		return this._athprof;
	},
		//dex
	getDexsavprof: function(){
		return this._dexsavprof;
	},
	getAcroprof: function(){
		return this._acroprof;
	},	
	getSleightprof: function(){
		return this._sleightprof;
	},
	getStealthprof: function(){
		return this._stealthprof;
	},
		//con
	getConsavprof: function(){
		return this._consavprof;
	},
		//int
	getIntsavprof: function(){
		return this._intsavprof;
	},
	getArcanaprof: function(){
		return this._arcanaprof;
	},
	getHistoryprof: function(){
		return this._historyprof;
	},
	getInvestprof: function(){
		return this._investprof;
	},
	getNatureprof: function(){
		return this._natureprof;
	},
	getReligionprof: function(){
		return this._religionprof;
	},
		//wisdom
	getWissavprof: function(){
		return this._wissavprof;
	},	
	getAnimalprof: function(){
		return this._animalprof;
	},
	getInsightprof: function(){
		return this._insightprof;
	},
	getMedicineprof: function(){
		return this._medicineprof;
	},
	getPerprof: function() {
		return  this._perprof;
	},
	getSurvprof: function() {
		return  this._survprof;
	},

	//cha
	getChasavprof: function() {
		return  this._chasavprof;
	},
	getDeceptprof: function() {
		return  this._deceptprof;
	},
	getIntimprof: function() {
		return  this._intimprof;
	},
	getPerformprof: function() {
		return  this._performprof;
	},
	getPersprof: function() {
		return  this._persprof;
	},
	getNotes:   function(){
		return this._notes;
	},

// Setting functions:
	setName: function(name){
		this._name = name;
	},
	setLevel: function(level){
		this._level = level;
	},
	setClass: function(Class){
		this._class = Class;
	},	
	setStr: function(str){
		this._str = str;
	},
	setDex: function(dex){
		this._dex = dex;
	},
	setCon: function(con){
		this._con = con;
	},
	setInt: function(int){
		this._int = int;
	},
	setWis: function(wis){
		this._wis = wis;
	},
	setCha: function(cha){
		this._cha = cha;
	},
	setMods: function(){

		this._strmod = Number(Math.floor((this.getStr() - 10)/2));
		this._dexmod = Number(Math.floor((this.getDex() - 10)/2));

		this._conmod = Number(Math.floor((this.getCon() - 10)/2));
		this._intmod = Number(Math.floor((this.getInt() - 10)/2));

		this._wismod = Number(Math.floor((this.getWis() - 10)/2));
		this._chamod = Number(Math.floor((this.getCha() - 10)/2));

		this._profbonus = Math.floor((this.getLevel() + 7)/4);
		
		this._per = 10 + this.getWismod() + this.getProfbonus() * this.getPerprof();

		//console.log(this.getPer());
	},

	setAc: function(ac){
		this._ac = ac;
	},
	setInit: function(init){
		this._init = init;
	},
	setSpd: function(spd){
		this._spd = spd;
	},
	//HP
	setHp: function(hp){
		this._hp = hp;
	},
	setPerprof: function(perprof){
		this._perprof = perprof;
	},
	setNotes: function(notes){
		this._notes = notes;
	},



    getSkillsMessage: function(){

		var skillsMessage = "```";
		var space = 30;
		var messageHeader = this.getName() + Array(space - this.getName().length).join(" ") +  "\n";
		skillsMessage += messageHeader + Array(messageHeader.length).join("-")  + "\n";

		skillsMessage += "S| STR Saving Throw  |" + tools.getProf(this.getStrsavprof()) + "| (" + String(Number(this.getStrmod() + this.getProfbonus()*this.getStrsavprof())) + ")" +  "\n"; 
		skillsMessage += "T| Athletics         |" + tools.getProf(this.getAthprof()) + "| (" + String(Number(this.getStrmod() +  this.getProfbonus()*this.getAthprof())) + ")" + "\n"; 	
		skillsMessage += "R|                   | |" + "\n"; 
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//dex

		skillsMessage += "D| DEX Saving Throw  |" + tools.getProf(this.getDexsavprof()) + "| (" + String(Number(this.getDexmod() +  this.getProfbonus()*this.getDexsavprof())) + ")" + "\n"; 
		skillsMessage += "E| Acrobatics        |" + tools.getProf(this.getAcroprof()) + "| (" + String(Number(this.getDexmod() +  this.getProfbonus()*this.getAcroprof())) + ")" + "\n"; 	
		skillsMessage += "X| Sleight of Hand   |" + tools.getProf(this.getSleightprof()) + "| (" + String(Number(this.getDexmod() +  this.getProfbonus()*this.getSleightprof())) + ")" + "\n"; 
		skillsMessage += " | Stealth           |" + tools.getProf(this.getStealthprof()) + "| (" + String(Number(this.getDexmod() +  this.getProfbonus()*this.getStealthprof())) + ")" +"\n"; 
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//con
		skillsMessage += "C| CON Saving Throw  |" + tools.getProf(this.getConsavprof()) + "| (" + String(Number(this.getConmod() +  this.getProfbonus()*this.getConsavprof())) + ")" + "\n"; 
		skillsMessage += "O|                   | |" + "\n"; 	
		skillsMessage += "N|                   | |" + "\n"; 
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//int
		skillsMessage += "I| INT Saving Throw  |" + tools.getProf(this.getIntsavprof()) + "| (" + String(Number(this.getIntmod() +  this.getProfbonus()*this.getIntsavprof())) + ")" + "\n"; 
		skillsMessage += "N| Arcana            |" + tools.getProf(this.getArcanaprof()) + "| (" + String(Number(this.getIntmod() +  this.getProfbonus()*this.getArcanaprof())) + ")" + "\n"; 	
		skillsMessage += "T| History           |" + tools.getProf(this.getHistoryprof()) + "| (" + String(Number(this.getIntmod() +  this.getProfbonus()*this.getHistoryprof())) + ")" + "\n"; 
		skillsMessage += " | Investigation     |" + tools.getProf(this.getInvestprof()) + "| (" + String(Number(this.getIntmod() +  this.getProfbonus()*this.getInvestprof())) + ")" + "\n"; 
		skillsMessage += " | Nature            |" + tools.getProf(this.getNatureprof()) + "| (" + String(Number(this.getIntmod() +  this.getProfbonus()*this.getNatureprof())) + ")" + "\n"; 
		skillsMessage += " | Religion          |" + tools.getProf(this.getReligionprof()) + "| (" + String(Number(this.getIntmod() +  this.getProfbonus()*this.getReligionprof())) + ")" + "\n"; 		
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//wis
		skillsMessage += "W| WIS Saving Throw  |" + tools.getProf(this.getWissavprof()) + "| (" + String(Number(this.getWismod() +  this.getProfbonus()*this.getWissavprof())) + ")"+ "\n"; 
		skillsMessage += "I| Animal Handling   |" + tools.getProf(this.getAnimalprof()) + "| (" + String(Number(this.getWismod() +  this.getProfbonus()*this.getAnimalprof())) + ")"+ "\n"; 	
		skillsMessage += "S| Insight           |" + tools.getProf(this.getInsightprof()) + "| (" + String(Number(this.getWismod() +  this.getProfbonus()*this.getInsightprof())) + ")"+ "\n"; 
		skillsMessage += " | Medicine          |" + tools.getProf(this.getMedicineprof()) + "| (" + String(Number(this.getWismod() +  this.getProfbonus()*this.getMedicineprof())) + ")"+ "\n"; 
		skillsMessage += " | Perception        |" + tools.getProf(this.getPerprof()) + "| (" + String(Number(this.getWismod() +  this.getProfbonus()*this.getPerprof())) + ")"+ "\n"; 	
		skillsMessage += " | Survival          |" + tools.getProf(this.getSurvprof()) + "| (" + String(Number(this.getWismod() +  this.getProfbonus()*this.getSurvprof())) + ")"+ "\n"; 	
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"
		//cha
		skillsMessage += "C| CHA Saving Throw  |" + tools.getProf(this.getChasavprof()) + "| (" + String(Number(this.getChamod() +  this.getProfbonus()*this.getChasavprof())) + ")"+ "\n"; 
		skillsMessage += "H| Deception         |" + tools.getProf(this.getDeceptprof()) + "| (" + String(Number(this.getChamod() +  this.getProfbonus()*this.getDeceptprof())) + ")"+  "\n"; 	
		skillsMessage += "A| Intimidation      |" + tools.getProf(this.getIntimprof()) + "| (" + String(Number(this.getChamod() +  this.getProfbonus()*this.getIntimprof())) + ")"+  "\n"; 
		skillsMessage += " | Performance       |" + tools.getProf(this.getPerformprof()) + "| (" + String(Number(this.getChamod() +  this.getProfbonus()*this.getPerformprof())) + ")"+  "\n"; 
		skillsMessage += " | Persuasion        |" + tools.getProf(this.getPersprof()) + "| (" + String(Number(this.getChamod() +  this.getProfbonus()*this.getPersprof())) + ")"+  "\n"; 	
		skillsMessage += Array(messageHeader.length).join("-")  + "\n"

		skillsMessage += "```";
		return skillsMessage;
}

}


module.exports = Player;









