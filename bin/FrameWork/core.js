var appendTaskOnStack = function(task, ms, loop)
	{
		window.nextTaskAfter = (window.nextTaskAfter || 0) + ms;

		if (!loop)
		{
			setTimeout(function()
			{
				appendTaskOnStack(task, ms, true);
			}, window.nextTaskAfter);
		} else {
			if (task) task.apply(Array(arguments).slice(3,));
			
			window.nextTaskAfter = 0;
		}
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
		__ErrorsCatcher__.catch('Browser Error', 0, null, e);
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
			document.addEventListener(this.event, function()
			{
				elem.domElement.style.top = elem.core.scrollTop();
			});
		}
	}

	OOPMethods.inheritance(parents);
}


function FlipEffects(master)
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];

	this.flip_1 = 
	{
		event: 'click',

		compile: function(elem)
		{
			var def = function()
			{
				var self     = this,
					onResize = (this.onResize !== undefined) ? this.onResize:false;

				if (!onResize)
				{
					var size = elem.getSize(),
						nowX = size.height          + 'px',
						nowY = size.width           + 'px',
						newX = (size.height * 0.9)  + 'px',
						newY = (size.width  * 0.9)  + 'px';
					self.onResize = true;

					elem.resize(newX, newY);

					setTimeout(function()
					{
						elem.resize(nowX, nowY);
						self.onResize = false;
					}, 100);
				}
			};

			elem.domElement.addEventListener(this.event, master.effectCompiller(this.event, def));
		}
	}

	this.flip_2 = 
	{
		event: 'click',

		compile: function(elem)
		{
			var def = function()
			{
				var style = window.getComputedStyle(elem.domElement, null),
			    	oldSize = Number(style['font-size'].replace('px', ""));
				
				elem.domElement.style['font-size'] = (oldSize - 1) + 'px';

				setTimeout(function()
				{
					elem.domElement.style['font-size'] = oldSize + 'px';
				}, 100);
			};

			elem.domElement.addEventListener(this.event, master.effectCompiller(this.event, def));
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

		def: function(elem, button)
		{
			var size = elem.getSize(true);

			return function()
			{	
				var hidden = (elem.childsHidden !== undefined) ? elem.childsHidden:false;

				if (!hidden) 
				{
					button.setText('⇀');
					elem.hideAllChildNodes(button);

					elem.childsHidden = true;
				} else {
					button.setText('↽');
					elem.showAllChildNodes(button);

					elem.childsHidden = false;
				}
			}
		},

		compile: function(elem)
		{	
			var params = 
				{
					type:    "innerElement",
					class:   "MenuButton",
					content: "↽",
					style: 
					{
						position: 	   	 'absolute',
						right:    	   	 '0%',
						bottom:   	  	 '0%',
						color:        	 elem.getStyleAttribute('color'),
						'font-size':  	 (elem.getStyleAttribute('font-size') + 5) + 'px'
					}
				},
				button = elem.core.compileElement(params, elem);

			button.domElement.addEventListener(this.event, this.def(elem, button));
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

				elem.caption.connectEffect('flip_2', true);
				elem.caption.domElement.addEventListener(
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
				elem.caption.domElement.addEventListener(this.event, self['hide list 1'].def(elem, 50));
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
				elem.caption.domElement.addEventListener(this.event, self['hide list 1'].def(elem, 50, self['letters disappear'].def, self['letters showing'].def));
			} else {
				__ErrorsCatcher__.catch('Effects Error', 0, ['hide list', 'caption']);
			}
		}
	}

	OOPMethods.inheritance(parents);
}


function FocusEffects(master)
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
		];

	this.focus_1 = {
		event1: 'mouseout',
		event2: 'mouseover',

		compile: function(elem)
		{	
			var filer = (elem.domElement.style['filer'] !== undefined) ? elem.domElement.style['filer']:'none',
				def1     = function()
				{
					elem.domElement.style['filter'] = "opacity(0.7)";
				},
				def2     = function()
				{
					elem.domElement.style['filter'] = filer;
				};
		
			elem.domElement.addEventListener(this.event2, master.effectCompiller(this.event2, def1));
			elem.domElement.addEventListener(this.event1, master.effectCompiller(this.event1, def2));
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
			FlipEffects,
			DisplayEffects,
			FocusEffects
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
			for (var n=0; n < this.items.length; n++) 
			{
				this.items[n].connectEffect(effectName, forAllChilds);
			}
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
			ElementsRemoveFunctions,
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

	this.createNotTuchLable = function(master, style, content)
	{
		var params = {
			'type':      'HTMLCollection',
			'class':     'NotTuchLable',
			'htmlClass': 'button',
			'content': 	 content,
			'style':     style,
			'items':     []
		};
		
		params.style.border  = 'none';
		params.style.outline = 'none';

		return params;
	}

	this.appendItemsInTable = function(table, items, rowStyle, notEmpty)
	{
		var notEmpty = notEmpty || false;
		table.items  = (Array.isArray(table.items)) ? table.items:[table.items];;

		for (var n=0; n < items.length; n++)
		{
			var elem = items[n],
				tr   = {
					type:      'HTMLCollection',
					htmlClass: 'tr'
				},
				obj  = {
					type:      'HTMLCollection',
					htmlClass: 'td',
					style:     rowStyle,
					items:     elem
				};

			if (n === 0 && notEmpty) table.items.push(tr);
			
			table.items.push(obj);

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
		];

	this.__del__ = function()
	{
		this.removeChildren();
		this.domElement.parentNode.removeChild(this.domElement);

		for (var att in this) delete this[att];

		//self.masterUpdateObjectsList(); нужно сделать
	}

	this.removeChildren = function()
	{
		for (var n=0; n < this.domElement.childNodes.length; n++)
		{
			var child = this.domElement.childNodes[n];

			try {
				child.super.__del__();
			} catch(e) {
				child.innerHTML = "";
				child.parentNode.removeChild(child);
			}
		}
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
		];
	
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
		this.domElement.style.height = val;
	}
	
	this.setWidth = function(val)
	{
		this.domElement.style.width = val;
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
		this.removeChildren();
		this.domElement.parentNode.removeChild(this.domElement);

		for (var att in this) delete this[att];

		//self.masterUpdateObjectsList(); нужно сделать
	}

	this.removeChildren = function()
	{
		for (var n=0; n < this.domElement.childNodes.length; n++)
		{
			var child = this.domElement.childNodes[n];

			try {
				child.super.__del__();
			} catch(e) {
				child.innerHTML = "";
				child.parentNode.removeChild(child);
			}
		}
	}

	OOPMethods.inheritance(parents);
}


function Сompiler()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			Obj,
			Formatting
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
		child.style 	    = this.elementStyleCompile(exemplar.style, child.style); 
		
		if (child.effects !== undefined) child.effects = this.arrayAddition(exemplar.effects, child.effects, true);
		
		this.objectAddition(exemplar, child);
		this.connectInnerAttsToHTMLObject(exemplar, element, child);
		
		if (!notAppend) master.appendChild(element);
		
		return exemplar; 
	}

	this.elementStyleCompile = function(elem, params)
	{
		for (var key in params)
		{
			var val = params[key]
				att = elem[key];
			
			if ((typeof val) === 'object' && (typeof att) === 'object') 
			{
				elem[key] = this.objectAddition(att, val);
			}
			else if ((typeof val) === 'string')
			{
				elem[key] = self.replaceKeyInStringByExemplarVariable(val);
			} else {
				elem[key] = val;
			}
		}

		return elem;
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
		
		label.style      = this.objectAddition(el.style.label, label.style);
		label.content    = label.content;
		label.domElement = this.connectInnerAttsToHTMLObject(label, elem, el);
		
		if (label.position === 'left' || label.position === 'top')   
		{
			domElement.insertBefore(label.domElement, domElement.firstChild);
		} else {
		    domElement.appendChild(label.domElement);
		}

		return label;
	}

	this.connectInnerAttsToHTMLObject = function(innerElement, HTMLElement, paramsForElement)
	{
		var title = (HTMLElement.title !== undefined) ? HTMLElement.title:innerElement.compile_parameters.title;

		if (innerElement.content !== undefined) 
		{
			HTMLElement.innerHTML += "<div>" + innerElement.content.trim() +  "</div>";
			HTMLElement.title      = (title !== undefined) ? title:this.stringSlice(HTMLElement.innerText, 40);
		}

		this.elementStyleCompile(HTMLElement.style, innerElement.style);
		this.objectAddition(HTMLElement, innerElement.events);
		this.generateDictWithIdAndClassAttributs(innerElement, HTMLElement);

		return HTMLElement;
	}
	
	this.afterCompile   = function(el, compiled)
	{
		compiled.compile_parameters = el;
		compiled.core               = this;
		compiled.domElement.super   = compiled;

		this.objectAddition(compiled, new ElementsDefaultFunction());
		
		if (compiled.effects)                this.appendFunctionOnInnerElementOnRender(compiled);
		if (compiled.onRender !== undefined) compiled.onRender();
		if (el.label)                        compiled.label = this.compileTextLabel(compiled, el.label);

		compiled.master.items.push(compiled);
		this.objects.push(compiled);
	}

	this.compileElement = function(el, master, notAppend)
	{
		var type      = el.type
			elem      = undefined,
			notAppend = notAppend || false;
		
		master                = el.master = (el.master !== undefined) ? el.master:master;
		master.items          = (master.items !== undefined) ? master.items:[];

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

	this.removeDuplicate = function(arr)
	{
		var set =  new Set(arr);

		return Array.from(set);
	}

	// Слияние списков
 	this.arrayAddition = function(arr1, arr2, remDup)
 	{
 		var loop   = (loop   !== undefined) ? loop:false,
 			arr1   = (arr1   !== undefined) ? arr1:[],
 			arr2   = (arr2   !== undefined) ? arr2:[],
 			remDup = (remDup !== undefined) ? remDup:false,
 			loop   = arr2.length;

 		for (var n=0; n < loop; n++) arr1.push(arr2[n]);
 		
 		if (remDup) arr1 = this.removeDuplicate(arr1, arr2);
 		
 		return arr1;
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
		var mainView = this.changeView(view, window['mainView']);

		document.body.style.background         = mainView.style.background;
		document.body.style['background-size'] = (mainView.style['background-size'] !== undefined) ? mainView.style['background-size']:'100%';
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

	this.setBackground = function(val)
	{
		self.domElement.style['background'] = this.replaceKeyInStringByExemplarVariable(val);
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


function __Core__(debug)
{
	var self  	   = this,					
		OOPMethods = new OOP(this),
		parents    = [
			Element,
			Сompiler,
			Formatting,
			HTMLElement,
			Obj,
			PathParser,
			Sheduler,
			__LocalStorage__,
			View,
			Win
		];
	
	// Задания.
	this.shedules = {
		onLoad: [{
			title: 'Connect modules and elements', 
			
			run:  function()
			{
				var master = document.getElementsByTagName('head')[0],
					paths  = [
						self.config.modules, 
						self.config.style,
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
			title: 'Change Style for device', 
			
			run:  function()
			{
				var style = window[self.style.title];

				if(window.innerWidth <= 800 && window.innerHeight <= 600 && (window.innerWidth >= window.innerHeight)) 
				{
					self.style.parameters = self.viewStyleCompile(style, 'mobile');
				} else {
					self.style.parameters = self.viewStyleCompile(style, 'desktop');
				}
			}
		}, {
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
		window['__debug__'] = debug;
		this.parents   		= OOPMethods.inheritance(parents);
		this.FramePath 		= this.getScriptPathByMatchWord("__core__.js");
		this.config         = window["__config__"];
		window['FramePath'] = this.FramePath;
		
		this.start_schedules('onLoad'); 
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
			
			if ((key === "id") || (key === "class"))
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