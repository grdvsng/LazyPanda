var	exports = {},
	require = function(path)
	{
		var parsedPath = path.match(/(?=[\/\\]).*?[^\/\\]+(?![\/\\])/g),
			varName    = parsedPath[parsedPath.length - 1].replace(/^[\\//]/g, ""),
			obj        =  new (function()
			{
				this[varName] = exports[varName];
			})();

		return obj;
	},
	__ErrorsCatcher__ = new (function ()
	{
		var OOPMethods = new OOP(this),
			self       = this,
			parents    = [
			];
		
		this.__init__ = function()
		{
			OOPMethods.inheritance(parents);
		}

		// Внутренние ошибки.
		this.errors = {
			'View Error': [{
				type:    "error",
				message: "Can't compile view: '{0}', check your views."
			}, {
				type:    "error",
				message: "Parameters for view: '{0}', not found."
			}],

			'Shedules Error': [{
					type:    "warning",
					message: "Shedules: '{0}', not found."
			},  {
					type:    "error",
					message: "Can't run shedule: '{0}'."
				}
			],

			'Element Get Function Error': [{
				type:    "warning",
				message: "Path: '{0}', have not exist in element."
			}],

			'Replace Key In String By Core Variable': [{
				type:    "warning",
				message: "Variable: '{0}', not found in Core."
			}],

			'Background Error': [{
				type:    "warning",
				message: "Background: '{0}', type '{1}', not found."
			}, {
				type:    "warning",
				message: "Background: '{0}', incorect object."
			}],

			'Browser Error': [{
				type:    "warning",
				message: "Browser not support localStorage"
			}],

			'Append Method or Elems Key Error': [{
				type:    "warning",
				message: "Can't find typeof: '{0}'."
			}, {
				type:    "warning",
				message: "Can't find method for: '{0}'."
			}],

			'Connect Element Error': [{
				type:    "warning",
				message: "Can't find master for: \n'{0}'."
			}, {
				type:    "warning",
				message: "Can't find effect with name: '{0}'\nfor elem: '{1}'."
			}],

			'Files Errors': [{
				type:    "error",
				message: "No one script match '{0}'."
			}],

			'Effects Error': [{
				type:    "warning",
				message: "For effect '{0}', need have element: '{1}' on super."
			}]
		}

		this.repeatString = function(str, step)
		{
			var curent = "";

			for (var n=0; n < step; n++)
			{
				curent += str;
			}

			return curent;
		}
		
		this.catch = function(errorType, errorNumber, args, browseError)
		{
			var error       = this.errors[errorType][errorNumber],
				body        = this.format(error.message, args),
				line        = this.repeatString("-", body.length),
				shablone    = "{title}\n{line}\n{body}\n{line}\nBrowser Error:\n{ge}\n{line}\n\n",
				browseError = (browseError !== undefined) ? browseError:'Core Error',
				ignore      = (window['__debug__'] !== undefined) ? window['__debug__']:false,
				curMessage  = this.format(shablone, {'title': errorType, 'line': line, 'body': body, 'ge': browseError});
				
			if (error.type === 'warning' || ignore)
			{
				console.log(curMessage);
			} else {
				throw curMessage;
			}
		}

		this.format = function(str, args)
		{
			var toFormat   = ((typeof args) !== "string") ? args:[args],
				curentLine = str;

			for (var n in toFormat)
			{
				var key = "\\{" + n + "\\}";
				curentLine = curentLine.replace(new RegExp(key, 'g'), toFormat[n]);
			}

			return curentLine;
		}

		this.__init__();
	})();

	
function _addEventListener(element, event, action)
{
	if ((typeof action) !== 'string')
	{

		if (element.addEventListener)
		{
			element.addEventListener(event, action);
		} else {element.attachEvent(event, action);}
	} else {
		element['on' + event] = function(){eval(action)};
	}
}


function argumentsToArray(args)
{
	var curArray = [];

	for (n=0; n < args.length; n++) curArray.push(args[n]);

	return curArray;
}

function appendTaskOnStack (task, ms, loop)
{
	var args             = argumentsToArray(arguments);
	window.nextTaskAfter = (window.nextTaskAfter || 0) + ms;
	
	if (!loop)
	{
		setTimeout(function()
		{
			appendTaskOnStack(task, ms, true, ((args.length > 2) ? args.slice(3,args.length):undefined));

		}, window.nextTaskAfter);
	} else {
		if (task) task.apply(null, arguments[3]);
		
		window.nextTaskAfter = 0;
	}
}


function OOP(self)
{
	this.__init__ = function()
	{
		//...
	}

	this.inheritance = function(parents, params)
	{
		var dict = [];

		for (var n=0; n < parents.length; n++)
		{
			var parent = (params !== undefined) ? new parents[n](params):new parents[n]();
			
			dict[parent.name] = parent;
			
			for (var att in parent) self[att] = parent[att];
		}

		return dict;
	}

	this.__init__();
}


function __LocalStorage__()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];

	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.LocalStorageOnError = function(e)
	{
		//__ErrorsCatcher__.catch('Browser Error', 0, null, e);
	}

	this.getLocalStorageItem = function(key)
	{
		var result;
		
		try {
			result = localStorage.getItem(key);
		} catch(e) {
			result = undefined;
			this.LocalStorageOnError(e);
		}

		return undefined;
	}

	this.setItem = function(key, data)
	{
		try {
			localStorage.setItem(key, data);
		} catch(e) {
			this.onError(e);
		}
	}

	this.__init__();
}


function ScrollEffects(master)
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];

	this.scroller = {
		event: 'scroll',

		compile: function(elem)
		{
			_addEventListener(document, this.event, function()
			{
				elem.domElement.style.top = elem.core.scrollTop();
			});
		}
	}

	OOPMethods.inheritance(parents);
}


function DisplayEffects(master)
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];
 	
	this['hide panel button'] = 
	{
		event: 'click',

		action: function(elem, button)
		{
			return function()
			{
				var hidden = elem.childsHidden || false;

				if (!hidden) 
				{
					elem.setAttributeForAllChild('style.color', 'red')
					elem.smoothRetraction.apply(elem, [button, function() {
						button.setIconFromPath(button.hidenButton);
						elem.childsHidden = true;
					}]);

					elem.hideAllChildNodes(button);
				} else {
					elem.unRetraction.apply(elem, [function()
					{
						elem.showAllChildNodes(button);
						button.setIconFromPath(button.showButton);
						elem.childsHidden = false;
					}]);
				}
			}
		},

		def: function(elem, button)
		{
			var iPath = (elem.core.config.style.graphic ||  elem.core.config.style.path + "/graphic"),
				back  = iPath + '/back.svg',
				next  = iPath + '/next.svg';
			
			button.hidenButton = (elem.position === 3) ? back:next;
			button.showButton  = (elem.position === 3) ? next:back;

			button.setIconFromPath(button.showButton);

			return this.action(elem, button);
		},

		compile: function(elem)
		{	
			var params = 
				{
					type:      "HTMLCollection",
					class:     "hide-panel-button",
					htmlClass: "div",

					onRender: function()
					{
						if (elem.position !== 3)
						{
							this.domElement.style.right    = "0px"
						} else {this.domElement.style.left = "0px"}
					}
				},
				button = elem.core.compileElement(params, elem);
			
			button.events = [{event: this.event, action: this.def(elem, button)}];
			button.core.connectEvents(button.domElement, button.events);
		}
	}

	this['hide list 1'] = 
	{
		event: 'click',

		def: function(elem, interval, funcWithHide, funcWithShow)
		{
			var interval = interval;

			return function()
			{
				var children = elem.domElement.childNodes,
					hidden   = elem.listHidden || false;
				
				if (!hidden)
				{
					elem.hideAllChildNodesWithInterval(elem.caption, interval, funcWithHide);

					elem.listHidden = true;
				} else {
					elem.showAllChildNodesWithInterval(elem.caption, interval, funcWithShow);
					elem.listHidden = false;
				}
			}
		},

		compile: function(elem)
		{	
			if (elem.caption !== undefined) 
			{
				elem.caption.class = 'caption';

				_addEventListener(
					elem.caption.domElement,
					this.event, 
					this.def(elem, 25, 
						function() {this.setFilter('blur(1px)');},
						function() {this.setFilter('none');}
				));
			} else { 
				__ErrorsCatcher__.catch('Effects Error', 0, ['hide list', 'caption']);
			}
		}
	}

	this['hide list 2'] = 
	{
		event: 'click',
		compile: function(elem)
		{	
			if (elem.caption !== undefined) 
			{
				elem.caption.class = 'caption';
				
				elem.caption.connectEffect('flip_2', true);
				_addEventListener(elem.caption.domElement, this.event, self['hide list 1'].def(elem, 50));
			} else {
				__ErrorsCatcher__.catch('Effects Error', 0, ['hide list', 'caption']);
			}
		}
	}

	this['hide list 3'] = 
	{
		event: 'click',
		compile: function(elem)
		{	
			if (elem.caption !== undefined) 
			{
				elem.caption.class = 'caption';
				
				elem.caption.connectEffect('flip_2', true);
				_addEventListener(elem.caption.domElement, this.event, self['hide list 1'].def(elem, 50, self['letters disappear'].def, self['letters showing'].def));
			} else {
				__ErrorsCatcher__.catch('Effects Error', 0, ['hide list', 'caption']);
			}
		}
	}

	OOPMethods.inheritance(parents);
}


function UIEffects()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			ScrollEffects,
			DisplayEffects
		];

	this.effectCompiller = function(event, func)
	{
		return function()
		{
			this['isOn' + event] = (this['isOn' + event] !== undefined) ?  this['isOn' + event]:false;

			if (!this['isOn' + event]) 
			{
				this['isOn' + event] = true;
				
				func();
				
				this['isOn' + event] = false;
			}
		}
	}

	OOPMethods.inheritance(parents, this);
}


function ElementsConnectFunctions()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];
	
	this.connectEffects = function(effects, forAllChilds)
	{
		for (var n=0; n < effects.length; n++) 
		{
			this.connectEffect(effects[n], forAllChilds);
		}
	}
	
	this.connectEffect = function(effectName, forAllChilds)
	{
		var effect       = new UIEffects()[effectName],
			forAllChilds = forAllChilds || false;

		if (effect !== undefined)
		{
			effect.compile(this);
		} else {
			__ErrorsCatcher__.catch('Connect Element Error', 1, [effectName, this.class])
			return null;
		}
		
		if (forAllChilds) 
		{
			for (var n=0; n < this.items.length; n++) this.items[n].connectEffect(effectName, forAllChilds);
		}
	}

	OOPMethods.inheritance(parents);
}


function ElementsDefaultFunction()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			ElementsGetFunctions,
			ElementsMetamorphosesFunctions,
			ElementsDisplayFunctions,
			ElementsSetFunctions,
			ElementsConnectFunctions
		];

	OOPMethods.inheritance(parents, this);
}


function Element()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			HTMLElement,
			Сompiler
		];

	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.connectEvents = function(HTMLElement, events)
	{
		
		for (var n=0; n < events.length; n++)
		{
			var params = events[n];

			_addEventListener(HTMLElement, params.event, params.action);
		}
	}

	this.createNotTuchLable = function(master, content)
	{
		var params = {
			'type':      'HTMLCollection',
			'class':     'NotTuchLable',
			'htmlClass': 'button',
			'content': 	 content,
			'items':     []
		};

		return params;
	}

	this.appendItemsInTable = function(table, items, notEmpty)
	{
		var notEmpty = notEmpty || false;
		table.items  = (Array.isArray(table.items)) ? table.items:[table.items];;

		for (var n=0; n < items.length; n++)
		{
			var elem = items[n],
				tr   = {
					type:      'HTMLCollection',
					class:     'list-empty-row',
					htmlClass: 'tr'
				},
				row  = {
					type:      'HTMLCollection',
					htmlClass: 'tr',
					class:     'list-row',
					items:     elem
				};

			if (n === 0 && notEmpty) table.items.push(tr);
			
			table.items.push(row);

			if (n != items.length)   table.items.push(tr);
		}

		return table;
	}

	this.clone = function(element)
	{
		this.changeHTMLElementTag(element, element.domElement.tagName, true);
	}

 	this.changeHTMLElementTag = function(element, newTag, notRemove)
	{
		element.compile_parameters.htmlClass = newTag;

		var elem = this.compileElement(element.compile_parameters, element.master);

		if (notRemove === undefined) element.__del__();

		return elem;
	}

	this.getAndCallMainFunctionFromElemPath = function(path)
	{
		var cleanName = path.replace(/(?!\/).*?(?=\/)|\//g, "").split('.')[0];
		
		return window[cleanName];
	}

	// Добавление задания для выполнения после рендера элемента.
	this.appendFunctionOnInnerElementOnRender = function(innerElement)
	{
		var compileParams = innerElement.compile_parameters,
			oldRender     = innerElement.onRender;

		innerElement.onRender = function()
		{
			if (oldRender) oldRender();
			
			self.compileEffectsToElement(innerElement);
		}
	}

	this.getMaster = function(master)
	{
		if ((master !== undefined) && (master !== null))
		{

			if ((master.domElement !== undefined) && (master.domElement !== null)) 
			{
				return master.domElement;
			}
			else if ((master.id !== undefined) && (master.id !== null))
			{
				return document.getElementById(master.id);
			}
		}
	}

	this.__init__();
}


function ElementsMetamorphosesFunctions()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];

	this.changeHTMLElementTag = function(newTag)
	{
		self.changeHTMLElementTag(this, newTag);
	}

	this.resize = function(x, y)
	{
		this.domElement.style.width  = y; 
		this.domElement.style.height = x;
	}

	this.resizeChild = function(child, x, y)
	{
		try {
			child.super.resize(x, y);
		} catch(e) {
			child.style.width  = y;
			child.style.height = x;
		}
	}

	this.createIcon = function(parameters)
	{
		var icon;

		if (this.icon) this.icon.__del__();

		parameters.class  = 'button-icon';
		icon              = this.core.compileElement(parameters, this);

		return icon;
	}

	this.makeLineBetweenChildNodes = function()
	{
		var childs = this.core.cloneArray(this.domElement.childNodes),
			self   = (self !== undefined) ? self:this;

		for (var n=0; n < childs.length; n++)
		{
			var child  = childs[n],
				line   = {
					type:      "HTMLCollection",
					htmlClass: "br",
				};

			if (n !== 0) 
			{
				var elem = child.super.core.compileElement(line, self);		
				self.domElement.insertBefore(elem.domElement, child);
			}
		}
	}

	this.makeInnerWidthForChildNodes = function(width)
	{
		var maxWidth = 0;

		for (var n=0; n < this.domElement.childNodes.length; n++) 
		{
			this.resizeChild(this.domElement.childNodes[n], "", (width) + 'px');
		}
	}

	this.balanceSizeByAnotherElem = function(elem)
	{
		var x1 = this.getHeight(),
			x2 = elem.getHeight(),
			w1 = this.getWidth(),
			w2 = elem.getWidth();

		if (x1 < x2) this.setHeight((x2 * 1.2) + 'px');
		if (w1 < w1) this.setWidth((w2  * 1.2) + 'px');
	}

	OOPMethods.inheritance(parents);
}


function ElementsGetFunctions() 
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			ElementsRemoveFunctions
		];

	this.getAttributeByRoutes = function(elem, routes)
	{
		if (routes.length >= 1) 
		{
			return this.getAttributeByRoutes(elem[routes[0]], routes.slice(1));
		} 
			
		return elem;
	}

	this.getAttributeByPath = function(path, forDomElement)
	{
		var forDomElement = forDomElement || false,
			elem          = (forDomElement) ? this.domElement:this,
			routes        = path.split(/[.\/\\]/g);
		
		try      { return this.getAttributeByRoutes(elem, routes);} 
		catch(e) { return __ErrorsCatcher__.catch('Element Get Function Error', 0, path, e);}
	}

	this.getDefaultStyleParameter = function(key)
	{
		var style = this.compile_parameters.style,
			value = (style !== undefined) ? style[key]:'none';

		return (value !== undefined) ? value:'none';
 	}

	this.getStyleAttribute = function(att)
	{
		var style = window.getComputedStyle(this.domElement),
			value = style[att];

		if (value.match(/px$/g)) value = Number(value.replace('px', ""));

		return value;
	}

	this.getChildNodesMaxWidth = function()
	{
		var maxWidth = 0;

		for (var n=0; n < this.domElement.childNodes.length; n++) 
		{
			var child = this.domElement.childNodes[n],
				rect  = child.getBoundingClientRect(); 
			maxWidth  = (rect.width > maxWidth) ? rect.width:maxWidth;
		}

		return maxWidth;
	}

	this.getElement = function()
	{
		return this.domElement;
	}
	
	this.getSize = function(onPX)
	{
		var onPX = (onPX !== undefined) ? onPX:false,
			rect = this.domElement.getBoundingClientRect(),
			x    = (onPX) ? rect.height + 'px':rect.height,
			y    = (onPX) ? rect.width  + 'px':rect.width;

		return {
			height: x, 
			width:  y
		};
	}
	
	this.getSizeAttribute = function(att, onPX)
	{
		var onPX = (onPX !== undefined) ? onPX:false,
			cur  = this.domElement.getBoundingClientRect()[att];

		if (onPX) cur += 'px';

		return cur;
	}

	this.getHeight = function(onPX)
	{
		return this.getSizeAttribute('height', onPX);
	}

	this.getWidth = function(onPX)
	{
		return this.getSizeAttribute('width', onPX);
	}

	OOPMethods.inheritance(parents);
}


function ElementsSetFunctions() 
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			Formatting
		];
	
	this.setAttributeForAllChild = function(attribute, value)
	{
		var children = children = this.items;

		for (var n=0; n < children.length; n++)
		{
			var child = children[n];

			if (child.items) child.setAttributeForAllChild(attribute, value);

			child.setAttribute(attribute, value);
		}
	}

	this.setIconFromPath = function(path, styleParams)
	{
		var realPath   = this.replaceKeyInStringByExemplarVariable(path),
			parameters = {
				type:      'HTMLCollection', 
				htmlClass: 'div'
			};

		this.icon = this.createIcon(parameters);
		this.icon.setBackground(realPath, styleParams || " center no-repeat");

		return this.icon;
	}

	this.setText = function(text)
	{
		this.domElement.innerText = text;
	}

	this.setAttribute = function(attribute, value, forDomElement)
	{
		var forDomElement = forDomElement || true,
			att           = this.getAttributeByPath(attribute, forDomElement);

		att = value;
	}

	this.setSelectedChild = function(method, params)
	{
		var args  = (Array.isArray()) ? params:[params],
			child = this.selectedChild;

		if (child) child[method].apply(child, args);
	}
	
	this.setFilter  = function(val)
	{
		this.domElement.style.filter                   = val;
 		this.domElement.style.filter['-webkit-filter'] = val;
	}
	
	this.setDisplayModeForChild = function(child, mode, interval, effectBeforeHide, effectAfterHide, effectBeforeShow, effectAfterShow)
	{
		var mode         = (mode !== undefined) ? mode:'show',
			self         = this,
			effectBefore = (mode !== 'show') ? effectBeforeHide:effectBeforeShow,
			effectAfter  = (mode !== 'show') ? effectAfterHide:effectAfterShow;

		if (effectBefore) {effectBefore.apply(child);}
		if (interval) 
		{
			appendTaskOnStack(function()
			{
				self.setDisplayModeForChild(child, mode, undefined, effectBeforeHide, effectAfterHide, effectBeforeShow, effectAfterShow);
			}, interval);
		} else {
			child[mode]();
		}

		if (effectAfter) effectAfter.apply(child);
	}

	this.setBackground = function(path, params)
	{
		var params  = params || "",
			relPath = this.replaceKeyInStringByExemplarVariable(path),
			value   = 'url("' + relPath + '")' + " " + params;
		
		this.domElement.style['background'] = value;
	}

	this.setDisplayModeForAllChildNodes = function(mode, _except, inerval, func)
	{
		var children = this.items,
			self     = this;

		for (var n=0; n < children.length; n++)
		{
			var child          = children[n];
			this.selectedChild = child;

			if (child !== _except) self.setDisplayModeForChild(child, mode, inerval, func, undefined, undefined, func);
		}
	}

	this.setHeight = function(val)
	{
		var value = ((typeof val) === 'number') ? (val + 'px'):val;

		this.domElement.style.height = value;
	}
	
	this.setWidth = function(val)
	{
		var value = ((typeof val) === 'number') ? (val + 'px'):val;
		
		this.domElement.style.width = value;
	}

	this.setColorFilter = function(type, precent, byString)
	{
		var byString = (precent === undefined && byString === undefined) ? type:byString;

		if (byString === undefined) this.domElement.style.filter = type + "(" + precent + "%)";
		if (byString !== undefined) this.domElement.style.filter = byString;
	}

	OOPMethods.inheritance(parents);
}


function ElementsDisplayFunctions() 
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			ElementsSetFunctions
		];

	this.smoothRetraction = function(objectWithMaxValue, afterFunction)
	{
		var self          = this,
			viaWidth      = this.getWidth() > this.getHeight(),
			definition    = (viaWidth) ? function(val){self.setHeight(val)}:function(val){self.setWidth(val)},
			getLength     = (viaWidth) ? function(){return self.getHeight()}:function(){return self.getWidth()},
			length        = getLength();
			limit         = length - ((objectWithMaxValue !== undefined) ? ((viaWidth) ? objectWithMaxValue.getHeight():objectWithMaxValue.getWidth()):0),
			interval      = 0;
		
		this.lastSmoothRetraction = {'size':  getLength(), 'mode':  viaWidth};

		definition(length);
		for (n=0; n < limit; n++)
		{
			interval += 4;
			setTimeout(definition, interval, (length - n));
		}

		if (afterFunction) setTimeout(afterFunction, interval);
	}

	this.unRetraction = function(afterFunction)
	{
		if (this.lastSmoothRetraction === undefined) return;

		var self       = this,
			viaWidth   = !this.lastSmoothRetraction.mode,
			n          = (viaWidth) ? this.getWidth(false):this.getHeight(false),
			definition = (!viaWidth) ? function(val){self.setHeight(val)}:function(val){self.setWidth(val)},
			length     = this.lastSmoothRetraction.size,
			interval   = 0;

		for (n; n < length; n++)
		{
			interval += 4;
			setTimeout(definition, interval, n);
		} 
		
		if (afterFunction) setTimeout(afterFunction, interval);
		this.lastSmoothRetraction = undefined;
	}

	this.hide = function()
	{
		this.domElement.defDisplay    = this.domElement.defDisplay || window.getComputedStyle(this.domElement).display;
		this.domElement.style.display = 'none';
	}

	this.show = function()
	{
		this.domElement.style.display = this.domElement.defDisplay || 'block';
	}
	
	this.hideAllChildNodesWithInterval = function(_except, interval, func)
	{
		this.setDisplayModeForAllChildNodes('hide', _except, interval, func);
	}

	this.hideAllChildNodes = function(_except, func)
	{
		this.setDisplayModeForAllChildNodes('hide', _except, 0, func);
	}

	this.showAllChildNodesWithInterval = function(_except, interval, func)
	{
		this.setDisplayModeForAllChildNodes('show', _except, interval, func);
	}

	this.showAllChildNodes = function(_except, func)
	{
		this.setDisplayModeForAllChildNodes('show', _except, 0, func);
	}

	OOPMethods.inheritance(parents);
}


function ElementsRemoveFunctions() 
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];


	this.__del__ = function()
	{
		var __self__ = this;
		
		this.removeChildren();
		
		if (!this.actionWithChildren) this.domElement.__del__();
	}

	this.removeItem = function(item)
	{
		this.items = this.items.filter(function (el) 
		{
			return el != null && el !== item && !el.deleted;
		});

		return this.items;
	}
	
	this.removeChildren = function()
	{
		this.actionWithChildren = true;

		for (var n=0; n < this.items.length; n++)
		{
			var child = this.items[n];

			child.__del__();
		}

		this.actionWithChildren = false;
	}

	OOPMethods.inheritance(parents);
}


function Сompiler()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			Obj,
			Formatting,
			HTMLElement
		];

	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}


	this.elementCoreCompile = function(exemplar, child, master, notAppend)
	{
		var element = document.createElement(exemplar.htmlClass),
			master  = this.getMaster(master);
		
		exemplar.domElement = element;
		
		if (child.effects !== undefined) 
		{
			child.effects = this.arrayAddition(exemplar.effects, child.effects, true);
		}

		this.objectAddition(exemplar, child);
		this.connectInnerAttsToHTMLObject(exemplar, element, child);
		
		if (!notAppend) master.appendChild(element);
		
		return exemplar; 
	}

	this.generateIDForHTMLElement = function(element)
	{
		var id = this.generateIDByClassName(element.className);

		return id;
	}

	this.generateIDByClassName = function(className)
	{
		var id = className + "_" + document.getElementsByClassName(className).length;
	
		return id;
	}

	this.generateIDForCoreElement = function(element, replace)
	{
		var replace = !(replace !== undefined),
			old_ID  = element.domElement.id,
			new_ID  = this.generateIDByClassName(element.domElement.className);
		
		if (!replace && old_ID !== undefined && old_ID !== null) new_ID = old_ID;
		
		return new_ID;
	}

	this.globalStartConnector = function(listOfElems, elemsType, elemsMaster, paramType)
	{	
		for (var n in listOfElems)
		{
			var elem   = document.createElement(elemsType),
				val    = listOfElems[n],
				params = {},
				attKey = this.getMethodVaribleByPath(val);

			if (attKey !== undefined) this.appendMethodOrElemKey(val, attKey);
			
			params[paramType] = this.replaceKeyInStringByExemplarVariable(val);
			
			this.connect(elem, elemsMaster, params);
		}
	}

	this.compileTextLabel = function(el, label)
	{
		var domElement = el.domElement,
			elemType   = (label.position !== 'top' && label.position !== 'bottom') ? 'td':'tr',
			elem       = document.createElement(elemType);
		
		label.style           = this.objectAddition(el.style.label, label.style);
		label.content         = label.content;
		label.domElement      = this.connectInnerAttsToHTMLObject(label, elem, el);
		
		if (label.position === 'left' || label.position === 'top')   
		{
			domElement.insertBefore(label.domElement, domElement.firstChild);
		} else {
		    domElement.appendChild(label.domElement);
		}

		return label;
	}

	this.connectMethodsForHTMLProto = function(elem)
	{
		for (var n=0; n < this.HTMLmethods.length; n++)
		{
			var att    = this.HTMLmethods[n]['title'],
				action = this.HTMLmethods[n]['action'];

			elem.__proto__[att] = action;
		}
	}

	this.connectInnerAttsToHTMLObject = function(innerElement, HTMLElement, paramsForElement)
	{
		var title = (HTMLElement.title !== undefined) ? HTMLElement.title:innerElement.compile_parameters.title;
		
		innerElement.style     = HTMLElement.style;
		innerElement.fullStyle = window.getComputedStyle(HTMLElement);

		if (innerElement.content !== undefined) 
		{
			HTMLElement.innerHTML += "<div>" + innerElement.content.trim() +  "</div>";
			HTMLElement.title      = (title !== undefined) ? title:this.stringSlice(HTMLElement.innerText, 40);
		}

		this.generateDictWithIdAndClassAttributs(innerElement, HTMLElement);
		this.connectMethodsForHTMLProto(HTMLElement);

		return HTMLElement;
	}
	
	this.afterCompile   = function(el, compiled)
	{
		compiled.compile_parameters = el;
		compiled.core               = this;
		compiled.domElement.super   = compiled;
		compiled.items              = compiled.items || [];

		this.objectAddition(compiled, new ElementsDefaultFunction());
		
		if (compiled.effects)                this.appendFunctionOnInnerElementOnRender(compiled);
		if (compiled.onRender !== undefined) compiled.onRender();
		if (el.label)                        compiled.label = this.compileTextLabel(compiled, el.label);
		
		this.connectEvents(compiled.domElement, this.arrayAddition(compiled.events, el.events));
		
		compiled.master.items.push(compiled);
		this.objects.push(compiled);
	}

	this.compileElement = function(el, master, notAppend)
	{
		var type      = el.type
			elem      = undefined,
			notAppend = notAppend || false;
		
		master       = el.master = (el.master !== undefined) ? el.master:master;
		master.items = (master.items !== undefined) ? master.items:[];

		if (type === "HTMLCollection")   elem = this.compileHTMLElement(el, master, notAppend);
		if (type === "innerElement")     elem = this.compileInnerElement(el, master, notAppend);		

		this.afterCompile(el, elem);

		return elem;
	}

	this.compileElements = function(master)
	{
		var items = (Array.isArray(master.items)) ? this.cloneArray(master.items):[master.items];
		master.items = [];

		for (var n in items) this.compileElement(items[n], master, items[n].notAppend);
	}

	this.compileEffectsToElement = function(element)
	{
		var effects = element.effects;

		for (var n=0; n < effects.length; n++)
		{
			var name = effects[n];

		   element.connectEffect(name);
		}
	}

	this.compileHTMLElement = function(el, master, notAppend)
	{
		var element = document.createElement(el.htmlClass),
			master  = (master.domElement === undefined) ? master:master.domElement;
		
		this.connectInnerAttsToHTMLObject(el, element);
		this.objectAddition(element, el.attributes);

		el.compile_parameters = el;
		el.domElement         = element;

		if (el.items)   this.compileElements(el);
		if (!notAppend) master.appendChild(element);

		return el;
	}

	this.compileInnerElement = function(elem, master, notAppend)
	{
		var compiler = this.elements[elem.class],
			master   = (elem.master !== undefined) ? elem.master:master,
			exemplar = new compiler(this, elem, master),
			compiled = this.elementCoreCompile(exemplar, elem, master, notAppend);
		
		if (compiled.items) this.compileElements(compiled);

		return compiled;
	}

	this.__init__();
}


function Formatting()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];
	
	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	// Аналог Python format.
	this.format = function(str, args)
	{
		var toFormat   = ((typeof args) !== "string") ? args:[args],
			curentLine = str;

		for (var n in toFormat)
		{
			var key = "\\{" + n + "\\}";
			curentLine = curentLine.replace(new RegExp(key, 'g'), toFormat[n]);
		}

		return curentLine;
	}
	
	// Замена ключей в строке на значение переменных движка.
	this.replaceKeyInStringByExemplarVariable = function(str)
	{
		var list = str.match(/\{{1,1}(.+?)\}{1,1}/g),
			args = {};

		if (list !== undefined && list !== null)
		{
			for (var n=0; n < list.length; n++)
			{
				var key = list[n].replace(/[\{\}]/g, ""),
					val = (this[key] !== undefined) ? this[key]:window[key];

				if (val === undefined || val === null) 
				{
					__ErrorsCatcher__.catch('Replace Key In String By Core Variable', 0, key, "Inner Error");
				} else {
					args[key] = val;
				}
			}
		}

		return this.format(str, args);
	}

	this.stringSlice = function(str, maxLength)
	{
		var result = str;

		if (str.length >= maxLength) result = (str.slice(0, maxLength - 3)) + "...";
	
		return result;
	}

	this.__init__();
}


function HTMLElement()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			PathParser
		];


	this.HTMLmethods  = [{
		'title': '__del__',
		'action': function()
		{
			var self   = this,
				master = this.super.master,
				_super = this.super;

			_super.deleted       = true;
			master.items         = master.items.filter(function(el) {return !el.deleted && !master.deleted;});
			_super.core.objects  = _super.core.objects.filter(function(el) 
			{
				var del = (el.deleted !== undefined) || (el.master.deleted !== undefined);

				return !del;
			});

			(this.remove) ? this.remove():this.parentNode.removeChild(this);
			
			delete _super;
		}
	}]

	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.connect = function(what, to, attributes)
	{
		for (var key in attributes)
		{
			var data = attributes[key];

			what.setAttribute(key, data);
		}

		to.appendChild(what);
	}

 	this.createHideMirrorHTMLElement = function(element)
 	{
 		var elem  = (element.domElement !== undefined) ? element.domElement:element,
 			rect  = elem.getBoundingClientRect(),
 			clone = {
 				domElement: document.createElement('div'),
 				master:     element,

 				style: 
 				{
	 				position: element.domElement.position,
	 				width:    rect.width  + 'px',
	 				height:   rect.height + 'px'
 				}
 			};
 		
		clone.domElement.super     =  clone;
		clone.domElement.className = 'Hide_Mirror_Elements';

 		this.objectAddition(clone.domElement.style, clone.style);
 		
 		return clone;
 	}

	this.getScriptPathByMatchWord = function(word, ifNotExistError)
	{
		var scripts = document.getElementsByTagName('script');

		for (var n=0; n < scripts.length; n++)
		{
			var elem    = scripts[n],
				src     = elem.src,
				re      = new RegExp(word, 'g'),
				result  = undefined;

			if (src.match(re) !== undefined)
			{
				result = this.absURIPath(src);
				break;
			}  else {
				__ErrorsCatcher__.catch('Files Errors', 0, word);
			}
		}

		return result;
	}

	this.__init__();
}


function Obj()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
	];
	
	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.isKeyInArray = function(arr, key)
	{
		var keyFound = false;

		for (var n=0; n < arr.Length; n++)
		{
			if (key === arr[n]) 
			{
				keyFound = true;

				break;
			}
		}

		return keyFound;
	}
	
	this.removeDuplicateOldBrowser = function(arr)
	{
		var curArr = [];

		for (var i=0; i < arr.length; i++)
		{
			if (!this.isKeyInArray(curArr, arr[i])) 
			{
				curArr.push(arr[i]);
			}
		}

		return curArr;
	} 

	this.removeDuplicate = function(arr)
	{
		var set    = new Set(arr),
			curArr = [];

		if (Array.from) 
		{
			curArr = Array.from(set);
		} else {
			curArr = this.removeDuplicateOldBrowser(arr);
		}
		
		return curArr;
	}

	this.insertInArray = function(arr, index, value)
	{
		var arr      = (arr !== undefined) ? arr:[],
			curArray = [];

		for (var n=0; n < arr.length; n++)
		{
			if (n === index) curArray.push(value);

			curArray.push(arr[n]);
		}

		return curArray;
	}

	// Слияние списков
 	this.arrayAddition = function(arr1, arr2, remDup)
 	{
 		var arr1   = arr1   || [],
 			arr2   = arr2   || [],
 			remDup = remDup || false;

 		for (var n=0; n < arr2.length; n++) arr1.push(arr2[n]);
 		
 		if (remDup) arr1 = this.removeDuplicate(arr1, arr2);
 		
 		return arr1;
 	}

 	this.deleteElementFromArray = function(arr, value)
 	{
 		var curArry = [];

 		for (var n=0; arr.length; n++)
 		{
 			if (arr[n] !== value) curArry.push(Arr[n]);
 		}
		
 		return curArry;
 	}

 	// Слияние объектов.
 	this.objectAddition = function(mainObject, addObject, specialParser)
	{
		var specialParser = (specialParser !== undefined) ? specialParser:false,
			currentObject = (mainObject    !== undefined) ? mainObject:{},
			addObject     = (addObject     !== undefined) ? addObject:{};

		for (var att in addObject)
		{
			var val = addObject[att];

			if (Array.isArray(val))                               val = this.cloneArray(val);
			if ((typeof val) === 'object' && !Array.isArray(val)) val = this.cloneObject(val);
			
			currentObject[att] = (specialParser) ? specialParser(val):val;
		}
		
		return currentObject;
	}
	
	this.cloneArray = function(arr)
 	{
 		return this.arrayAddition([], arr);
 	}

	this.cloneObject = function(obj)
 	{
 		return this.objectAddition(obj, {});
 	}	

 	this.foundKey = function(obj, key, scopeLevel)
	{
		var found      = false,
			scopeLevel = (scopeLevel !== undefined) ? 0:scopeLevel;

		for (var att in obj)
		{
			var node = obj[key];

			if (att === key) {
				found = node;
				break;
			}
		}

		if (!found && scopeLevel !== 0)
		{
			for (var att in obj) this.foundKey(obj[att], key, scopeLevel - 1);
		} else {
			return found;
		}
	}

	this.__init__();
}


function PathParser()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
	];
	
	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	// Возвращает абсолютный путь для внутренней ссылок.
	this.absURIPath = function(path)
	{
		var result = path.match(/(?!\/).+?[^\/]+$/g)[0].replace(/[^\/]+$/g, "");

		return result;
	}

	// Значение главной переменной модуля по его пути, только для данного движка.
	this.getMethodVaribleByPath = function(val)
	{
		var result  = val.match(/\/{1,1}[^\/]+\.{1,1}/g),
			varible = ((typeof result) === "object") ? result[0].replace(/[\.\/]/g, ""):undefined;
		
		return varible;
	}

	this.__init__();
}


function Sheduler()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
	];
	
	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.start_schedules = function(shedulesName)
	{
		var shedules = (this.shedules[shedulesName] !== undefined) ? this.shedules[shedulesName]:false;

		if (!shedules) __ErrorsCatcher__.catch('Shedules Error', 0, shedulesName);

		for (var n=0; n < shedules.length; n++)
		{
			var shedule = shedules[n];
			shedule.run = (shedule.run !== undefined) ? shedule.run:shedule.compile(this, shedule.compileArgs);

			shedule.run();	
		}
	}

	this.__init__();
}


function View()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			Сompiler
	];
	
	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.changeView = function(view, toDestroy)
	{
		var view    = ((typeof view) === "object") ? view:this.getViewElement(view),
			curView = this.compileInnerElement(view);

		if (toDestroy !== undefined && toDestroy !== null) 
		{
			this.destView(toDestroy);
		}
		
		return curView;
	}

	this.changeMainView = function(view)
	{
		var mainView  = this.changeView(view, window['mainView']);

		document.body.style['background']      = mainView.fullStyle['background'];
		document.body.style['background-size'] = mainView.fullStyle['background-size'] || '100%';
		window['mainView']                     = mainView;

		return mainView;
	}
	
	this.destView = function(view)
	{
		console.log(view)
		/*
		var master = document.getElementById(view.master.id);

		master.innerHtml = "";
		*/
	}

	this.getViewElement = function(viewName)
	{
		var params = window[viewName];

		if ((params === undefined) || (params === null))
		{
			__ErrorsCatcher__.catch('View Error', 1, viewName, "Inner Error");
		} else {
			params = params;
		}

		return params;
	}

	this.viewStyleCompile = function(styles, mode)
	{
		var style = styles[mode];

		for (var elemName in styles.universal)
		{
			var params    = styles.universal[elemName],
				elem      = style[elemName],
				elemStyle = self.elementStyleCompile(elem, params);
			
			elem = elemStyle; 
		}

		return style;
	}

	this.__init__();
}


function Win()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
	];
	
	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.scrollTop = function() 
	{
		var scrollY = (window.scrollY) ? window.scrollY:0,
			rect    = document.body.getBoundingClientRect(),
			result  = Math.max(scrollY, window.pageYOffset, rect.top);
		
		return result + 'px';
	}

	this.changeFalcon = function(falconPath)
	{
		var params = 
			{
				type:      "HTMLCollection",
				htmlClass: "link",
				
				attributes:
				{
					rel:       "icon",
					href:      falconPath
				}
			};
		
		document.head.items = this.cloneArray(document.head.children);

		this.compileElement(params, document.head);
	}

	this.__init__();
}


// Реакция на специальные событий;
function CoreEvents()
{
	var self  	   = this,					
		OOPMethods = new OOP(this),
		parents    = [
		]

	this.__init__ = function(debug)
	{
		this.parents = OOPMethods.inheritance(parents);
	}
}


function __Core__(debug)
{
	var self  	   = this,					
		OOPMethods = new OOP(this),
		parents    = [
			Element,
			Сompiler,
			Formatting,
			Obj,
			PathParser,
			Sheduler,
			__LocalStorage__,
			View,
			Win,
			CoreEvents
		];
	
	// Задания.
	this.shedules = {
		onLoad: [{
			title: 'Change Style for device', 
			
			run:  function()
			{
				var style = self.config.style;

				if(window.innerWidth <= 800 && window.innerHeight <= 600 && (window.innerWidth >= window.innerHeight)) 
				{
					self.style.domElement = self.connectStyle(style.path, 'mobile');
				} else {
					self.style.domElement = self.connectStyle(style.path, 'desktop');
				}
			}
		}, {
			title: 'Preseting for CFG', 
			
			run:  function()
			{
				self.config.elements = self.insertInArray(self.config.elements,  0, "{FramePath}bin/elements/BasicElement.js");
			}
		}, {
			title: 'Connect modules and elements', 
			
			run:  function()
			{
				var master = document.getElementsByTagName('head')[0],
					paths  = [
						self.config.modules,
						self.config.elements,
						self.config.views.viewsList
					];

				for (var n=0; n < paths.length; n++) 
				{
					var list = ((typeof paths[n]) !== 'string') ? paths[n]:[paths[n]];

					self.globalStartConnector(list,  'script', master, 'src');
				}
			}
		}],

		onStart: [{
			title: 'Connect Elems, Pages and Methods', 
			
			run: function() 
			{
				self.setCoreVaribleByKeyNameDict(self.elements);
				self.setCoreVaribleByKeyNameDict(self.modules, true);
				self.setCoreVaribleByKeyNameDict(self.views);
			}
		}, {
			title: 'Set MainView', 
			
			run: function() 
			{
				var view    = self.getLocalStorageItem('mainView'),
					defView = self.config.views.mainView;
				
				if ((view === null) || (view === undefined)) 
				{
					self.changeMainView(defView);
				} else {
					self.changeMainView(view);
				}
			}
		}, {
			title: 'HIDE Scripts', 
			
			run: function() 
			{
				self.destroyClass('script');
			}
		}, {
			title: 'Connect page icon.',

			run: function()
			{
				if (self.config.falcon)
				{
					self.changeFalcon(self.config.falcon);
				}
			}
	
		}]
	}

	this.elements = {
	}
	
	// Все подключенные объекты.
	this.objects = [
	]

	// Главное представление страницы.
	this.mainView = undefined;

	// Подключенные модули подключаются в данный список.
	this.modules = {
	}

	// Активный стиль, генерируется при запуске в зависимости от размера экрана.
	this.style = {
		title: null,
		parameters: null
	}

	// Подключенные предстваления.
	this.views = {
	}

	// конструктор
	this.__init__ = function(debug)
	{
		var than = this;

		window['__debug__'] = debug;
		this.parents   		= OOPMethods.inheritance(parents);
		this.FramePath 		= this.getScriptPathByMatchWord("__core__.js");
		this.config         = window["__config__"];
		window['FramePath'] = this.FramePath;
		
		this.start_schedules('onLoad');
	}

	this.connectStyle = function(path, mode)
	{
		var realPath = this.replaceKeyInStringByExemplarVariable(path) + "/" + mode + ".css",
			link     = document.createElement('link'),
			params   = {
				'href': realPath,
				'rel':  "stylesheet"
			};

		return self.connect(link, document.head, params);
	}

	// Добавления подключаемых элементов к движку.
	this.appendMethodOrElemKey = function(path, attKey)
	{
		if (path.match(/modules/g)) 
		{
			this.modules[attKey] = null;
		}
		else if (path.match(/elements/g)) 
		{
			this.elements[attKey]  = null;
		} 
		else if (path.match(/view/g))
		{
			this.views[attKey] = attKey;
		} 
		else if (path.match(/style/g)) 
		{
			this.style.title = attKey;
		} else {
			__ErrorsCatcher__.catch('Append Method or Elems Key Error', 0, attKey);
		}
	}

	this.destroyClass = function(className) 
	{
		var elems = document.getElementsByTagName(className);

		for (var n=0; n < elems.length; n++)
		{
			var script = elems[n];

			script.parentNode.removeChild(script);
		}

		if (document.getElementsByTagName(className).length > 0) 
		{
			setTimeout(function() {self.destroyClass(className);}, 500);
		}
	}

	this.generateDictWithIdAndClassAttributs = function(innerElement, HTMLElement)
	{
		for (var key in innerElement) 
		{
			var val = innerElement[key];
			
			if ((key === "id") || (key === "class") || (key === "data"))
			{
				HTMLElement.setAttribute(key, val);
			} 
		}

		return HTMLElement;
	}

	this.setCoreVaribleByKeyNameDict = function(dict, exemplar)
	{
		for (var key in dict)
		{
			var att = window[key];

			if ((att !== undefined) || (att !== null))
			{
				if (exemplar)  dict[key] = new att();
				if (!exemplar) dict[key] = att;
			} else {
				__ErrorsCatcher__.catch('Append Method or Elems Key Error', 1, key, "Inner Error");
			}
		}
	}

	this.__init__((debug !== undefined) ? debug:false);
}