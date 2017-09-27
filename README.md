# Jenkins_the_DnD_Bot
Jenkins is a discord bot that helps me dm. He still under construction, but can roll dice and show the players' stats and skills.

Jenkins is written in JavaScript using NodeJS.

## Features
Jenkins can do a whole lot of things, including:

* Jenkins can record and calculate all of the primary ability scores and dervived skills of the Players Characters with the \stats and \skills commands.

\stats Example
```Torvold                      Level 5                      Barbarian
-------------------------------------------------------------------
AC = 15   |   INIT = 2   |   SPD = 40   |   PER = 14   |   HP = 51
-------------------------------------------------------------------
STR = 16 (3)
DEX = 14 (2)
CON = 14 (2)
INT = 9 (-1)
WIS = 12 (1)
CHA = 13 (1)
---------------------
Proficiency Bonus = 3```

\skills example
```Torvold                Skills
-----------------------------
S| STR Saving Throw  |*| (6)
T| Athletics         |*| (6)
R|                   | |
-----------------------------
D| DEX Saving Throw  | | (2)
E| Acrobatics        | | (2)
X| Sleight of Hand   | | (2)
 | Stealth           | | (2)
-----------------------------
C| CON Saving Throw  |*| (5)
O|                   | |
N|                   | |
-----------------------------
I| INT Saving Throw  | | (-1)
N| Arcana            | | (-1)
T| History           | | (-1)
 | Investigation     | | (-1)
 | Nature            | | (-1)
 | Religion          | | (-1)
-----------------------------
W| WIS Saving Throw  | | (1)
I| Animal Handling   | | (1)
S| Insight           | | (1)
 | Medicine          | | (1)
 | Perception        |*| (4)
 | Survival          |*| (4)
-----------------------------
C| CHA Saving Throw  | | (1)
H| Deception         | | (1)
A| Intimidation      |*| (4)
 | Performance       | | (1)
 | Persuasion        | | (1)
-----------------------------```


* Jenkins can roll arbitrary dice with arbitrary modifiers (\roll 8d13 + 26 - 2 for instance) or can pull up a particular character's ability scores and modifiers when told to roll for any ability or skill ('\roll str' or  '\roll strength' for instance). 

* Jenkins can keep track of the parties gold with the \gold command.

* Jenkins allows players to add \notes about their characters. He then parses these notes and extracts revelvant modifiers to add when told to roll or when displaying skills or ability scores. For example if I added the note "My Ring of Names gives me +4 to perception." Jenkins would add an additional 4 to your perception score.

* Jenkins can \play, \pause, \resume, or \stop the audio of any YouTube video, to give your DnD a little atmosphere.

## Dependencies
Jenkins needs:

 node(windows)/nodejs(linux) version > 8.0

 npm
 
 discord.js from npm
 
 ytdl-core from npm
 
 fs from npm
 
 child_process from npm
 
 opusscript from npm
 
 ffmpeg
