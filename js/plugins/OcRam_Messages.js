//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Core.js        (will be embedded in all of my plugins)
//=============================================================================
/* DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS SOFTWARE AS YOUR OWN!     *
 * Copyright(c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com         */
"use strict"; var ShaderTilemap = ShaderTilemap || false; var Imported = Imported || {}; var Yanfly = Yanfly || {}; // In case there's no Yanfly plugins in use
if (!Imported.OcRam_Core) { // OcRam_Core has only the functionality which are used widely in all OcRam plugins...
    Game_Interpreter.prototype.event = function () { /* Get Game_Event in event editor like: this.event(); */ return ($gameMap) ? $gameMap.event(this._eventId) : null; };
    Game_Map.prototype.getEventsByName = function (event_name) { /* Get Game_Map events by name */ return this._events.filter(function (ev) { return ev.event().name == event_name; }); };
    Game_Event.prototype.getComments = function () { /* Returns all comments + commandIndex from Game_Event as Array */ if (this._erased || this._pageIndex < 0) return []; var comments = []; var i = 0; this.list().forEach(function (p) { if (p.code == 108) { p.commandIndex = i; comments.push(p); } i++; }); return comments; };
    Game_Event.prototype.getStringComments = function () { /* Returns all comments from Game_Event as String Array */ if (this._erased || this._pageIndex < 0) return []; var comments = []; this.list().filter(function (c) { return c.code == 108; }).forEach(function (p) { p.parameters.forEach(function (s) { comments.push(s); }); }); return comments; };
    ImageManager.loadOcRamBitmap = function (filename, hue) {  /* Load bitmap from ./img/ocram folder */ return this.loadBitmap('img/ocram/', filename, hue, false); };
    Imported.OcRam_Core = true; var OcRam_Core = OcRam_Core || function () { /* OcRam core class */ this.initialize.apply(this, arguments); };
    OcRam_Core.prototype.initialize = function () { /* Initialize OcRam core */ this.name = "OcRam_Core"; this.version = "1.05"; this.twh = [48, 48]; this.twh50 = [24, 24]; this.radian = Math.PI / 180; this._isIndoors = false; this._screenTWidth = Graphics.width / 48; this._screenTHeight = Graphics.height / 48; this.plugins = []; this._menuCalled = false; this.Scene_Map_callMenu = Scene_Map.prototype.callMenu; this.Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded; };
    OcRam_Core.prototype.debug = function () { /* Debug core? console.log("OcRam_Core", arguments); */ };
    OcRam_Core.prototype.getBoolean = function (s) { /* Get 'safe' boolean */ if (!s) return false; s = s.toString().toLowerCase(); return (s == "true" && s != "0") ? true : false; };
    OcRam_Core.prototype.getArray = function (a, b) { /* Get plugin param array */ return a ? eval(a) : b || []; };
    OcRam_Core.prototype.getFloat = function (n) { /* Get float */ return isNaN(n - parseFloat(n)) ? 0 : parseFloat(n); };
    OcRam_Core.prototype.regulateRGBG = function (obj) { /* Regulate RGBG value (used in tints) */ obj.Red = parseInt(obj.Red).clamp(-255, 255); obj.Green = parseInt(obj.Green).clamp(-255, 255); obj.Blue = parseInt(obj.Blue).clamp(-255, 255); obj.Gray = parseInt(obj.Gray).clamp(-255, 255); return obj; };
    OcRam_Core.prototype.regulateHexRGBA = function (p) { /* Regulate HEX RGBA value */ if (p.substr(0, 1) !== "#") p = "#" + p; if (p.length == 7) p = p + "ff"; return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(p)[0] || "#ffffffff"; }
    OcRam_Core.prototype.getJSON = function (s) { /* Get 'safe' JSON */ try { return JSON.parse(s); } catch (ex) { return null; } };
    OcRam_Core.prototype.getJSONArray = function (a) { /* Get 'safe' JSON Array */ var tmp = []; if (a) { OcRam.getArray(a, []).forEach(function (s) { tmp.push(OcRam.getJSON(s)); }); } return tmp; };
    OcRam_Core.prototype.followers = function () { /* Only a shortcut to $gamePlayer._followers.visibleFollowers(); */ return $gamePlayer ? $gamePlayer._followers.visibleFollowers() : []; };
    OcRam_Core.prototype.setIndoorsFlag = function () { /* Set indoors flag - Each plugin will call this when needed */ if (DataManager.isEventTest()) return; if ($dataMap.meta["indoors"] !== undefined) { this.debug("Indoors meta tag found in MAP note field!", $dataMap.meta); this._isIndoors = true; } else { if ($dataTilesets[$dataMap.tilesetId].meta["indoors"] !== undefined) { this.debug("Indoors meta tag found in TILESET note field!", $dataTilesets[$dataMap.tilesetId].meta); this._isIndoors = true; } else { this.debug("Indoors meta tag was NOT found!", undefined); this._isIndoors = false; } } };
    OcRam_Core.prototype.isIndoors = function () { /* Get indoors flag */ return this._isIndoors; };
    OcRam_Core.prototype.runCE = function (pCE_Id) { /* Run common event */ if ($gameTemp.isCommonEventReserved()) { var tmpId = pCE_Id; var tc = this; setTimeout(function () { tc.runCE(tmpId); }, 17); } else { $gameTemp.reserveCommonEvent(pCE_Id); } };
    OcRam_Core.prototype.extendMethod = function (c, b, cb) { /* Extend/override any method */ c[b] = function () { return cb.apply(this, arguments); }; };
    OcRam_Core.prototype.extendProto = function (c, b, cb) { /* Extend/override any proto */ c.prototype[b] = function () { return cb.apply(this, arguments); }; };
    OcRam_Core.prototype.addPlugin = function (name, version) { /* Initialize new OcRam plugin */ this[name] = {}; var new_plugin = this[name]; Imported["OcRam_" + name] = true; this.plugins.push(name); this[name]._menuCalled = false; new_plugin.name = name; new_plugin.version = version; new_plugin.parameters = PluginManager.parameters("OcRam_" + new_plugin.name); if (this.getBoolean(new_plugin.parameters["Debug mode"])) { new_plugin.debug = function () { var args = [].slice.call(arguments); args.unshift("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", ":"); console.log.apply(console, args); }; console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Debug mode:", "Enabled"); console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Parameters:", new_plugin.parameters); } else { new_plugin.debug = function () { }; } var oc = this; new_plugin.extend = function (c, b, cb) { var cb_name = c.name + "_" + b; if (c[b]) { this[cb_name] = c[b]; oc.extendMethod(c, b, cb); } else { this[cb_name] = c.prototype[b]; oc.extendProto(c, b, cb); } }; }; var OcRam = new OcRam_Core(); // Create new OcRam_Core! (Below aliases)
    Scene_Map.prototype.callMenu = function () { /* Menu called? */ OcRam.Scene_Map_callMenu.call(this); OcRam.debug("Menu called:", true); OcRam._menuCalled = true; OcRam.plugins.forEach(function (p) { OcRam[p]._menuCalled = true; }); };
    Scene_Map.prototype.onMapLoaded = function () { /* Set and get tile dimensions and indoors flag */ OcRam.Scene_Map_onMapLoaded.call(this); if (!OcRam._menuCalled) { OcRam.twh = [$gameMap.tileWidth(), $gameMap.tileHeight()]; OcRam.twh50 = [OcRam.twh[0] * 0.5, OcRam.twh[1] * 0.5]; OcRam._screenTWidth = Graphics.width / OcRam.twh[0]; OcRam._screenTHeight = Graphics.height / OcRam.twh[1]; OcRam.debug("Tile w/h:", OcRam.twh); OcRam.setIndoorsFlag(); OcRam.menuCalled = false; } };
    CanvasRenderingContext2D.prototype.line = function (x1, y1, x2, y2) { /* Draw line to canvas context */ this.beginPath(); this.moveTo(x1, y1); this.lineTo(x2, y2); this.stroke(); };
    Game_Map.prototype.adjustX_OC = function (x) { /* Optimized core adjustX */ if (this.isLoopHorizontal()) { if (x < this._displayX - (this.width() - this.screenTileX()) * 0.5) { return x - this._displayX + $dataMap.width; } else { return x - this._displayX; } } else { return x - this._displayX; } };
    Game_Map.prototype.adjustY_OC = function (y) { /* Optimized core adjustY */ if (this.isLoopVertical()) { if (y < this._displayY - (this.height() - this.screenTileY()) * 0.5) { return y - this._displayY + $dataMap.height; } else { return y - this._displayY; } } else { return y - this._displayY; } };
    Game_CharacterBase.prototype.screenX_OC = function () { /* Optimized core screenX */ return Math.round($gameMap.adjustX_OC(this._realX) * OcRam.twh[0] + OcRam.twh50[0]); };
    Game_CharacterBase.prototype.screenY_OC = function () { /* Optimized core screenY */ return Math.round($gameMap.adjustY_OC(this._realY) * OcRam.twh[1] + OcRam.twh50[0] - this.shiftY() - this.jumpHeight()); };
} if (parseFloat(OcRam.version) < 1.05) alert("OcRam core v1.05 is required!");

//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Messages.js
//=============================================================================

"use strict"; if (!Imported || !Imported.OcRam_Core) alert('OcRam_Core.js ' +
    'is required!'); OcRam.addPlugin("Messages", "1.03");

/*:
 * @plugindesc v1.03 This plugin is for showing various NON-interrupting fading messages.
 * PLUGIN NAME MUST BE OcRam_Messages.js
 * @author OcRam
 * 
 * @param Use automated messages
 * @type boolean
 * @desc Use automated messages
 * @default true
 * 
 * @param Gain item
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when gain items.
 * @default {"MessageType":"0","Message":"{$name} +{$value}","ForeColor":"#f0f0ff","OutlineColor":"#000080","SE":"{\"SoundName\":\"Cursor1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 * 
 * @param Lose item
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when lose items.
 * @default {"MessageType":"0","Message":"{$name} {$value}","ForeColor":"#ffaaaa","OutlineColor":"#800000","SE":"{\"SoundName\":\"Cursor1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Gain gold
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when gain gold.
 * @default {"MessageType":"0","Message":"Gold: +{$value}","ForeColor":"#f0f000","OutlineColor":"#404000","SE":"{\"SoundName\":\"Coin\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 * 
 * @param Lose gold
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when lose gold.
 * @default {"MessageType":"0","Message":"Gold: {$value}","ForeColor":"#ffaaaa","OutlineColor":"#800000","SE":"{\"SoundName\":\"Coin\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 * 
 * @param Gain HP
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when gain HP.
 * @default {"MessageType":"0","Message":"HP: +{$value}","ForeColor":"#aaffaa","OutlineColor":"#008000","SE":"{\"SoundName\":\"Cursor1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Lose HP
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when lose HP.
 * @default {"MessageType":"0","Message":"HP: {$value}","ForeColor":"#ffaaaa","OutlineColor":"#800000","SE":"{\"SoundName\":\"Cursor1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Gain MP
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when gain MP.
 * @default {"MessageType":"0","Message":"MP: +{$value}","ForeColor":"#aaffaa","OutlineColor":"#008000","SE":"{\"SoundName\":\"Cursor1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Lose MP
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when lose MP.
 * @default {"MessageType":"0","Message":"MP: {$value}","ForeColor":"#ffaaaa","OutlineColor":"#800000","SE":"{\"SoundName\":\"Cursor1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 * 
 * @param Gain exp
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when gain experience.
 * @default {"MessageType":"0","Message":"+{$value} xp","ForeColor":"#ffeeaa","OutlineColor":"#806000","SE":"{\"SoundName\":\"Cursor1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Lose exp
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when lose experience.
 * @default {"MessageType":"0","Message":"{$value} xp","ForeColor":"#ffaaaa","OutlineColor":"#800000","SE":"{\"SoundName\":\"Cursor1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Level up
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when gain level up.
 * @default {"MessageType":"1","Message":"Level up: {$name} (lv{$value})","ForeColor":"#ffffff","OutlineColor":"#000000","SE":"{\"SoundName\":\"Applause1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Level down
 * @parent Use automated messages
 * @type struct<MessageData>
 * @desc Message struct when level down.
 * @default {"MessageType":"2","Message":"Level down: {$name} (lv{$value})","ForeColor":"#ffaaaa","OutlineColor":"#800000","SE":"{\"SoundName\":\"Bell1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 * 
 * @param Use Yanfly QuestJournal
 * @type boolean
 * @desc Use automated messages
 * @default true
 * 
 * @param Quest added
 * @parent Use Yanfly QuestJournal
 * @type struct<MessageData>
 * @desc Message struct when quest is added.
 * @default {"MessageType":"1","Message":"New quest: {$name}","ForeColor":"#ffffff","OutlineColor":"#000000","SE":"{\"SoundName\":\"Book1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 * 
 * @param Quest updated
 * @parent Use Yanfly QuestJournal
 * @type struct<MessageData>
 * @desc Message struct when hide / show objective is used.
 * @default {"MessageType":"3","Message":"{$name}, {$value}","ForeColor":"#aaaaff","OutlineColor":"#000080","SE":"{\"SoundName\":\"Book1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Quest completed
 * @parent Use Yanfly QuestJournal
 * @type struct<MessageData>
 * @desc Message struct when quest is completed.
 * @default {"MessageType":"1","Message":"Quest completed: {$name}","ForeColor":"#aaffaa","OutlineColor":"#008000","SE":"{\"SoundName\":\"Applause1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 * 
 * @param Quest failed
 * @parent Use Yanfly QuestJournal
 * @type struct<MessageData>
 * @desc Message struct when quest is failed.
 * @default {"MessageType":"2","Message":"Quest failed: {$name}","ForeColor":"#ffaaaa","OutlineColor":"#800000","SE":"{\"SoundName\":\"Bell1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 * 
 * @param Quest objective failed
 * @parent Use Yanfly QuestJournal
 * @type struct<MessageData>
 * @desc Message struct when quest is failed.
 * @default {"MessageType":"2","Message":"{$name}, {$value} failed!","ForeColor":"#ffaaaa","OutlineColor":"#800000","SE":"{\"SoundName\":\"Bell1\",\"SoundVolume\":\"90\",\"SoundPitch\":\"100\",\"SoundPan\":\"0\"}"}
 *
 * @param Minor message struct
 * @type struct<MinorData>
 * @desc Message struct for minor messages.
 * @default {"OffsetY":"72","FontSize":"24","FontName":"GameFont","OutlineWidth":"3","FadeTime":"100"}
 *
 * @param Major1 message struct
 * @type struct<MajorData>
 * @desc Message struct for major 1 messages.
 * @default {"VerticalAlign":"1","OffsetY":"-(96 + messageHeight)","FontSize":"32","FontName":"GameFont","OutlineWidth":"6","FadeTime":"200"}
 *
 * @param Major2 message struct
 * @type struct<MajorData>
 * @desc Message struct for major 2 messages.
 * @default {"VerticalAlign":"1","OffsetY":"-(96 + messageHeight)","FontSize":"32","FontName":"GameFont","OutlineWidth":"6","FadeTime":"200"}
 * 
 * @param Major3 message struct
 * @type struct<MajorData>
 * @desc Message struct for major 3 messages.
 * @default {"VerticalAlign":"1","OffsetY":"-(96 + messageHeight)","FontSize":"32","FontName":"GameFont","OutlineWidth":"6","FadeTime":"200"}
 * 
 * @param Major4 message struct
 * @type struct<MajorData>
 * @desc Message struct for major 4 messages.
 * @default {"VerticalAlign":"1","OffsetY":"-(96 + messageHeight)","FontSize":"32","FontName":"GameFont","OutlineWidth":"6","FadeTime":"200"}
 *
 * @param Debug mode
 * @type boolean
 * @desc Write some events to console log (F8 or F12).
 * @default false
 *
 * @help
 * ----------------------------------------------------------------------------
 * Introduction                                      (Embedded OcRam_Core v1.5)
 * ============================================================================
 * Show simple messages on item/gold/exp gain/loss or more epic messages
 * on level ups / new/completed quests.
 * 
 * Minor examples: Gained/losed exp, item, hp, mp, gold etc...
 * Major 1 examples: level up, new quest, new area
 * Major 2 examples: level down, quest failed, game over
 * Major 3 examples: quest updated
 * Major 4 examples: quest completed, new chapter/episode
 * 
 * REQUIRED FOLLOWING GRAPHICS! WIDTH SHOULD BE SAME AS YOUR GAME RESOLUTION!
 *   ./img/pictures/major_message_bg1.png
 *   ./img/pictures/major_message_bg2.png
 *   ./img/pictures/major_message_bg3.png
 *   ./img/pictures/major_message_bg4.png
 * 
 * You may use following notations in message struct:
 *   {$value}   To reserve place for values (like gold, level, exp etc...)
 *   {$name}    To reserve place for names (like actor / quest)
 * 
 * You may also use JS (types: 0 = Minor, 1 = Major bg1, 2 = Major bg2 etc...)
 * 
 *   se_object = { name: 'Cursor1', volume: 90, pitch: 100, pan: 0, pos: 0 };
 *   $gameScreen.showMessage(
 *      message, color, outline_color, message_type, 
 *      se_object, font, font_size, fade
 *   );
 *   
 *   sfx = { name: 'Cursor1', volume: 90, pitch: 100, pan: 0, pos: 0 };
 *   $gameScreen.showMessage(
 *      "Hi!", sfx, 1, "#ffffff", 
 *      "#000000", "Chiller", "64"
 *   );
 *   
 * ----------------------------------------------------------------------------
 * Terms of Use
 * ============================================================================
 * Edits are allowed as long as "Terms of Use" is not changed in any way.
 *
 * NON-COMMERCIAL USE: Free to use with credits to 'OcRam'
 *
 * If you gain money with your game by ANY MEANS (inc. ads, crypto-mining,
 * micro-transactions etc..) it's considered as COMMERCIAL use of this plugin!
 *
 * COMMERCIAL USE: (Standard license: 5 EUR, No-credits license: 40 EUR)
 * Payment via PayPal (https://paypal.me/MarkoPaakkunainen), please mention
 * PLUGIN NAME(S) you are buying / ALL plugins and your PROJECT NAME(S).
 *
 * Licenses are purchased per project and standard license requires credits.
 * If you want to buy several licenses: Every license purhased will give you
 * discount of 2 EUR for the next license purchase until minimum price of
 * 2 EUR / license. License discounts can be used to any of my plugins!
 * ALL of my plugins for 1 project = 40 EUR (standard licenses)
 *
 * https://forums.rpgmakerweb.com/index.php?threads/ocram-messages.112899
 *
 * DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS SOFTWARE AS YOUR OWN!
 * Copyright (c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com
 *
 * ----------------------------------------------------------------------------
 * Version History
 * ============================================================================
 * 2019/09/03 v1.00 - Initial release
 * 2020/06/12 v1.01 - OcRam core v1.05 (requirement for all of my plugins)
 * 2020/06/18 v1.02 - YEP QuestJournal bug fixed (Credits to ShadowDragon)
 * 2021/02/02 v1.03 - Fixed bug where messages didn't show up after menu
 *                    Credits to: OpenTanget, id0 and 41728280
 */
/*
 * ----------------------------------------------------------------------------
 * RMMV CORE function overrides (destructive) are listed here
 * ============================================================================
 * - No overrides -
 */
/*~struct~MessageData:
 *
 * @param MessageType
 * @type select
 * @option [Not in use]
 * @value -1
 * @option Minor
 * @value 0
 * @option Major1
 * @value 1
 * @option Major2
 * @value 2
 * @option Major3
 * @value 3
 * @option Major4
 * @value 4
 * @desc Message type.
 * @default 0
 * 
 * @param Message
 * @type text
 * @desc Message shown to player. Use {$value}, {$name} for values to replace.
 * @default No caption: {$value} {$name}
 *
 * @param ForeColor
 * @type text
 * @desc Font fill color.
 * @default #ffffff
 * 
 * @param OutlineColor
 * @type text
 * @desc Font outline color.
 * @default #000000
 * 
 * @param SE
 * @type struct<SoundData>
 * @desc SE to play when this message is shown
 * @default {"SoundName":"Cursor1","SoundVolume":"90","SoundPitch":"100","SoundPan":"0"}
 *
 */
/*~struct~SoundData:
 *
 * @param SoundName
 * @type file
 * @dir audio/se
 * @desc SE to play when this message is shown
 * @default Cursor1
 *
 * @param SoundVolume
 * @type number
 * @desc SE volume
 * @default 90
 * 
 * @param SoundPitch
 * @type number
 * @desc SE pitch
 * @default 100
 * 
 * @param SoundPan
 * @type number
 * @desc SE pan
 * @default 0
 *
 */
/*~struct~MajorData:
 *
 * @param VerticalAlign
 * @type select
 * @option Top
 * @value 0
 * @option Center
 * @value 1
 * @option Bottom
 * @value 2
 * @desc Align this message to.
 * @default 1
 * 
 * @param OffsetY
 * @type text
 * @desc Y offset for this message in pixels. Example: -(96 + messageHeight)
 * @default -(96 + messageHeight)
 *
 * @param FontSize
 * @type number
 * @desc Font size for this message
 * @default 32
 *
 * @param FontName
 * @type text
 * @desc Font face/family name for this message.
 * @default GameFont
 * 
 * @param OutlineWidth
 * @type number
 * @desc Font outline width for this message.
 * @default 6
 *
 * @param FadeTime
 * @type number
 * @desc Fade time for this message.
 * @default 200
 *
 */
/*~struct~MinorData:
 *
 * @param OffsetY
 * @type number
 * @desc Y offset for minor message in pixels. Example: -(96 + messageHeight)
 * @default 48
 *
 * @param FontSize
 * @type number
 * @desc Font size of minor message
 * @default 24
 *
 * @param FontName
 * @type text
 * @desc Font face/family name
 * @default GameFont
 *
 * @param OutlineWidth
 * @type number
 * @desc Font outline width.
 * @default 3
 *
 * @param FadeTime
 * @type number
 * @desc Fade time for minor message.
 * @default 100
 *
 */

(function () {

    var _this = this;
    var _terminated = false;

    // ------------------------------------------------------------------------------
    // Plugin variables and parameters
    // ==============================================================================

    var _messageStructs = []; var _messageStruct = null;

    var _useAutomatedMessages = OcRam.getBoolean(this.parameters['Use automated messages']);

    var _gainItem = JSON.parse(this.parameters['Gain item']); regulateMessageStruct(_gainItem);
    var _loseItem = JSON.parse(this.parameters['Lose item']); regulateMessageStruct(_loseItem);
    var _gainGold = JSON.parse(this.parameters['Gain gold']); regulateMessageStruct(_gainGold);
    var _loseGold = JSON.parse(this.parameters['Lose gold']); regulateMessageStruct(_loseGold);
    var _gainExp = JSON.parse(this.parameters['Gain exp']); regulateMessageStruct(_gainExp);
    var _loseExp = JSON.parse(this.parameters['Lose exp']); regulateMessageStruct(_loseExp);
    var _gainHP = JSON.parse(this.parameters['Gain HP']); regulateMessageStruct(_gainHP);
    var _loseHP = JSON.parse(this.parameters['Lose HP']); regulateMessageStruct(_loseHP);
    var _gainMP = JSON.parse(this.parameters['Gain MP']); regulateMessageStruct(_gainMP);
    var _loseMP = JSON.parse(this.parameters['Lose MP']); regulateMessageStruct(_loseMP);
    var _gainLevel = JSON.parse(this.parameters['Level up']); regulateMessageStruct(_gainLevel);
    var _loseLevel = JSON.parse(this.parameters['Level down']); regulateMessageStruct(_loseLevel);

    var _useQuestJournal = OcRam.getBoolean(this.parameters['Use Yanfly QuestJournal']);
    var _questAdded = JSON.parse(this.parameters['Quest added']); regulateMessageStruct(_questAdded);
    var _questUpdated = JSON.parse(this.parameters['Quest updated']); regulateMessageStruct(_questUpdated);
    var _questCompleted = JSON.parse(this.parameters['Quest completed']); regulateMessageStruct(_questCompleted);
    var _questFailed = JSON.parse(this.parameters['Quest failed']); regulateMessageStruct(_questFailed);
    var _questObjFailed = JSON.parse(this.parameters['Quest objective failed']); regulateMessageStruct(_questObjFailed);

    _messageStruct = JSON.parse(this.parameters['Minor message struct']); regulateMinorStruct(_messageStruct);
    _messageStruct = JSON.parse(this.parameters['Major1 message struct']); regulateMajorStruct(_messageStruct);
    _messageStruct = JSON.parse(this.parameters['Major2 message struct']); regulateMajorStruct(_messageStruct);
    _messageStruct = JSON.parse(this.parameters['Major3 message struct']); regulateMajorStruct(_messageStruct);
    _messageStruct = JSON.parse(this.parameters['Major4 message struct']); regulateMajorStruct(_messageStruct);

    var _minorMessages = null; var _majorMessages = null; // Message containers
    var _messagesTurnedOff = false; var _halfScreen = 0;

    var _preCalcedYOffset = [0, 0, 0, 0, 0];

    // ------------------------------------------------------------------------------
    // New 'minor' text layer sprite
    // ==============================================================================
    var _processingMinorMessage = false; var _preCalcMinorHeight = parseInt(_messageStructs[0].FontSize) + 12;
    var _preCalcNewMsgLimit = parseInt(_messageStructs[0].FontSize) + 4;
    if (_preCalcNewMsgLimit > (_messageStructs[0].FadeTime - 12)) _preCalcNewMsgLimit = _messageStructs[0].FadeTime - 12;

    function Minor_Message_OC() {
        this.initialize.apply(this, arguments);
    }

    Minor_Message_OC.prototype = Object.create(Sprite.prototype);
    Minor_Message_OC.prototype.constructor = Minor_Message_OC;

    Minor_Message_OC.prototype.initialize = function (create_bitmap) {

        Sprite.prototype.initialize.call(this);

        this._maxFrames = _messageStructs[0].FadeTime || 100;
        this._framesPreCalculated = this._maxFrames * 0.33;
        this.x = 0; this.y = 0;

        if (create_bitmap) {
            this._w = Graphics.boxWidth;
            this._h = Graphics.boxHeight;
            this.bitmap = new Bitmap(this._w, this._h);
            this._textQueue = [];
        } else {
            this._w = Graphics.boxWidth;
            this._h = _preCalcMinorHeight;
        }

    };

    Minor_Message_OC.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (this._textQueue) {
            if (this._textQueue.length > 0) {
                this.visible = true;
                this.updateAnimation();
            }
        }
    };

    Minor_Message_OC.prototype.writeText_OC = function (pstrText, text_color, b_color, font, font_size, sfx) {

        if (_terminated) return;

        if (_processingMinorMessage) {
            var tc = this; setTimeout(function () {
                tc.writeText_OC(pstrText, text_color, b_color, font, font_size, sfx);
            }, 33); return;
        }

        if (sfx) AudioManager.playSe(sfx); // playSe: command250

        var new_msg = new Minor_Message_OC();
        new_msg.bitmap = new Bitmap(this._w, _preCalcMinorHeight);

        new_msg.bitmap.fontFace = font || _messageStructs[0].FontName;
        new_msg.bitmap.fontSize = font_size || _messageStructs[0].FontSize;
        new_msg.bitmap.textColor = (text_color) ? text_color : "#ffffff";
        new_msg.bitmap.outlineColor = (b_color) ? b_color : "#000000";
        new_msg.bitmap.outlineWidth = _messageStructs[0].OutlineWidth || 3;
        
        new_msg._displayText = pstrText;
        new_msg._frameCount = 0;
        new_msg.y = 0; new_msg.x = 0;
        new_msg._event = $gamePlayer;

        var messageHeight = _preCalcMinorHeight; // Possibility to use in eval further on...
        _preCalcedYOffset[0] = eval(_messageStructs[0].OffsetY);

        _halfScreen = Graphics.boxWidth * 0.5;

        

        this.addChild(new_msg);
        this._textQueue.push(new_msg);

        _processingMinorMessage = true;

    };

    Minor_Message_OC.prototype.updateAnimation = function () {

        var msg = null;

        for (var i = 0; i < this._textQueue.length; i++) {

            msg = this._textQueue[i]; msg._frameCount++;

            if (msg._frameCount > msg._maxFrames) {
                msg.visible = false; this._textQueue.shift(); // First msg in is first out
                if (this.childrens) this.childrens.shift();
            } else {
                if (msg._frameCount > msg._framesPreCalculated) {
                    var calculated = msg._frameCount - msg._framesPreCalculated;
                    msg.opacity = 255 - (calculated / (msg._maxFrames - msg._framesPreCalculated) * 255);
                    msg.bitmap.clearRect(0, 0, Graphics.boxWidth, _preCalcMinorHeight);
                } else {
                    msg.opacity = 255;
                }

                msg.y = msg._event.screenY() - msg._frameCount - _preCalcedYOffset[0];
                msg.x = msg._event.screenX() - _halfScreen;

                if (msg._frameCount == _preCalcNewMsgLimit) _processingMinorMessage = false;

                msg.bitmap.drawText(msg._displayText, 0, 0, Graphics.boxWidth, _preCalcMinorHeight, "center");
                
            }

        }

    };

    Minor_Message_OC.prototype.hide = function () {
        this.visible = false;
    };

    // ------------------------------------------------------------------------------
    // New 'major' text layer sprite
    // ==============================================================================

    var _msgBG = [
        ImageManager.loadBitmap('img/pictures/', 'major_message_bg1', 0, true),
        ImageManager.loadBitmap('img/pictures/', 'major_message_bg2', 0, true),
        ImageManager.loadBitmap('img/pictures/', 'major_message_bg3', 0, true),
        ImageManager.loadBitmap('img/pictures/', 'major_message_bg4', 0, true)
    ];

    var _majorTextProcessing = null;

    function Major_Message_OC() {
        this.initialize.apply(this, arguments);
    }

    Major_Message_OC.prototype = Object.create(Sprite.prototype);
    Major_Message_OC.prototype.constructor = Major_Message_OC;

    Major_Message_OC.prototype.initialize = function () {
        Sprite.prototype.initialize.call(this);
        this._w = Graphics.boxWidth;
        this._h = Graphics.boxHeight;
        this._displayText = null;
        this.anchor.x = 0; this.anchor.y = 0;
        this.x = 0; this.y = 0;
        this.bitmap = new Bitmap(this._w, this._h);
    };

    Major_Message_OC.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (this._displayText) {
            this.visible = true;
            this.updateAnimation();
        } else {
            this.visible = false;
            _majorTextProcessing = null;
        }
    };

    Major_Message_OC.prototype.writeText = function (pstrText, text_color, b_color, type, font, font_size, fade, align, sfx) {

        _majorTextProcessing = true;

        if (sfx) AudioManager.playSe(sfx); // playSe: command250

        this._msgType = type;

        this._maxFrames = fade || _messageStructs[this._msgType].FadeTime;
        this._framesPreCalculated = this._maxFrames * 0.33;

        this._displayText = pstrText;

        this.bitmap.fontFace = font || _messageStructs[this._msgType].FontName;
        this.bitmap.fontSize = font_size || _messageStructs[this._msgType].FontSize;
        this.bitmap.textColor = (text_color) ? text_color : "#ffffff";
        this.bitmap.outlineColor = (b_color) ? b_color : "#000000";
        this.bitmap.outlineWidth = _messageStructs[this._msgType].OutlineWidth;

        this._frameCount = 0;
        this._bitmapHeight = _msgBG[type - 1].height;

        var messageHeight = this._bitmapHeight; // Possibility to use in eval further on...
        var thisAlign = align || _messageStructs[this._msgType].VerticalAlign;

        switch (thisAlign) {
            case 0: _preCalcedYOffset[this._msgType] = (0 + eval(_messageStructs[this._msgType].OffsetY)); break;
            case 2: _preCalcedYOffset[this._msgType] = (Graphics.boxHeight - this._bitmapHeight + eval(_messageStructs[this._msgType].OffsetY)); break;
            default: _preCalcedYOffset[this._msgType] = ((Graphics.boxHeight * 0.5) + (this._bitmapHeight * 0.5) + eval(_messageStructs[this._msgType].OffsetY)); break;
        }

    };

    Major_Message_OC.prototype.updateAnimation = function () {

        this._frameCount++;
        
        if (this._frameCount > this._maxFrames) {
            this._displayText = null;
        } else {
            if (this._frameCount > this._framesPreCalculated) {
                var calculated = this._frameCount - this._framesPreCalculated;
                this.opacity = 255 - (calculated / (this._maxFrames - this._framesPreCalculated) * 255);
            } else {
                this.opacity = 255;
            }

            this.bitmap.clearRect(0, 0, Graphics.boxWidth, Graphics.boxHeight);
            this.bitmap.blt(_msgBG[this._msgType - 1], 0, 0, this._w, this._bitmapHeight, 0, _preCalcedYOffset[this._msgType] + 3, this._w, this._bitmapHeight);
            this.bitmap.drawText(this._displayText, 0, _preCalcedYOffset[this._msgType], Graphics.boxWidth, this._bitmapHeight + 6, "center");
                
        }

    };

    Major_Message_OC.prototype.hide = function () {
        this.visible = false;
    };

    // ------------------------------------------------------------------------------
    // Aliases
    // ==============================================================================

    // Create text layer for info messages
    var OC_Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer;
    Scene_Base.prototype.createWindowLayer = function () {

        OC_Scene_Base_createWindowLayer.call(this);

        _minorMessages = new Minor_Message_OC(true);
        _minorMessages.z = 999;
        this._windowLayer.addChild(_minorMessages);

        _majorMessages = new Major_Message_OC();
        _majorMessages.z = 999;
        this._windowLayer.addChild(_majorMessages);

        setTimeout(function () {
            _processingMinorMessage = false;
            _majorTextProcessing = false;
            _terminated = false;
        }, 50);

    };



    var OC_Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function () {
        OC_Scene_Base_terminate.call(this);
        _terminated = true;
        setTimeout(function () {
            _processingMinorMessage = false;
            _majorTextProcessing = false;
        }, 50);
    };
    
    // ------------------------------------------------------------------------------
    // New methods
    // ==============================================================================
    Game_Screen.prototype.showMessage = function (msg, type, sfx, c1, c2, font, font_size, fade, align) {
        showTextOnScreen(msg, type, sfx, c1, c2, font, font_size, fade, align);
    };

    // ------------------------------------------------------------------------------
    // Plugin commands
    // ==============================================================================
    this.extend(Game_Interpreter, "pluginCommand", function (command, args) {
        switch (command) {
            case "messages": _this.debug("messages", args);
                if (args[0]) {
                    _messagesTurnedOff = (args[0].toLowerCase() == "off") ? true : false;
                } break;
            default:
                _this["Game_Interpreter_pluginCommand"].apply(this, arguments);
        }
    });

    // ------------------------------------------------------------------------------
    // USE AUTOMATED MESSAGES?
    // ==============================================================================
    if (_useAutomatedMessages) {

        this.extend(Game_Party, "gainGold", function (amount) {
            _this["Game_Party_gainGold"].apply(this, arguments);
            if (amount == 0) return; var msg = "";
            if (amount > 0) {
                msg = _gainGold.Message.replace("{$value}", amount); msg = msg.replace("{$name}", "");
                showTextOnScreen(msg, _gainGold.MessageType, parseSE(_gainGold.SE), _gainGold.ForeColor, _gainGold.OutlineColor);
            } else {
                msg = _loseGold.Message.replace("{$value}", amount); msg = msg.replace("{$name}", "");
                showTextOnScreen(msg, _loseGold.MessageType, parseSE(_loseGold.SE), _loseGold.ForeColor, _loseGold.OutlineColor);
            }
        });

        this.extend(Game_Party, "gainItem", function (item, amount, includeEquip) {
            _this["Game_Party_gainItem"].apply(this, arguments);
            if (item == undefined || item.name == undefined || amount === 0) return; var msg = "";
            if (amount > 0) {
                msg = _gainItem.Message.replace("{$name}", item.name);
                msg = msg.replace("{$value}", amount);
                showTextOnScreen(msg, _gainItem.MessageType, parseSE(_gainItem.SE), _gainItem.ForeColor, _gainItem.OutlineColor);
            } else {
                msg = _loseItem.Message.replace("{$name}", item.name);
                msg = msg.replace("{$value}", amount);
                showTextOnScreen(msg, _loseItem.MessageType, parseSE(_loseItem.SE), _loseItem.ForeColor, _loseItem.OutlineColor);
            }
        });

        this.extend(Game_Interpreter, "command315", function () {
            _this["Game_Interpreter_command315"].apply(this, arguments);
            var amount = this._params[4]; amount = (this._params[2] == 1) ? -amount : amount;
            if (amount == 0) return true; var msg = "";
            // _params[0] = variableId
            // _params[1] = actorId
            // _params[2] = 0 = inc // 1 = dec
            // _params[3] = variableId
            // _params[4] = amount
            // _params[5] = show levelup?
            var colors = [_gainExp.ForeColor, _gainExp.OutlineColor];
            var t = _gainExp.MessageType; var sfx = parseSE(_loseExp.SE);
            if (amount < 0) {
                colors = [_loseExp.ForeColor, _loseExp.OutlineColor];
                t = _loseLevel.MessageType;
                msg = _loseExp.Message.replace("{$value}", amount);
            } else {
                msg = _gainExp.Message.replace("{$value}", amount);
                sfx = parseSE(_gainExp.SE);
            } msg = msg.replace("{$name}", "");
            if (this._params[1] == 0) {
                showTextOnScreen(msg, 0, sfx, colors[0], colors[1]);
            } else {
                var tc = this; var actor_name = "no name?";
                $dataActors.forEach(function (actor) {
                    if (actor) {
                        if (actor.id == tc._params[1]) { actor_name = actor.name; return; }
                    }
                }); showTextOnScreen(actor_name + ": " + msg, t, colors[0], colors[1]);
            } return true;
        });

        this.extend(Game_Actor, "levelUp", function () {
            _this["Game_Actor_levelUp"].apply(this, arguments); var msg = "";
            msg = _gainLevel.Message.replace("{$name}", this._name);
            msg = msg.replace("{$value}", this._level);
            showTextOnScreen(msg, _gainLevel.MessageType, parseSE(_gainLevel.SE), _gainLevel.ForeColor, _gainLevel.OutlineColor);
        });

        this.extend(Game_Actor, "levelDown", function () {
            _this["Game_Actor_levelDown"].apply(this, arguments); var msg = "";
            msg = _loseLevel.Message.replace("{$name}", this._name);
            msg = msg.replace("{$value}", this._level);
            showTextOnScreen(msg, _loseLevel.MessageType, parseSE(_loseLevel.SE), _loseLevel.ForeColor, _loseLevel.OutlineColor);
        });

        this.extend(Game_Interpreter, "command311", function () {
            var value = this.operateValue(this._params[2], this._params[3], this._params[4]); var msg = "";
            if (value > 0) {
                msg = _gainHP.Message.replace("{$value}", value); msg = msg.replace("{$name}", "");
                showTextOnScreen(msg, _gainHP.MessageType, parseSE(_gainHP.SE), _gainHP.ForeColor, _gainHP.OutlineColor);
            } else {
                msg = _loseHP.Message.replace("{$value}", value); msg = msg.replace("{$name}", "");
                showTextOnScreen(msg, _loseHP.MessageType, parseSE(_loseHP.SE), _loseHP.ForeColor, _loseHP.OutlineColor);
            } return _this["Game_Interpreter_command311"].apply(this, arguments);
        });

        this.extend(Game_Interpreter, "command312", function () {
            var value = this.operateValue(this._params[2], this._params[3], this._params[4]); var msg = "";
            if (value > 0) {
                msg = _gainMP.Message.replace("{$value}", value); msg = msg.replace("{$name}", "");
                showTextOnScreen(msg, _gainMP.MessageType, parseSE(_gainMP.SE), _gainMP.ForeColor, _gainMP.OutlineColor);
            } else {
                msg = _loseMP.Message.replace("{$value}", value); msg = msg.replace("{$name}", "");
                showTextOnScreen(msg, _loseMP.MessageType, parseSE(_loseMP.SE), _loseMP.ForeColor, _loseMP.OutlineColor);
            } return _this["Game_Interpreter_command312"].apply(this, arguments);
        });

        // Change TP
        this.extend(Game_Interpreter, "command326", function () {
            return _this["Game_Interpreter_command326"].apply(this, arguments);
        });

        // Change State
        this.extend(Game_Interpreter, "command313", function () {
            return _this["Game_Interpreter_command313"].apply(this, arguments);
        });

    }

    // ------------------------------------------------------------------------------
    // Yanfly Quest Journal
    // ==============================================================================
    if (_useQuestJournal) {

        function updateQuestRoutine(_msgStruct, questId, objectiveId) {
            var n = $dataQuests[questId].name;
            n = n.replace(/\\I\[(\d+)\]/gi, '').trim();
            n = n.replace(/\\C\[(\d+)\]/gi, '').trim();
            var msg = _msgStruct.Message.replace("{$name}", n);
            if (objectiveId) {
                n = $dataQuests[questId].objectives[objectiveId];
                n = n.replace(/\\\\I\[(\d+)\]/gi, '').trim();
                n = n.replace(/\\\\C\[(\d+)\]/gi, '').trim();
                msg = msg.replace("{$value}", n);
            } else {
                msg = msg.replace("{$value}", "");
            }
            showTextOnScreen(
                msg, _msgStruct.MessageType, parseSE(_msgStruct.SE),
                _msgStruct.ForeColor, _msgStruct.OutlineColor
            );
        }

        this.extend(Game_System, "questAdd", function (questId) {
            updateQuestRoutine(_questAdded, questId, null);
            _this["Game_System_questAdd"].apply(this, arguments);
        });

        this.extend(Game_System, "questSetCompleted", function (questId) {
            updateQuestRoutine(_questCompleted, questId, null);
            _this["Game_System_questSetCompleted"].apply(this, arguments);
        });

        this.extend(Game_System, "questSetFailed", function (questId) {
            updateQuestRoutine(_questFailed, questId, null);
            _this["Game_System_questSetFailed"].apply(this, arguments);
        });

        // ------------------------------------------------------------------------------
        // Update quests...
        // ==============================================================================

        this.extend(Game_System, "questObjectivesShow", function (questId, objectiveId) {
            updateQuestRoutine(_questUpdated, questId, objectiveId);
            _this["Game_System_questObjectivesShow"].apply(this, arguments);
        });

        this.extend(Game_System, "questObjectivesHide", function (questId, objectiveId) {
            updateQuestRoutine(_questUpdated, questId, objectiveId);
            _this["Game_System_questObjectivesHide"].apply(this, arguments);
        });

        this.extend(Game_System, "questObjectivesComplete", function (questId, objectiveId) {
            updateQuestRoutine(_questUpdated, questId, objectiveId);
            _this["Game_System_questObjectivesComplete"].apply(this, arguments);
        });

        this.extend(Game_System, "questObjectivesFail", function (questId, objectiveId) {
            updateQuestRoutine(_questObjFailed, questId, objectiveId);
            _this["Game_System_questObjectivesFail"].apply(this, arguments);
        });

    }

    // ------------------------------------------------------------------------------
    // Utility functions
    // ==============================================================================

    function regulateMinorStruct(msg_struct) {
        msg_struct.OffsetY = msg_struct.OffsetY || -48;
        msg_struct.FontSize = msg_struct.FontSize || 24;
        msg_struct.FontSize = regulateValue(msg_struct.FontSize, 6, 256);
        msg_struct.FontName = msg_struct.FontName || 'GameFont';
        msg_struct.OutlineWidth = msg_struct.OutlineWidth || 3;
        msg_struct.OutlineWidth = regulateValue(msg_struct.OutlineWidth, 0, 64);
        msg_struct.FadeTime = msg_struct.FadeTime || 100;
        msg_struct.FadeTime = regulateValue(msg_struct.FadeTime, 16, 1000);
        _messageStructs.push(msg_struct);
    }

    function regulateMajorStruct(msg_struct) {
        msg_struct.VerticalAlign = msg_struct.VerticalAlign || 1;
        msg_struct.VerticalAlign = regulateValue(msg_struct.VerticalAlign, 0, 2);
        msg_struct.OffsetY = msg_struct.OffsetY || '-(48 + messageHeight)';
        msg_struct.FontSize = msg_struct.FontSize || 48;
        msg_struct.FontSize = regulateValue(msg_struct.FontSize, 6, 256);
        msg_struct.FontName = msg_struct.FontName || 'GameFont';
        msg_struct.OutlineWidth = msg_struct.OutlineWidth || 6;
        msg_struct.OutlineWidth = regulateValue(msg_struct.OutlineWidth, 0, 64);
        msg_struct.FadeTime = msg_struct.FadeTime || 200;
        msg_struct.FadeTime = regulateValue(msg_struct.FadeTime, 16, 1000);
        _messageStructs.push(msg_struct);
    }

    function regulateMessageStruct(msg_struct) {
        msg_struct.MessageType = msg_struct.MessageType || 0;
        msg_struct.MessageType = regulateValue(msg_struct.MessageType, -1, 4);
        msg_struct.Message = msg_struct.Message || "No caption: {$name} {$value}";
        msg_struct.ForeColor = msg_struct.ForeColor || '#ffffff';
        msg_struct.OutlineColor = msg_struct.OutlineColor || '#000000';
        msg_struct.SE = msg_struct.SE || { name: 'Cursor1', volume: 90, pitch: 0, pan: 0, pos: 0 };
    }

    function parseSE(se_struct) {
        var raw = JSON.parse(se_struct);
        var sfx = { name: raw.SoundName, volume: raw.SoundVolume, pitch: raw.SoundPitch, pan: raw.SoundPan, pos: 0 };
        return sfx;
    }

    function showTextOnScreen(text_to_show, type, sfx, text_color, b_color, font, font_size, fade, align) {

        if (type < 0 || _messagesTurnedOff) return; // No message is shown

        if (type > 0) {
            if (_majorMessages != null) {
                if (_majorTextProcessing) {
                    setTimeout(function () {
                        showTextOnScreen(text_to_show, type, sfx, text_color, b_color, font, font_size, fade, align);
                    }, 200); return;
                } _majorMessages.writeText(text_to_show, text_color, b_color, type, font, font_size, fade, align, sfx);
                _this.debug("showTextOnScreen (major)", [text_to_show, type, sfx, text_color, b_color, font, font_size, fade, align]);
            }
        } else {
            if (_minorMessages != null) {
                _minorMessages.writeText_OC(text_to_show, text_color, b_color, font, font_size, sfx);
                _this.debug("showTextOnScreen (minor)", [text_to_show, type, sfx, text_color, b_color, font, font_size, fade, align]);
            }
        }

    }

    function regulateValue(v, min, max) { // validate min - max
        return (v < min) ? min : (v > max) ? max : v;
    }

}.bind(OcRam.Messages)());