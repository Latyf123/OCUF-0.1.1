/*
 * ==============================================================================
 * ** Victor Engine MV - Critical Hit Effects
 * ------------------------------------------------------------------------------
 *  VE_CriticalHitEffects.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Critical Hit Effects'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.CriticalHitEffects = VictorEngine.CriticalHitEffects || {};

(function() {

	VictorEngine.CriticalHitEffects.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.CriticalHitEffects.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Critical Hit Effects', 'VE - Basic Module', '1.09');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Critical Hit Effects', 'VE - Hit Formula');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Critical Hit Effects', 'VE - Action Dodge');
	};

	VictorEngine.CriticalHitEffects.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.CriticalHitEffects.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * ==============================================================================
 * @plugindesc v1.02 - Improved control over critial hits and critical damage.
 * @author Victor Sant
 *
 * @param Base Critical Damage
 * @desc Additional damage rate for critical damage.
 * Default: 100
 * @default 100
 *
 * @param Early Critical Check
 * @desc Check for critical is done before the action is executed.
 * true - ON	false - OFF
 * @default false
 *
 * @param Never Miss Critical
 * @desc If 'Early Critical Check' is ON, critical attacks never miss.
 * true - ON	false - OFF
 * @default false
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Damage (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <critical damage: x>
 *  <critical damage: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change all critial damage dealt by the battler.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical damage: +50%>
 *       <critical damage: -25>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Damage (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <critical damage: x, y>
 *  <critical damage: x, y%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Change the critial damage dealt by the battler when using a specific skill.
 *     x : skill Id.
 *     y : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical damage: 10, +50%>
 *       <critical damage: 15, -25>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Damage (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <custom critical damage>
 *   result = code
 *  </custom critical damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage dealt by the battler.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical damage>
 *         result = a.atk * 4
 *        </custom critical damage>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Damage (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <custom critical damage: x>
 *   result = code
 *  </custom critical damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage dealt by the battler when
 *   using a skill.
 *     x    : skill Id.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical damage: 15>
 *         result = a.atk * 4
 *        </custom critical damage>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Rate (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <critical rate: x>
 *  <critical rate: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change the critial rate of the battler.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical rate: +50%>
 *       <critical rate: -25>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Rate (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <critical rate: x, y>
 *  <critical rate: x, y%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Change the critial rate of the battler when using a specific skill.
 *     x : skill Id.
 *     y : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical rate: 10, +50%>
 *       <critical rate: 15, -25>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Rate (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <custom critical rate>
 *   result = code
 *  </custom critical rate>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial rate of the battler.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical rate>
 *         result = a.agi / 10
 *        </custom critical rate>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Rate (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <custom critical rate: x>
 *   result = code
 *  </custom critical rate>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial rate of the battler when using 
 *   a skill.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical rate: 15>
 *         result = a.agi / 10
 *        </custom critical rate>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Defense (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <critical defense: x>
 *  <critical defense: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change the critial damage received by the battler.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical defense: +50%>
 *       <critical defense: -25>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Defense (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <critical defense: x>
 *  <critical defense: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change the critial damage received by the battler.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical defense: +50%>
 *       <critical defense: -25>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Defense (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <custom critical defense>
 *   result = code
 *  </custom critical defense>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage received by the battler.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical defense>
 *         result = a.def * 2
 *        </custom critical defense>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Code (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ------------------------------------------------------------------------------
 *  <custom critical code>
 *   code
 *  </custom critical code>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Executes a script code when hit a critical attack.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical code>
 *         if (Math.random() < 0.5) {
 *           b.addState(5);
 *         }
 *        </custom critical code>
 *
 *        <custom critical code>
 *         v[10]++;
 *        </custom critical code>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Damage (notetag for Skill and Item)
 * ------------------------------------------------------------------------------
 *  <critical damage: x>
 *  <critical damage: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Changes the critial damage dealt by the skill or item.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical damage: +50%>
 *       <critical damage: -25>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Damage (notetag for Skill and Item)
 * ------------------------------------------------------------------------------
 *  <custom critical damage>
 *   result = code
 *  </custom critical damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage dealt by the skill or
 *   item.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical damage>
 *         result = a.atk * 4
 *        </custom critical damage>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Rate (notetag for Skill and Item)
 * ------------------------------------------------------------------------------
 *  <critical rate: x>
 *  <critical rate: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Changes the critial damage dealt by the skill or item.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical damage: +50%>
 *       <critical damage: -25>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Rate (notetag for Skill and Item)
 * ------------------------------------------------------------------------------
 *  <custom critical rate>
 *   result = code
 *  </custom critical rate>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage dealt by the skill or
 *   item.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical rate>
 *         result = a.agi / 10
 *        </custom critical rate>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Skill (notetag for Skill and Item)
 * ------------------------------------------------------------------------------
 *  <critical skill: x>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Uses the skill set instead of the current skill. Requires the the plugin
 *   command 'Early Critical Check' to be turned ON.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical skill: 10>
 *       <critical skill: 15>
 * ==============================================================================
 *
 * ==============================================================================
 *  Critical Code (notetag for Skill and Item)
 * ------------------------------------------------------------------------------
 *  <custom critical code>
 *   code
 *  </custom critical code>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Executes a script code when hit a critical attack with the skill or item.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical code>
 *         if (Math.random() < 0.5) {
 *           b.addState(5);
 *         }
 *        </custom critical code>
 *
 *        <custom critical code>
 *         v[10]++;
 *        </custom critical code>
 * ==============================================================================
 *
 * ==============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - Code
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object, except for critical defense.  For critical defense, "a" stand for 
 *  the target and "b" for the user. The 'result' must return a numeric value,
 *  except for the tag <custom critical code>, wich don't require a result.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Base Critical Damage
 *  This rate is added to the normal damage rate when dealing critical damage
 *  It's a rate value added to the base damage, so 100 = double damage (since
 *  the normal attack deals 100% damage, +100% from the critical = 200%)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Early Critical Check
 *  By default, the critical check is done right before the damage calculation.
 *  This makes hard for do things that are based on criticals, for example
 *  changing the animation for critical attacks. This setting allows you to
 *  make the critical check to be made before the action is actually executed.
 *  Since the calculation is made before the hit calculation, the critical
 *  attack still have a change of missing, unless 'Never Miss Critical' is ON.
 *
 *  You can check for critical actions with the code 'action.isCritical()' where
 *  'action' must be a valid 'Game_Action' object. (If you don't know what this
 *  means, avoid messing with this).
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Critical Rate
 *  Critical Rate % values will be multiplied by the current critical rate of
 *  the batter. So a battler with 15% critical rate, and +100% additional will
 *  have 30% critical. Flat and code values for critical rates are added to
 *  the total value.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Critical Damage
 *  Critical Damage rate stacks, so a base value of 200% + a skill that
 *  increase 50% will result in a 250% additional damage. 
 *  If the value is flat or a code value, it directly added to the damage when
 *  it is a critical.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Critical Defense
 *  The Critical Defense value is a value of reduction over the Critical
 *  Damage value. So it will reduce the additional value granted by the
 *  critical, but never the normal damage value.
 *  If the value is flat or a code value, it will be directly subtracted
 *  from the critical damage additional.
 *
 *  For example, an attack that deals 1000 damage, with 250% of critical damage
 *  would deal 3500 damage (1000 + 1000 * 250%). The critical defense will have
 *  effect only over the 2500 additional. So an 50% critical defense will reduce
 *  the 2500 by half: to 1250 additional damage. Wich will result in a final
 *  damage of 2250 (1000 + 1000 + 1250)
 *  A Critical Defense of 100% will nullify the critical additional damage, so
 *  the damage will be the same of a non critical attack.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Critical Code
 *  You can make script calls when deal critical damage. The code uses the same 
 *  values as the damage formula, so you can use "a" for the user, "b" for the
 *  target and "v[x]" for variable.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Critical Skills
 *  The tag <critical skill> allows you to make a different skill to be used
 *  when you successfully lands a critical hit. The targets of the skill will not
 *  change, even if it have a different scope than the original skill. The action
 *  used will be always a skill, even if the original action was an item.
 *  The cost of the new skill is not consumed, as the action is replaced after
 *  the costs are paid.
 *
 * ==============================================================================
 * 
 * ==============================================================================
 *  Compatibility:
 * ------------------------------------------------------------------------------
 *  To be used together with this plugin, the following plugins must be placed
 *  bellow this plugin:
 *     VE - Hif Formula
 *     VE - Action Dodge
 * ==============================================================================
 *
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2015.12.28 > First release.
 *  v 1.01 - 2016.03.04 > Improved code for better handling script codes.
 *  v 1.02 - 2016.08.29 > Fixed issue with Early Critical check.
 * ============================================================================== 
 */

(function() {
		
	//=============================================================================
	// Parameters
	//=============================================================================
	
	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.CriticalHitEffects = {};
		VictorEngine.Parameters.CriticalHitEffects.BaseDamage    = Number(parameters["Base Critical Damage"]);
		VictorEngine.Parameters.CriticalHitEffects.EarlyCritical = eval(parameters["Early Critical Check"]);
		VictorEngine.Parameters.CriticalHitEffects.NeverMiss     = eval(parameters["Never Miss Critical"]);
	};
	
	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.CriticalHitEffects.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.CriticalHitEffects.loadNotetagsValues.call(this, data, index);
		if (this.objectSelection(index, ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'])) {
			VictorEngine.CriticalHitEffects.loadNotes1(data);
		}
		if (this.objectSelection(index, ['skill', 'item'])) {
			VictorEngine.CriticalHitEffects.loadNotes2(data);
		}
	};
	
	VictorEngine.CriticalHitEffects.loadNotes1 = function(data) {
		data.criticalEffect = data.criticalEffect || {};
		data.criticalEffect.rate    = data.criticalEffect.rate    || {};
		data.criticalEffect.damage  = data.criticalEffect.damage  || {};
		data.criticalEffect.defense = data.criticalEffect.defense || {};
		data.criticalEffect.code    = data.criticalEffect.code    || {};
		data.criticalEffect.skillrate   = data.criticalEffect.skillrate   || {};
		data.criticalEffect.skilldamage = data.criticalEffect.skilldamage || {};
		this.processNotes(data);
	};
	
	VictorEngine.CriticalHitEffects.loadNotes2 = function(data) {
		data.criticalEffect = data.criticalEffect || {};
		data.criticalEffect.rate   = data.criticalEffect.rate   || {};
		data.criticalEffect.damage = data.criticalEffect.damage || {};
		data.criticalEffect.code   = data.criticalEffect.code   || {};
		data.criticalEffect.skill  = data.criticalEffect.skill  || {};
		this.processNotes(data);
	};
	
	VictorEngine.CriticalHitEffects.processNotes = function(data, type) {
		var match;
		var code   = 'critical[ ]*([\\w ]+)'
		var part1  = '(?:(\\d+)[ ]*,[ ]*)?([+-]?\\d+)(\\%)?';
		var part2  = '(?:[ ]*:[ ]*(\\d+))?';
		var regex1 = new RegExp('<' + code + ':[ ]*' + part1 +'[ ]*>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + code + part2, 'custom ' + code);
		while (match = regex1.exec(data.note)) {
			this.processValues(data, match, false);
		};
		while (match = regex2.exec(data.note)) {
			this.processValues(data, match, true);
		};
	};
	
	VictorEngine.CriticalHitEffects.processValues = function(data, match, code) {
		var result = {};
		var type   = (match[2] ? 'skill' : '') + match[1].toLowerCase();
		result.id    = Number(match[2]) || 0;
		result.rate  = !code && match[4] ? Number(match[3]) || 0 : 0;
		result.flat  = !code && match[4] ? 0 : Number(match[3]) || 0;
		result.code  = code ? String(match[3]).trim() : '';
		data.criticalEffect[type] = result;
	};
	
	//=============================================================================
	// Game_BattlerBase
	//=============================================================================
	
	Game_BattlerBase.prototype.criticalCheck = function() {
		return this._criticalCheck;
	};
	
	Game_BattlerBase.prototype.setCritical = function(value) {
		return this._criticalCheck = value;
	};
	
	Game_BattlerBase.prototype.criticalRate = function(item, target) {
		var rate = this.cri * this.criRateRate(item) * this.criSkillRateRate(item);
		var flat = this.criRateFlat(item, target) + this.criSkillRateFlat(item, target);
		return rate + flat;
	};
	
	Game_BattlerBase.prototype.criticalDamage = function(item, target) {
		var base = VictorEngine.Parameters.CriticalHitEffects.BaseDamage / 100;
		var rate = base + this.criDmgRate(item) + this.criSkillDmgRate(item);
		var flat = this.criDmgFlat(item, target) + this.criSkillDmgFlat(item, target);
		var rdef = target.criDefRate();
		var fdef = target.criDefFlat(this);
		return {rate: Math.max(rate * (1 - rdef), 0), flat: Math.max(flat - fdef, 0)};
	};
		
	Game_BattlerBase.prototype.criRateFlat = function(item, target) {
		var list  = [item].concat(this.traitObjects());
		var value = this.criticalValues(list, 'rate', 'flat');
		var code  = this.criticalCodes(list, 'rate', target);
		return value.concat(code).reduce(function(r, value) {
			return r + (value ? value / 100 : 0);
		}, 0)
	};
	
	Game_BattlerBase.prototype.criRateRate = function(item) {
		var list  = [item].concat(this.traitObjects());
		var value = this.criticalValues(list, 'rate', 'rate');
		return value.reduce(function(r, value) {
			return r * (value ? value / 100 : 1);
		}, 1)
	};
	
	Game_BattlerBase.prototype.criDmgFlat = function(item, target) {
		var list  = [item].concat(this.traitObjects());
		var value = this.criticalValues(list, 'damage', 'flat');
		var code  = this.criticalCodes(list, 'damage', target);
		return value.concat(code).reduce(function(r, value) {
			return r + (value ? value : 0);
		}, 0)
	};
	
	Game_BattlerBase.prototype.criDmgRate = function(item) {
		var list  = [item].concat(this.traitObjects());
		var value = this.criticalValues(list, 'damage', 'rate');
		return value.reduce(function(r, value) {
			return r + (value ? value / 100 : 1);
		}, 0)
	};
	
	Game_BattlerBase.prototype.criSkillRateFlat = function(item, target) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'skillrate', 'flat');
		var code  = this.criticalCodes(list, 'skillrate', target);
		return value.concat(code).reduce(function(r, value) {
			return r + (value[item.id] ? value[item.id] / 100 : 0);
		}, 0)
	};
	
	Game_BattlerBase.prototype.criSkillRateRate = function(item) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'skillrate', 'rate');
		return value.reduce(function(r, value) {
			return r * (value[item.id] ? value[item.id] / 100 : 1);
		}, 1)
	};
	
	Game_BattlerBase.prototype.criSkillDmgFlat = function(item, target) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'skilldamage', 'flat');
		var code  = this.criticalCodes(list, 'skilldamage', target);
		return value.concat(code).reduce(function(r, value) {
			return r + (value[item.id] ? value[item.id] : 0);
		}, 0)
	};
	
	Game_BattlerBase.prototype.criSkillDmgRate = function(item) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'skilldamage', 'rate');
		return value.reduce(function(r, value) {
			return r * (value[item.id] ? value[item.id] / 100 : 1);
		}, 1)
	};
	
	Game_BattlerBase.prototype.criDefFlat = function(subject) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'defense', 'flat');
		var code  = this.criticalCodes(list, 'defense', subject);
		return value.concat(code).reduce(function(r, value) {
			return r + (value ? value : 0);
		}, 0)
	};
	
	Game_BattlerBase.prototype.criDefRate = function() {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'defense', 'rate');
		return value.reduce(function(r, value) {
			return r + (value ? value / 100 : 1);
		}, 0)
	};
	
	Game_BattlerBase.prototype.criticalValues = function(list, type, value) {
		return list.reduce(function(r, data) {
			var result = data.criticalEffect[type][value];
			return r.concat(result || []);
		}, []);
	};
	
	Game_BattlerBase.prototype.criticalCodes = function(list, type, target) {
		var a = this;
		var b = target;
		var v = $gameVariables._data;
		return list.reduce(function(r, data) {
			try {
				var result = '';
				eval(data.criticalEffect[type].code);
				return r.concat(result || []);
			} catch (e) {
				return r;
			}
		}, []);
	};
	
	Game_BattlerBase.prototype.criticalProcessCodes = function(item) {
		var list = [item].concat(this.traitObjects());
		return list.reduce(function(r, data) {
			var code = data.criticalEffect.code;
			return r.concat(code || []);
		}, []);
	};
	
	//=============================================================================
	// Game_Action
	//=============================================================================
	
	/* Overwritten function */
	Game_Action.prototype.itemCri = function(target) {
		if (target.criticalCheck() !== undefined) {
			var result = target.criticalCheck() ? 1 : 0;
			target.setCritical(undefined);
			return result;
		} else {
			return this.criticalCheck(target);
		}
	};
	
	/* Overwritten function */
	Game_Action.prototype.applyCritical = function(damage) {
		var flat = this._criticalDamage.flat || 0;
		var rate = this._criticalDamage.rate || 3;
		return damage + Math.max(damage * rate + flat, 0);
	};
	
	VictorEngine.CriticalHitEffects.apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		this._criticalDamage = null;
		VictorEngine.CriticalHitEffects.apply.call(this, target);
	}
		
	VictorEngine.CriticalHitEffects.makeDamageValue = Game_Action.prototype.makeDamageValue;
	Game_Action.prototype.makeDamageValue = function(target, critical) {
		if (critical) this._criticalDamage = this.subject().criticalDamage(this.item(), target);
		return VictorEngine.CriticalHitEffects.makeDamageValue.call(this, target, critical);
	};
	
	VictorEngine.CriticalHitEffects.applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
	Game_Action.prototype.applyItemUserEffect = function(target) {
		if (this._criticalDamage) this.criticalCodes(target);
		VictorEngine.CriticalHitEffects.applyItemUserEffect.call(this, target);
	};
	
	VictorEngine.CriticalHitEffects.itemHit = Game_Action.prototype.itemHit;
	Game_Action.prototype.itemHit = function(target) {
		if (target.criticalCheck() && this.neverMissCritical()) {
			return 1;
		} else {
			return VictorEngine.CriticalHitEffects.itemHit.call(this, target);
		}
	};

	VictorEngine.CriticalHitEffects.itemEva = Game_Action.prototype.itemEva;
	Game_Action.prototype.itemEva = function(target) {
		if (target.criticalCheck() && this.neverMissCritical()) {
			return 0;
		} else {
			return VictorEngine.CriticalHitEffects.itemEva.call(this, target);
		}
	};
	
	VictorEngine.CriticalHitEffects.applyGlobal = Game_Action.prototype.applyGlobal;
	Game_Action.prototype.applyGlobal = function() {
		VictorEngine.CriticalHitEffects.applyGlobal.call(this);
		this.earlyCriticalCheck()
	};
	
	Game_Action.prototype.neverMissCritical = function() {
		return (VictorEngine.Parameters.CriticalHitEffects.EarlyCritical && 
				VictorEngine.Parameters.CriticalHitEffects.NeverMiss);
	};
		
	Game_Action.prototype.criticalCheck = function(target) {
		if (this.item().damage.critical) {
			var rate = this.subject().criticalRate(this.item(), target);
			return rate * (1 - target.cev);
		} else {
			return 0;
		}
	};
	
	Game_Action.prototype.earlyCriticalCheck = function() {
		if (VictorEngine.Parameters.CriticalHitEffects.EarlyCritical && $gameParty.inBattle())  {
			this._isCritical = BattleManager._targets.some(function(target) {
				target.setCritical(undefined);
				target.setCritical(Math.random() < this.itemCri(target));
				return target.criticalCheck();
			}, this);
			if (this.isCritical() && this.item().criticalEffect.skill.id) {
				this.setSkill(this.item().criticalEffect.skill.id);
			}	
		}
	};
		
	Game_Action.prototype.criticalCodes = function(target) {
		var list = this.subject().criticalProcessCodes(this.item(), target);
		var a = this.subject();
		var b = target;
		var v = $gameVariables._data;
		list.forEach(function(obj) { 
			if (obj.code) try { eval(obj.code) } catch (e) {};
		}, this);
	};

	Game_Action.prototype.isCritical = function() {
		return this._isCritical;
	};
	
})(); 