/*
 * ==============================================================================
 * ** Victor Engine MV - Action Dodge
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.09 > First release.
 *  v 1.01 - 2015.12.18 > Compatibility with Hit Formula.
 *  v 1.02 - 2015.12.21 > Compatibility with Basic Module 1.04.
 *  v 1.03 - 2016.02.15 > Compatibility with Battle Advantage.
 *  v 1.04 - 2016.03.03 > Improved code for better handling script codes.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Action Dodge'] = '1.04';

var VictorEngine = VictorEngine || {};
VictorEngine.ActionDodge = VictorEngine.ActionDodge || {};

(function() {

	VictorEngine.ActionDodge.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.ActionDodge.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Action Dodge', 'VE - Basic Module', '1.04');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Action Dodge', 'VE - Battle Advantage');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Action Dodge', 'VE - Hit Formula');
	};

	VictorEngine.ActionDodge.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ActionDodge.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * ------------------------------------------------------------------------------
 * @plugindesc v1.04 - Increase evasion against specific actions.
 * @author Victor Sant
 *
 * ------------------------------------------------------------------------------
 * @help
 * ------------------------------------------------------------------------------
 * This plugin have affects the Physical Evasion (eva), Magical Evasion (mev) and
 * Critical Evasion (cev).
 * ------------------------------------------------------------------------------
 * Actors, Classes, Enemies, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <skill dodge: x, type y>
 *  <skill dodge: x, type y%>
 *   Change the evasion against a Skill.
 *     x    : ID of the skill.
 *     type : evasion type. (eva, mev or cev)
 *     y    : change rate.
 *
 * ---------------
 *
 *  <item dodge: x, type y>
 *  <item dodge: x, type y%>
 *   Change the evasion against an Item.
 *     x    : ID of the item.
 *     type : evasion type. (eva, mev or cev)
 *     y    : change rate.
 *
 * ---------------
 *
 *  <element dodge: x, type y>
 *  <element dodge: x, type y%>
 *   Change the evasion against actions with an element.
 *     x    : ID of the element.
 *     type : evasion type. (eva, mev or cev)
 *     y    : change rate.
 *
 * ---------------
 *
 *  <state dodge: x, type y>
 *  <state dodge: x, type y%>
 *   Change the evasion against actions that changes a state.
 *     x    : ID of the state.
 *     type : evasion type. (eva, mev or cev)
 *     y    : change rate.
 *
 * ---------------
 *
 *  <stype dodge: x, type y>
 *  <stype dodge: x, type y%>
 *   Change the evasion against the skills with a specific Skill Type.
 *     x    : ID of the skill type.
 *     type : evasion type. (eva, mev or cev)
 *     y    : change rate.
 *
 * ---------------
 *
 *  <itype dodge: x, type y>
 *  <itype dodge: x, type y%>
 *   Change the evasion against the items with a specific Item Type.
 *     x    : ID of the item type.
 *     type : evasion type. (eva, mev or cev)
 *     y    : change rate.
 *
 * ---------------
 *
 *  <custom skill dodge: x, type>
 *   result = code
 *  </custom skill dodge>
 *   Process a script code to change the evasion against a Skill.
 *     x    : ID of the skill.
 *     type : evasion type. (eva, mev or cev)
 *     y    : change rate.
 *
 * ---------------
 *
 *  <custom item dodge: x, type>
 *   result = code
 *  </custom item dodge>
 *   Process a script code to change the evasion against an Item.
 *     x    : ID of the item.
 *     type : evasion type. (eva, mev or cev)
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom element dodge: x, type>
 *   result = code
 *  </custom element dodge>
 *   Process a script code to change the evasion against actions with an element.
 *     x    : ID of the element.
 *     type : evasion type. (eva, mev or cev)
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom state dodge: x, type>
 *   result = code
 *  </custom state dodge>
 *   Process a script code to change the evasion against actions that changes a state.
 *     x    : ID of the state.
 *     type : evasion type. (eva, mev or cev)
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom stype dodge: x, type>
 *   result = code
 *  </custom stype dodge>
 *   Process a script code to change the evasion against the skills with a
 *   specific Skill Type.
 *     x    : ID of the skill type.
 *     type : evasion type. (eva, mev or cev)
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom itype dodge: x, type>
 *   result = code
 *  </custom itype dodge>
 *   Process a script code to change the evasion against the items with a 
 *   specific Item Type.
 *     x    : ID of the item type.
 *     type : evasion type. (eva, mev or cev)
 *     code : code that will return the success chance.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object. The 'result' must return a numeric value.
 *
 * ---------------
 *
 *  The % value is multiplied by the base value, while the flat and code are
 *  added to the base. For exemple, if a battler have 10% evasion against element
 *  ID 2. If it have <element dodge: 2, +50%>, the chance will go to 15% 
 *  (10 + 50% = 15). Now if it have you have <element dodge: 2, +50> the chance
 *  will go to 60% (10 + 50 = 60).
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *   <skill dodge: 4, mev +50%>
 *
 * ---------------
 *
 *   <item dodge: 5, eva +25>
 *
 * ---------------
 *
 *   <element dodge: 6, cva -25%>
 *
 * ---------------
 *
 *   <custom stype dodge: 1, eva>
 *    result = 10 * a.agi / b.agi;
 *   </custom stype dodge>
 *
 * ------------------------------------------------------------------------------
 * Compatibility:
 * ------------------------------------------------------------------------------
 *
 * - When used together with the plugin 'VE - Hif Formula', place this
 *   plugin above it.
 * - When used together with the plugin 'VE - Battle Advantage', place this
 *   plugin above it.
 *
 * ------------------------------------------------------------------------------
 */
 
(function() {
  	
	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.ActionDodge.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.ActionDodge.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.ActionDodge.loadNotes(data);
	};
	
	VictorEngine.ActionDodge.loadNotes = function(data) {
		data.actionDodge = data.actionDodge || {};
		data.actionDodge.item    = data.actionDodge.item    || {};
		data.actionDodge.skill   = data.actionDodge.skill   || {};
		data.actionDodge.itype   = data.actionDodge.itype   || {};
		data.actionDodge.stype   = data.actionDodge.stype   || {};
		data.actionDodge.state   = data.actionDodge.state   || {};
		data.actionDodge.element = data.actionDodge.element || {};
		this.processNotes(data, "item");
		this.processNotes(data, "skill");
		this.processNotes(data, "itype");
		this.processNotes(data, "stype");
		this.processNotes(data, "state");
		this.processNotes(data, "element");
	};
	
	VictorEngine.ActionDodge.processNotes = function(data, type) {
		var match;
		var code   = type + ' dodge';
		var part1  = '[ ]*(\\d+),[ ]*(\\w+)[ ]*';
		var regex1 = new RegExp('<' + code + '[ ]*:' + part1 + '([+-]?\\d+)(\\%)?[ ]*>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + code + '[ ]*:' + part1, 'custom ' + code);
		while ((match = regex1.exec(data.note)) !== null) {
			this.processValues(match, data.actionDodge[type]);
		};
		while ((match = regex2.exec(data.note)) !== null) {
			this.processValues(match, data.actionDodge[type], true);
		};
	};
		
	VictorEngine.ActionDodge.processValues = function(match, data, code) {
		result = {};
		result.eva = {};
		result.mev = {};
		result.cev = {};
		if (match[2].toLowerCase() === 'eva') { result.eva = this.processDodge(match, code) };
		if (match[2].toLowerCase() === 'mev') { result.mev = this.processDodge(match, code) };
		if (match[2].toLowerCase() === 'cev') { result.cev = this.processDodge(match, code) };
		data[match[1]] = result;
	};
	
	VictorEngine.ActionDodge.processDodge = function(match, code) {
     	var result  = {};
		result.rate = !code &&  match[4] ? Number(match[3]) || 0 : 0;
		result.flat = !code && !match[4] ? Number(match[3]) || 0 : 0;
		result.code = code ? String(match[3]).trim() : '';
		return result
	};
	
	//=============================================================================
	// Game_Action
	//=============================================================================
	
	VictorEngine.ActionDodge.itemEva = Game_Action.prototype.itemEva;
	Game_Action.prototype.itemEva = function(target) {
		var result = VictorEngine.ActionDodge.itemEva.call(this, target);
		return this.getDodgeValue(result, this.isSkill(), this.item(), target);
	};
	
	VictorEngine.ActionDodge.itemCri = Game_Action.prototype.itemCri;
	Game_Action.prototype.itemCri = function(target) {
		var result = VictorEngine.ActionDodge.itemCri.call(this, target);
		return this.getActionDodgeCev(result, this.isSkill(), this.item(), target);
	};
	
	Game_Action.prototype.getDodgeValue = function(result, isSkill, item, target) {
		if (this.isPhysical()) return this.getActionDodgeEva(result, isSkill, item, target);
		if (this.isMagical())  return this.getActionDodgeMev(result, isSkill, item, target);
		return result;
	};	

	Game_Action.prototype.getActionDodgeEva = function(result, isSkill, item, target) {
		var value = this.getActionDodgeValues(isSkill, item, target);
		result += this.getActionDodgeCodeEva(value, target);
		result += this.getActionDodgeFlatEva(value);
		result *= this.getActionDodgeRateEva(value);
		return Math.max(result, 0);
	};	
		
	Game_Action.prototype.getActionDodgeMev = function(result, isSkill, item, target) {
		var value = this.getActionDodgeValues(isSkill, item, target);
		result += this.getActionDodgeCodeMev(value, target);
		result += this.getActionDodgeFlatMev(value);
		result *= this.getActionDodgeRateMev(value);
		return Math.max(result, 0);
	};   
	
	Game_Action.prototype.getActionDodgeCev = function(result, isSkill, item, target) {
		var value = this.getActionDodgeValues(isSkill, item, target);
		result += this.getActionDodgeCodeCev(value, target);
		result += this.getActionDodgeFlatCev(value);
		result *= this.getActionDodgeRateCev(value);
		return Math.max(result, 0);
	};
	
	Game_Action.prototype.getActionDodgeFlatEva = function(value) {
		var object = this;
		return value.reduce(function(r, data) { 
			return r + (object.getActionDodgeFlat(data.eva) || 0);
		}, 0);
	};
	
	Game_Action.prototype.getActionDodgeRateEva = function(value) {
		var object = this;
		var result = value.reduce(function(r, data) { 
			return r + (object.getActionDodgeRate(data.eva) || 0) 
		}, 0);
		return Math.max(1.0 + result / 100, 0);
	};   
	
	Game_Action.prototype.getActionDodgeCodeEva = function(value, target) {
		var object = this;
		return value.reduce(function(r, data) { 
			return r + (object.getActionDodgeCode(data.eva, target) || 0);
		}, 0);
	};
			
	Game_Action.prototype.getActionDodgeFlatMev = function(value) {
		var object = this;
		return value.reduce(function(r, data) { 
			return r + (object.getActionDodgeFlat(data.mev) || 0);
		}, 0);
	};
	
	Game_Action.prototype.getActionDodgeRateMev = function(value) {
		var object = this;
		var result = value.reduce(function(r, data) { 
			return r + (object.getActionDodgeRate(data.mev) || 0) 
		}, 0);
		return Math.max(1.0 + result / 100, 0);
	};   
	
	Game_Action.prototype.getActionDodgeCodeMev = function(value, target) {
		var object = this;
		return value.reduce(function(r, data) { 
			return r + (object.getActionDodgeCode(data.mev, target) || 0);
		}, 0);
	};
	
	Game_Action.prototype.getActionDodgeFlatCev = function(value) {
		var object = this;
		return value.reduce(function(r, data) { 
			return r + (object.getActionDodgeFlat(data.cev) || 0);
		}, 0);
	};
	
	Game_Action.prototype.getActionDodgeRateCev = function(value) {
		var object = this;
		var result = value.reduce(function(r, data) { 
			return r + (object.getActionDodgeRate(data.cev) || 0) 
		}, 0);
		return Math.max(1.0 + result / 100, 0);
	};   
	
	Game_Action.prototype.getActionDodgeCodeCev = function(value, target) {
		var object = this;
		return value.reduce(function(r, data) { 
			return r + (object.getActionDodgeCode(data.cev, target) || 0);
		}, 0);
	};
	
	Game_Action.prototype.getActionDodgeFlat = function(data) {
		if (data && data.flat) { return data.flat || 0 } else { return 0 };
	};
		
	Game_Action.prototype.getActionDodgeRate = function(data) {
		if (data && data.rate) { return data.rate || 0 } else { return 0 };
	};

	Game_Action.prototype.getActionDodgeCode = function(data, target) {
		try {
			var result = 0;
			var item = this.item();
			var a = this.subject();
			var b = target;
			var v = $gameVariables._data;
			eval(data.code)
			return Number(result) || 0;
		} catch (e) {
			return 0;
		}
	};

	Game_Action.prototype.getActionDodgeValues = function(isSkill, item, target) {
		var object  = this;
		var subject = this.subject();
		return target.traitObjects().reduce(function(r, data) {
			var value = object.getActionDodgeData(subject, data.actionDodge, isSkill, item);
			return r.concat(value);
		}, []);
	};
	
	Game_Action.prototype.getActionDodgeData = function(subject, data, isSkill, item) {
		var value;
		var result = [];
		if (isSkill) {
			var itemValue = data.skill[item.id] || {};
			var typeValue = data.stype[item.id] || {};
		} else {
			var itemValue = data.item[item.id]  || {};
			var typeValue = data.itype[item.id] || {};
		};
		var stateValue = VictorEngine.getAllStates(subject, item).reduce(function(r, stateId) {
			value = data.state[stateId] || {};
			return r.concat(result);
		}, []);
		var elmtnValue = VictorEngine.getAllElements(subject, item).reduce(function(r, elementId) {
			value = data.element[elementId] || {};
			return r.concat(value);
		}, []);
		return result.concat(itemValue, typeValue, stateValue, elmtnValue);
	};
	
})(); 