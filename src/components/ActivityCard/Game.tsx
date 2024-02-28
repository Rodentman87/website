import { Tooltip } from "@components/Tooltip";
import Color from "color";
import { AnimatePresence, motion } from "framer-motion";
import { extractColors, getBestColors } from "helpers/colors";
import Image from "next/image";
import React, { useEffect } from "react";
import { StatusResponse } from "./ActivityCard";

const GAME_MAP = {
	// Overwatch
	"356875221078245376": "2357570",
	// Terraria
	"356943499456937984": "105600",
	// tModLoader
	"844487120416407573": "105600",
	// The Lord of the Rings Online™
	"451540469470593024": "212500",
	// Rocket League
	"356877880938070016": "252950",
	// Call of Duty®
	"1149118246826561609": "1938090",
	// Starbound
	"467102538278109224": "211820",
	// Burnout Paradise: The Ultimate Box
	"451546473801187348": "24740",
	// Satisfactory
	"572456126872944651": "526870",
	// tModLoader
	"1124349969906815007": "1281930",
	// Sid Meier's Civilization V
	"358421904601776138": "8930",
	// Tabletop Simulator
	"363408834095742976": "286160",
	// Portal 2
	"359508941782122496": "620",
	// Factorio
	"358422126602223616": "427520",
	// Borderlands 2
	"421150698168909834": "49520",
	// Borderlands 3
	"514228311661084682": "397540",
	// MapleStory
	"359510095811444736": "216150",
	// Plants vs. Zombies: Game of the Year
	"498985095378632704": "3590",
	// Celeste
	"454814894596816907": "504230",
	// Sid Meier's Civilization VI
	"363413834301571072": "289070",
	// Infinifactory
	"1124355067311571039": "300570",
	// EDGE
	"1124358138074779758": "38740",
	// Kerbal Space Program
	"363429406376722442": "220200",
	// Sid Meier's Civilization: Beyond Earth
	"425443404277743616": "65980",
	// TODO Horizon Zero Dawn™ Complete Edition
	// "TODO": "1151640",
	// PAYDAY 2
	"364785249202208768": "218620",
	// Palworld
	"1197827812623650866": "1623730",
	// SpaceChem
	"504046850584739850": "92800",
	// Kingdom Two Crowns
	"1129504257700282548": "701160",
	// Opus Magnum
	"1124352771492167731": "558990",
	// Robocraft
	"363409532480913408": "301520",
	// Garry's Mod
	"356879032584896512": "4000",
	// LEGO® Star Wars™: The Skywalker Saga
	"1129504202335469640": "920210",
	// Jurassic World Evolution
	"456144990930862086": "648350",
	// Frostpunk
	"443157248710148117": "323190",
	// Last Call BBS
	"1124359396437278761": "1511780",
	// Bloons TD 6
	"614380482620293151": "960090",
	// Medieval Engineers
	"457619737535447060": "333950",
	// LEGO® Jurassic World
	"425450411391057950": "352400",
	// Peglin
	"1124352443015254046": "1296610",
	// Mirror's Edge
	"450145899063017492": "17410",
	// Dungeon Defenders
	"488858705836900355": "65800",
	// Time Clickers
	"479894252726517760": "385770",
	// Dungeons of Dredmor
	"1124354565379211354": "98800",
	// Portal
	"363414173457186826": "400",
	// DC Universe Online
	"451543277385023488": "24200",
	// The Escapists
	"451429730416197669": "298630",
	// EXAPUNKS
	"1124355169287680030": "716490",
	// Dota 2
	"356875988589740042": "570",
	// TODO Snapshot
	// "TODO": "204220",
	// Jurassic World Evolution 2
	"1124352010850938890": "1244460",
	// HELLDIVERS™ 2
	"1205090671527071784": "553850",
	// Stellaris
	"363408909962182683": "281990",
	// Beat Saber
	"451991967149195264": "620980",
	// Cookie Clicker
	"1124351789895004280": "1454400",
	// Baldur's Gate 3
	"1137125502985961543": "1086940",
	// Mortal Kombat 11
	"1124353053970157578": "976310",
	// Tiny Tina's Wonderlands
	"1124352088042917969": "1286680",
	// Among Us
	"477175586805252107": "945360",
	// DEATH STRANDING
	"734286565114904586": "1190460",
	// LEGO® The Lord of the Rings™
	"1124351999073333439": "214510",
	// SHENZHEN I/O
	"1124353413296173229": "504210",
	// The LEGO® Movie - Videogame
	"425439950553481216": "267530",
	// Castle Crashers
	"363429462076817408": "204360",
	// TODO Control Ultimate Edition
	// "TODO": "870780",
	// Slime Rancher
	"363411395854991400": "433340",
	// Keep Talking and Nobody Explodes
	"426531471520563211": "341800",
	// Kerbal Space Program 2
	"1124353025650217030": "954850",
	// Space Engineers
	"359508404034600990": "244850",
	// Yoku's Island Express
	"1124355828502249592": "334940",
	// Gunpoint
	"486705198576828416": "206190",
	// Atlas Reactor
	"451545283784998934": "402570",
	// Stardew Valley
	"359509387670192128": "413150",
	// Creeper World 4
	"1124353503352074240": "848480",
	// The Witness
	"425441014292152320": "210970",
	// TODO Silicon Zeroes
	// "TODO": "684270",
	// Creeper World 3: Arc Eternal
	"496560583521468426": "280220",
	// TODO Taiji
	// "TODO": "1141580",
	// Torchlight II
	"425777164361793547": "200710",
	// Stacklands
	"1124352074927325257": "1948280",
	// Fallout: New Vegas
	"359509858728542208": "22380",
	// Enter the Gungeon
	"363413202090065920": "311690",
	// Bridge Constructor Portal
	"425442712095948800": "684410",
	// Blacklight: Retribution
	"495079795252527104": "209870",
	// The Talos Principle
	"425441094482919464": "257510",
	// Goat Simulator
	"425778678723510302": "265930",
	// SEUM: Speedrunners from Hell
	"425442824134328320": "457210",
	// Unturned
	"351821143981817856": "304930",
	// RollerCoaster Tycoon: Deluxe
	"455864514185920523": "285310",
	// Slime Rancher 2
	"1124351953024077845": "1657630",
	// TODO Stacking
	// "TODO": "115110",
	// Tribes: Ascend
	"457549567538495489": "17080",
	// Ghostwire: Tokyo
	"1124352677288095844": "1475810",
	// TODO Gloomhaven
	// "TODO": "780290",
	// Poly Bridge 2
	"1124352061660729344": "1062160",
	// Stray
	"1124351702972256328": "1332010",
	// MOLEK-SYNTEZ
	"1124358291653410929": "1168880",
	// while True: learn()
	"1124353823482335302": "619150",
	// TODO Stone Story RPG
	// "TODO": "603390",
	// Worms Revolution
	"451539172763762688": "200170",
	// Magicka
	"426525158627606568": "42910",
	// TIS-100
	"504079649702412295": "370360",
	// The Ship
	"1124353183670612109": "2400",
	// The Escapists 2
	"363414712186306560": "641990",
	// Universe Sandbox Legacy
	"1124358490429870132": "72200",
	// TODO Sid Meier's Ace Patrol: Pacific Skies
	// "TODO": "244090",
	// Uplink
	"504085139983433774": "1510",
	// RollerCoaster Tycoon 3: Platinum!
	"461439083894407178": "2700",
	// Star Trek Online
	"448384255131779073": "9900",
	// For The King
	"451540626270584833": "527230",
	// E.Y.E: Divine Cybermancy
	"505129908562034716": "91700",
	// SEGA Mega Drive & Genesis Classics
	"452099265230274571": "34270",
	// Sid Meier's Railroads!
	"504033484919144452": "7600",
	// The Elder Scrolls V: Skyrim
	"359507724196773888": "72850",
	// TODO Portal Reloaded
	// "TODO": "1255980",
	// TODO Vox
	// "TODO": "252770",
	// TODO Circuits
	// "TODO": "282760",
	// TODO Edge of Space
	// "TODO": "238240",
	// Geometry Dash
	"356942674672091136": "322170",
	// TODO Letter Quest: Grimm's Journey Remastered
	// "TODO": "373970",
	// GNOG
	"1124358220387979314": "290510",
	// TODO Trine 2
	// "TODO": "35720",
	// Wasteland 3
	"1124352240216453160": "719040",
	// TODO Krater
	// "TODO": "42170",
	// Unpacking
	"1129504205820928041": "1135690",
	// Rhythm Doctor
	"1124352412841427054": "774181",
	// TODO DEATH STRANDING DIRECTOR'S CUT
	// "TODO": "1850570",
	// The Bridge
	"1124358987786240050": "204240",
	// Balatro
	"1209665818464358430": "2379780",
	// Universe Sandbox
	"443156067434889236": "230290",
	// TODO The Sun and Moon
	// "TODO": "321560",
	// TODO BIT.TRIP BEAT
	// "TODO": "63700",
	// The Elder Scrolls IV: Oblivion
	"504074409628401690": "22330",
	// Aseprite
	"504605035162763294": "431730",
	// TODO DubWars
	// "TODO": "290000",
	// Alien Swarm
	"449531408730423296": "630",
	// Holy Potatoes! A Weapon Shop?!
	"1124355336233570344": "363600",
	// TODO Letter Quest: Grimm's Journey
	// "TODO": "328730",
	// TODO Type:Rider
	// "TODO": "258890",
	// A Way Out
	"1124354002495230122": "1222700",
	// Double Action: Boogaloo
	"450292948911915008": "317360",
	// Terra Nil
	"1124355145015251034": "1593030",
	// Bit Heroes
	"451542845703061524": "666860",
	// Manifold Garden
	"1124355120415658065": "473950",
	// Plague Inc: Evolved
	"406645878980476928": "246620",
	// Half-Life 2
	"359510373361254400": "220",
	// TODO Prime Mover
	// "TODO": "693700",
	// Counter-Strike 2
	"1158877933042143272": "730",
	// Q.U.B.E: Director's Cut
	"505496236548292648": "239430",
	// Half-Life
	"363430548028522496": "70",
	// 7 Billion Humans
	"1124354704755937371": "792100",
	// Vindictus
	"451541058497675294": "212160",
	// Card Hunter
	"466640524670009354": "293260",
	// Broforce
	"406645260987662366": "274190",
	// TODO Realm of the Mad God Exalt
	// "TODO": "200210",
	// Peggle Deluxe
	"498980232938651648": "3480",
	// Shoppe Keep
	"1124355505058496623": "381120",
	// Halo: The Master Chief Collection
	"653432003798106122": "976730",
	// TODO Sanctum
	// "TODO": "91600",
	// LEGO® MARVEL Super Heroes
	"460450424940396544": "249130",
	// Moss
	"1124355414046294096": "846470",
	// This Is the Police
	"425458210175188992": "443810",
	// Galaxy of Pen & Paper
	"1124360601909608488": "349790",
	// Toribash
	"428054001502650368": "248570",
	// Dead Island Definitive Edition
	"425442043616034816": "383150",
	// LEGO® Builder's Journey
	"1124354745759449098": "1544360",
	// TODO Thinking with Time Machine
	// "TODO": "286080",
	// Big Pharma
	"1124355360086573136": "344850",
	// PICO PARK
	"1124349979658571847": "1509960",
	// Bio Inc. Redemption
	"1124354164416327710": "612470",
	// Dorfromantik
	"1124351958250176592": "1455840",
	// Travellers Rest
	"1129504604736995328": "1139980",
	// Concrete Jungle
	"1124360629327777932": "400160",
	// Lead and Gold - Gangs of the Wild West
	"1124359124143067209": "42120",
	// I Expect You To Die
	"1124353491360567397": "587430",
	// Team Fortress 2
	"356888577310851072": "440",
	// Half-Life: Alyx
	"1124351756931977307": "546560",
	// Doodle God Blitz
	"1124354692550504552": "625430",
	// Dyson Sphere Program
	"1124351985051775036": "1366540",
	// UNO
	"428058887334264832": "470220",
	// TODO cheesequest
	// "TODO": "2100810",
	// Mini Motorways
	"1124351951153410148": "1127500",
	// The Forest
	"363409179668512788": "242760",
	// Star Trek: Bridge Crew
	"1124353220253335563": "527100",
	// Kingdoms and Castles
	"406645058599780368": "569480",
	// TODO RUSH
	// "TODO": "38720",
	// No Man's Sky
	"443159611479031808": "275850",
	// Dying Light
	"363427839137153024": "239140",
	// TODO LEGO® Bricktales
	// "TODO": "1898290",
	// THE FINALS
	"1182713227491147776": "2073850",
	// United heist
	"1124353326344061029": "2119740",
	// TODO Portal with RTX
	// "TODO": "2012840",
	// SimplePlanes
	"451549534993252362": "397340",
	// 5D Chess With Multiverse Time Travel
	"1124352421007736893": "1349230",
	// Potion Craft: Alchemist Simulator
	"1129504263014457374": "1210320",
	// TODO Titanfall® 2
	// "TODO": "1237970",
	// TODO Screeps: World
	// "TODO": "464350",
	// Scribblenauts Unlimited
	"425439683938353162": "218680",
	// A Dance of Fire and Ice
	"1129504116796837939": "977950",
	// Fallen Earth Classic
	"1129505192090550303": "113420",
	// TODO Ironclad Tactics
	// "TODO": "226960",
	// SUPERHOT VR
	"451544150756556810": "617830",
	// BalanCity
	"1124359640415744070": "462680",
	// Bitburner
	"1124352151334957096": "1812820",
	// When Ski Lifts Go Wrong
	"1124356580104753322": "638000",
	// King Arthur's Gold
	"496845988154048541": "219830",
	// Backpack Hero
	"1124353455302127817": "1970580",
	// Raw Data
	"1124354499297956042": "436320",
	// Scythe: Digital Edition
	"1124352749816000563": "718560",
	// TODO StarMade
	// "TODO": "244770",
	// The Lab
	"451542394857455638": "450390",
	// Braid
	"496540068442537984": "26800",
	// Mirror's Edge™ Catalyst
	"451544331287789568": "1233570",
	// RollerCoaster Tycoon 2: Triple Thrill Pack
	"467979045179752448": "285330",
	// Deceit
	"376180386801123358": "466240",
	// Pinball Arcade
	"498980583096057905": "238260",
	// APB Reloaded
	"428055627030331402": "113400",
	// Fallout Shelter
	"363411364552638464": "588430",
	// Mini Metro
	"451549165361823769": "287980",
	// TODO Tangrams Deluxe
	// "TODO": "677720",
	// The Wizards
	"1124358564161540186": "586950",
	// Wild West Saga
	"1124356158384263248": "842150",
	// Human Resource Machine
	"1124353567000641536": "375820",
	// Hand of Fate 2
	"1124353137625546762": "456670",
	// Staxel
	"584069374462394368": "405710",
	// TODO ZACH-LIKE
	// "TODO": "1098840",
	// PAYDAY 3
	"1153359932255654019": "1272080",
	// Katamari Damacy REROLL
	"1124352712155353229": "848350",
	// Virtual Desktop
	"1209152433964580905": "382110",
	// Arma 2
	"1129504790477557820": "33900",
	// TODO TerraScape
	// "TODO": "2290000",
	// Loading Screen Simulator
	"451542208257064961": "652980",
	// TODO Toki Tori
	// "TODO": "38700",
	// TODO Dear Leader Prototype
	// "TODO": "285250",
	// The Elder Scrolls V: Skyrim Special Edition
	"359801269008859136": "489830",
	// TODO The Zachtronics Solitaire Collection
	// "TODO": "1988540",
	// Carcassonne: The Official Board Game
	"1129504811193221161": "598810",
	// TODO ChromaGun
	// "TODO": "408650",
	// TODO Party Hard Tycoon
	// "TODO": "513330",
	// VVVVVV
	"491427544134975498": "70300",
	// TODO Blender
	// "TODO": "365670",
	// TODO Starseed Pilgrim
	// "TODO": "230980",
	// theHunter Classic
	"425781960317861888": "253710",
	// Hatoful Boyfriend
	"496777244090302490": "310080",
	// Sid Meier's Civilization III: Complete
	"455584343792943104": "3910",
	// Tabletopia
	"1129504317460725761": "402560",
	// Townscaper
	"1124351956475981905": "1291340",
	// BONEWORKS
	"1124351856689303703": "823500",
	// Super Meat Boy
	"425777385103949834": "40800",
	// TODO Operator Overload
	// "TODO": "499140",
	// AdVenture Capitalist
	"363413365667921930": "346900",
	// Bloons Monkey City
	"1124352032246087821": "1252780",
	// Cloud Gardens
	"1124355935100489758": "1372320",
	// Kingdom: New Lands
	"425443637892218890": "496300",
	// Zero Caliber VR
	"1124352555934302300": "877200",
	// AdVenture Communist
	"451539129973604352": "462930",
	// The Sandbox Evolution
	"1124353616732500053": "466940",
	// Kingdom: Classic
	"406638362196312074": "368230",
	// LEGO® MARVEL's Avengers
	"425449323346657290": "405310",
	// TODO The Wizards - Dark Times
	// "TODO": "1103860",
	// 112 Operator
	"1124353043350179910": "793460",
	// 911 Operator
	"481103865559908372": "503560",
	// A Game of Thrones: The Board Game
	"1124355518606094477": "1075190",
	// TODO A-Tech Cybernetic VR
	// "TODO": "578210",
	// Aperture Desk Job
	"1124351966026420235": "1902490",
	// Archangel™: Hellfire
	"1124359380188541098": "553880",
	// ArcheAge
	"443155983670312969": "304030",
	// TODO Arkham Horror: Mother's Embrace
	// "TODO": "840210",
	// Arma 2: Operation Arrowhead
	"451546514943377438": "33930",
	// Back 4 Blood
	"1129504189991624774": "924970",
	// Bad Rats
	"496534375740080128": "34900",
	// TODO Beacon Pines
	// "TODO": "1269640",
	// Blood Rage: Digital Edition
	"1124358832508907652": "1015930",
	// Bloons TD Battles
	"363427491995713536": "444640",
	// Borderlands 2 VR
	"1124357030610743306": "991260",
	// Borderlands: The Pre-Sequel
	"406645950782636041": "261640",
	// Bridge Constructor
	"425442642680348692": "250460",
	// Brothers - A Tale of Two Sons
	"492112259770875921": "225080",
	// Car Mechanic Simulator 2018
	"426526355564265479": "645630",
	// TODO Cheap Golf
	// "TODO": "616520",
	// Cities: Skylines
	"356954111901433856": "255710",
	// Creed: Rise to Glory™
	"1124353904436592701": "804490",
	// Crying Suns
	"1124354501042782359": "873940",
	// TODO Eliza
	// "TODO": "716500",
	// Europa Universalis IV
	"363409417632481280": "236850",
	// Expeditions: Viking
	"1124355157208088766": "445190",
	// Fable Anniversary
	"461711977727918080": "288470",
	// Fallout
	"372825995084038144": "38400",
	// FTL: Faster Than Light
	"363414030188150801": "212680",
	// Guns of Icarus Online
	"390293569832878098": "209080",
	// TODO Hatoful Boyfriend: Holiday Star
	// "TODO": "377080",
	// Heat Signature
	"363413452976553984": "268130",
	// Hell Yeah!
	"1124357009731498074": "205230",
	// I, Zombie
	"1124360634600009748": "307230",
	// I’m not a Monster
	"1124357396450521208": "826600",
	// Idle Champions of the Forgotten Realms
	"363425133274333214": "627690",
	// INMOST
	"1124356382100041849": "938560",
	// Into the Breach
	"425749372332933120": "590380",
	// ISLANDERS
	"1129504289283391610": "1046030",
	// Jet Set Radio
	"1124352416935071824": "205950",
	// Job Simulator
	"489832887936483338": "448280",
	// Killing Floor 2
	"363409749175173120": "232090",
	// Killing Floor: Incursion
	"1124356502484959342": "690810",
	// Legend of Grimrock
	"1124354979772252350": "207170",
	// LEGOⓇ Indiana Jones™: The Original Adventures
	"1124353378579927100": "32330",
	// LEGO® Indiana Jones™ 2: The Adventure Continues
	"1124355623665029251": "32450",
	// LEGO® MARVEL Super Heroes 2
	"1124352186269319290": "647830",
	// LEGO® STAR WARS™: The Force Awakens
	"425443938271363095": "438640",
	// LEGO® The Hobbit™
	"425439134551900190": "285160",
	// LIMBO
	"451541581778911262": "48000",
	// Love Letter
	"1124354863644561418": "926520",
	// Manual Samuel - Anniversary Edition
	"1129505201666138223": "504130",
	// TODO Marvel Heroes Omega
	// "TODO": "226320",
	// Metro 2033
	"425442324495990784": "43110",
	// Metro Exodus
	"530454325214969866": "412020",
	// Metro Exodus Enhanced Edition
	"1124352162890264686": "1449560",
	// Minion Masters
	"448417850466762753": "489520",
	// Monaco
	"358421725139959808": "113020",
	// Mysterium
	"1124353453494386718": "556180",
	// NERTS! Online
	"1124354610648334547": "1131190",
	// Noita
	"1124351719950798848": "881100",
	// Obduction
	"425441688152965142": "306760",
	// Pandemic: The Board Game
	"1124355807727857765": "622440",
	// Party Hard
	"1124352478641664030": "356570",
	// Pathfinder Adventures
	"1124358086459674624": "480640",
	// Pathway
	"1124355465447489697": "546430",
	// TODO Peggle Nights
	// "TODO": "3540",
	// PGA TOUR 2K21
	"1124352117692452955": "1016120",
	// Pinball FX3
	"1124352903314952224": "442120",
	// Popup Dungeon
	"1124356118764867594": "349730",
	// Portal Knights
	"454600052904820736": "374040",
	// Portal: Revolution
	"1193313064892760194": "601360",
	// Q.U.B.E.
	"1124360196320415744": "203730",
	// Quantum Break
	"443158005798928384": "474960",
	// Ring of Pain
	"1124354447687041145": "998740",
	// Rustler
	"1124356933705547856": "844260",
	// S.K.I.L.L. - Special Force 2
	"451549001511075860": "286940",
	// Sairento VR
	"1124355458573029490": "555880",
	// Sentinels of the Multiverse
	"1124355151864541264": "337150",
	// Shoppe Keep 2
	"1124355578924380180": "684580",
	// TODO Sid Meier's Civilization IV
	// "TODO": "3900",
	// Sid Meier's Civilization IV: Beyond the Sword
	"1124353036341497979": "8800",
	// Sid Meier's Civilization IV: Colonization
	"1124355329312964749": "16810",
	// Sid Meier's Civilization IV: Warlords
	"1124357912287006741": "3990",
	// Slay the Spire
	"406644123832156160": "646570",
	// Small World
	"1124355167551242320": "235620",
	// Snakebird
	"1124359449172267018": "357300",
	// Sniper Elite 3
	"426525148892495882": "238090",
	// Splendor
	"1124353573434708018": "376680",
	// Spyro™ Reignited Trilogy
	"1124351995663368222": "996580",
	// State of Decay: Year-One
	"451539805860528128": "329430",
	// Stick Fight: The Game
	"488693576314650634": "674940",
	// Sunset Overdrive
	"1124352392801046608": "847370",
	// SUPERHOT
	"425458238595661854": "322500",
	// Supraland
	"1164638698244149388": "813630",
	// Surgeon Simulator: Experience Reality
	"1124354561835020400": "518920",
	// Surviving Mars
	"445996079352250368": "464920",
	// Swords of Gurrah
	"597860020935327787": "833090",
	// Talisman: Digital Edition
	"485857105278926848": "247000",
	// Terraforming Mars
	"1129504698848780449": "800270",
	// The Elder Scrolls III: Morrowind
	"451539197044719616": "22320",
	// The Long Dark
	"406638150857785344": "305620",
	// TODO The Lord of the Rings: Adventure Card Game - Definitive Edition
	// "TODO": "509580",
	// The Ship Single Player
	"1124358146681491599": "2420",
	// The Talos Principle 2
	"1170150600349073438": "835960",
	// The Walking Dead: Saints & Sinners
	"1124352314187202650": "916840",
	// This War of Mine
	"406646471098892298": "282070",
	// Ticket to Ride
	"492142885077123082": "108200",
	// Tricky Towers
	"451549293946470400": "437920",
	// Undertale
	"363409849859571722": "391540",
	// Vagante
	"1124352697466900591": "323220",
	// Wandersong
	"1124355043689254953": "530320",
	// Wargroove
	"1124352489727213808": "607050",
	// TODO Whispering Willows
	// "TODO": "288060",
	// Wizard of Legend
	"450024058348634112": "445980",
	// World of Goo
	"1124353946874560633": "22000",
	// YUR
	"1124355437135941763": "1188920",
};

interface Colors {
	primary: string;
	secondary: string;
}

export const GameStatus: React.FC<{
	status: StatusResponse;
}> = ({ status }) => {
	const gameId = GAME_MAP[status.application_id!];
	const [colors, setColors] = React.useState<Colors>({
		primary: "#000000",
		secondary: "#000000",
	});
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [imageWidth, setImageWidth] = React.useState(400);
	React.useLayoutEffect(() => {
		if (containerRef.current) {
			setImageWidth(containerRef.current.clientWidth);
		}
	}, [containerRef]);

	if (!gameId) return null; // Not a game we have info for, add simplified card later

	const steamLink = `https://store.steampowered.com/app/${gameId}/`;
	const coverImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId}/library_600x900_2x.jpg`;
	const largeImage = `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId}/header.jpg`;

	return (
		<motion.div
			key="game"
			layout
			ref={containerRef}
			initial={{ opacity: 0, x: -25 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -25 }}
			className="relative mt-8 border border-gray-500 border-solid shadow-md rounded-2xl w-96 group"
		>
			<motion.span
				className="absolute text-sm -top-6 left-2"
				initial={{ y: 15, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 1 }}
			>
				I'm currently playing:
			</motion.span>
			<motion.div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
				<div className="absolute top-0 left-0 translate-x-1">
					<SmoothSwapImage
						key={imageWidth}
						width={imageWidth}
						height={imageWidth}
						alt=""
						src={largeImage}
						className=""
						onLoad={async (e) => {
							await new Promise((resolve) => setTimeout(resolve, 250));
							const colors = await extractColors(
								coverImage,
								e.target as HTMLImageElement
							);
							const bestColors = getBestColors(colors, Color("#f0b6b6"), 2);
							setColors({
								primary: bestColors.primary.hex(),
								secondary: bestColors.secondary.hex(),
							});
						}}
					/>
				</div>
			</motion.div>
			<div className="flex flex-row items-stretch justify-start gap-2 p-2 transition-colors duration-500 bg-white bg-opacity-60 backdrop-blur-xl rounded-2xl group-hover:bg-opacity-70">
				{status.assets ? (
					<RichImages status={status} />
				) : (
					<SmoothSwapImage
						alt={status.name}
						width={64}
						height={64}
						src={coverImage}
						className="rounded-lg shadow-md"
					/>
				)}
				<div className="flex flex-col justify-start min-w-0 grow">
					<AnimatePresence mode="popLayout">
						<motion.a
							key={status.name}
							initial={{
								x: -10,
								opacity: 0,
							}}
							animate={{
								x: 0,
								color: colors.secondary,
								opacity: 1,
							}}
							exit={{
								x: 10,
								opacity: 0,
							}}
							style={{
								textShadow: "0px 0px 3px white",
							}}
							title={status.name}
							className="mr-8 -mb-1 overflow-hidden font-extrabold whitespace-nowrap text-ellipsis"
							target="_blank"
							href={steamLink}
						>
							{status.name}
						</motion.a>
						{status.details && (
							<motion.span
								initial={{
									x: -10,
									opacity: 0,
								}}
								animate={{
									x: 0,
									color: colors.primary,
									opacity: 1,
								}}
								exit={{
									x: 10,
									opacity: 0,
								}}
								style={{
									textShadow: "0px 0px 3px white",
								}}
								className="text-xs"
							>
								{status.details}
							</motion.span>
						)}
						{status.state && (
							<motion.span
								key={status.state}
								initial={{
									x: -10,
									opacity: 0,
								}}
								animate={{
									x: 0,
									color: colors.primary,
									opacity: 1,
								}}
								exit={{
									x: 10,
									opacity: 0,
								}}
								style={{
									textShadow: "0px 0px 3px white",
								}}
								className="text-xs"
							>
								{status.state}{" "}
								<AnimatePresence>
									{status.party && status.party.size && (
										<>
											(
											<motion.span
												key="current"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
											>
												{status.party.size[0]}
											</motion.span>{" "}
											of{" "}
											<motion.span
												key="max"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
											>
												{status.party.size[1]}
											</motion.span>
											)
										</>
									)}
								</AnimatePresence>
							</motion.span>
						)}
					</AnimatePresence>
					{status.timestamps && <Timer status={status} />}
				</div>
			</div>
		</motion.div>
	);
};

const RichImages: React.FC<{
	status: StatusResponse;
}> = ({ status }) => {
	const largeImage = `https://cdn.discordapp.com/app-assets/${status.application_id}/${status.assets.large_image}.png`;
	const smallImage = `https://cdn.discordapp.com/app-assets/${status.application_id}/${status.assets.small_image}.png`;

	return (
		<div className="relative">
			<Tooltip content={status.assets.large_text}>
				{(ref) => (
					<SmoothSwapImage
						ref={ref as any}
						alt={status.name}
						width={96}
						height={96}
						src={largeImage}
						className="rounded-lg shadow-md"
					/>
				)}
			</Tooltip>

			{status.assets.small_image && (
				<Tooltip content={status.assets.small_text}>
					{(ref) => (
						<div
							ref={ref as any}
							className="absolute z-10 overflow-hidden rounded-full -bottom-2 -right-2"
						>
							<SmoothSwapImage
								alt={status.name}
								width={32}
								height={32}
								src={smallImage}
								className="rounded-full"
							/>
						</div>
					)}
				</Tooltip>
			)}
		</div>
	);
};

const SmoothSwapImage = React.forwardRef<
	HTMLDivElement,
	{
		src: string;
		className: string;
		alt?: string;
		width?: number;
		height?: number;
		onLoad?: React.ReactEventHandler<HTMLImageElement>;
	}
>(({ src, onLoad, width, height, alt, className }, ref) => {
	const [oldSrc, setOldSrc] = React.useState(src);
	const [showOldImage, setShowOldImage] = React.useState(true);

	return (
		<div className="relative shrink-0" ref={ref}>
			<Image
				alt={alt}
				width={width}
				height={height}
				src={src}
				className={className}
				onLoad={(e) => {
					// Fade out old image
					setShowOldImage(false);
					onLoad?.(e);
				}}
			/>
			<AnimatePresence
				onExitComplete={() => {
					setOldSrc(src);
					// We set it to show old true right now, but this will actually be the new image, we just need to make sure it's ready
					setShowOldImage(true);
				}}
			>
				{showOldImage && (
					<motion.div
						initial={{
							opacity: 1,
						}}
						exit={{
							opacity: 0,
						}}
						className="absolute top-0 bottom-0 left-0 right-0 z-10"
					>
						<Image
							alt=""
							width={width}
							height={height}
							src={oldSrc}
							className={className}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
});

const Timer: React.FC<{
	status: StatusResponse;
}> = ({ status }) => {
	const elapsed = Math.max(Date.now() - status.timestamps.start, 0); // Clamp to 0 and total

	const [_, setRerender] = React.useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setRerender((old) => old + 1);
		}, 20);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col justify-end grow">
			<div className="flex flex-row justify-between">
				<span className="text-xs">{msToMinutesAndSeconds(elapsed)}</span>
			</div>
		</div>
	);
};

function msToMinutesAndSeconds(ms: number) {
	const hours = Math.floor(ms / 3600000);
	const minutes = padLeft(Math.floor((ms % 3600000) / 60000).toString(), 2);
	const seconds = padLeft(Math.floor((ms % 60000) / 1000).toString(), 2);
	return `${hours}:${minutes}:${seconds}`;
}

function padLeft(str: string, size: number) {
	let s = str;
	while (s.length < size) s = "0" + s;
	return s;
}
