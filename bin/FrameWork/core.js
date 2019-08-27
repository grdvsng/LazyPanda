function __LocalStorage__()
{
	var OOPMethods = new OOP(this),
		self       = this,
		parents    = [
			ErrorsCatcher
		];

	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.LocalStorageOnError = function(e)
	{
		self.errorCatcher('Browser Error', 0, null, e);
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

	this.flip_1 = {
		event: 'click',

		compile: function(elem)
		{
			var def = function()
			{
				var size = elem.getSize(),
					nowX = size.height          + 'px',
					nowY = size.width           + 'px',
					newX = (size.height * 0.95) + 'px',
					newY = (size.width  * 0.95) + 'px';
				
				elem.resize(newX, newY);
				setTimeout(function()
				{
					elem.resize(nowX, nowY);
				}, 100);
			};

			elem.domElement.addEventListener(this.event, master.effectCompiller(this.event, def));
		}
	}

	this.flip_2 = {
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

	this['hide panel button'] = {
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
					elem.showAllChildNodes();

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
			Element,
			UIEffects
		];
	
	this.connectEffect = function(effectName)
	{
		var effect = self[effectName];
		
		return effect.compile(this);
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

	this.__init__ = function()
	{
		OOPMethods.inheritance(parents);
	}

	this.__init__();
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

	this.createNotTuchLable = function(content)
	{
		var obj = '<span><button style="     \
				font-family:      inherit;  \
				font-weight:      inherit;  \
				font-size:        inherit;  \
				background-color: inherit;  \
				position:         relative; \
				border:           none;	    \
				text-align:       inherit;  \
				color:         	  inherit;	\
				outline:          none 		\
				" onclick="" title="' + content + '">' + content + '</button></span>';        
				
		return obj;
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

	this.setDisplayModeForAllChildNodes = function(mode, _except)
	{
		var children = this.items,
			mode     = (mode !== undefined) ? mode:'show';

		for (var n=0; n < children.length; n++)
		{
			var child = children[n];

			if (child !== _except) child[mode]();
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
		this.domElement.display       = this.domElement.style.display;
		this.domElement.style.display = 'none';
	}

	this.show = function()
	{
		this.domElement.style.display = (this.domElement.display  !== undefined) ? this.domElement.display:'block';
	}

	this.hideAllChildNodes = function(_except)
	{
		this.setDisplayModeForAllChildNodes('hide', _except);
	}

	this.showAllChildNodes = function(_except)
	{
		this.setDisplayModeForAllChildNodes('show', _except);
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


function ErrorsCatcher()
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
		}],

		'Files Errors': [{
			type:    "error",
			message: "No one script match '{0}'."
		}]
	}

	this.errorCatcher = function(errorType, errorNumber, args, browseError)
	{
		var error      = this.errors[errorType][errorNumber],
			body       = this.format(error.message, args),
			line       = "-".repeat(body.length),
			shablone   = "{title}\n{line}\n{body}\n{line}\nBrowser Error:\n{ge}\n{line}\n\n",
			curMessage = this.format(shablone, {'title': errorType, 'line': line, 'body': body, 'ge': browseError});

		if (error.type === 'warning') 
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


	this.elementCoreCompile = function(exemplar, child, master)
	{
		var element = document.createElement(exemplar.htmlClass),
			master  = this.getMaster(master);
		
		child.style      = this.elementStyleCompile(exemplar.style, child.style);
		child.domElement = element;
		child            = this.objectAddition(exemplar, child);

		this.connectInnerAttsToHTMLObject(exemplar, element, child);
		master.appendChild(element);

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

	this.generateID = function(element, replace)
	{
		var replace = !(replace !== undefined),
			old_ID  = element.domElement.id,
			new_ID  = element.domElement.className + "_" + document.getElementsByClassName(element.domElement.className).length;
		
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
		if (innerElement.content !== undefined) 
		{
			HTMLElement.innerHTML += "<div>" + innerElement.content.trim() +  "</div>";
			HTMLElement.title      = HTMLElement.innerText
		}

		this.elementStyleCompile(HTMLElement.style, innerElement.style);
		this.objectAddition(HTMLElement, innerElement.events);
		this.generateDictWithIdAndClassAttributs(innerElement, HTMLElement);

		return HTMLElement;
	}
	
	this.afterCompile   = function(el, compiled)
	{
		compiled.core             = this;
		compiled.domElement.super = compiled;

		this.objectAddition(compiled, new ElementsDefaultFunction);
		
		if (compiled.effects) 
		{
		    this.appendFunctionOnInnerElementOnRender(compiled);     
		}
        
		if (compiled.onRender !== undefined) compiled.onRender();
		if (el.label)                        compiled.label = this.compileTextLabel(compiled, el.label);	

		compiled.master.items.push(compiled);
		this.objects.push(compiled);
	}

	this.compileElement = function(el, master)
	{
		var type  = el.type
			elem  = undefined;
		
		el.compile_parameters = this.cloneObject(el);
		master                = el.master = (el.master !== undefined) ? el.master:master;

		if (type === "HTMLCollection")   elem = this.compileHTMLElement(el, master);
		if (type === "innerElement")     elem = this.compileInnerElement(el, master);		
		
		this.afterCompile(el, elem);

		return elem;
	}

	this.compileElements = function(master)
	{
		var items = this.cloneArray(master.items);
		master.items = [];

		for (var n in items) this.compileElement(items[n], master);
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

	this.compileHTMLElement = function(el, master)
	{
		var element = document.createElement(el.htmlClass),
			master  = (master.domElement === undefined) ? master:master.domElement;
		
		this.connectInnerAttsToHTMLObject(el, element);
		
		el.compile_parameters = el;
		el.domElement         = element;

		if (el.items) this.compileElements(el);

		master.appendChild(element);

		return el;
	}

	this.compileInnerElement = function(element, master)
	{
		var compiler = this.elements[element.class],
			master   = (element.master !== undefined) ? element.master:master,
			exemplar = new compiler(this, element, master),
			compiled = this.elementCoreCompile(exemplar, element, master);

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
			ErrorsCatcher
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
					this.errorCatcher('Replace Key In String By Core Variable', 0, key, "Inner Error");
				} else {
					args[key] = val;
				}
			}
		}

		return this.format(str, args);
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
			}  
		}

		if (result === undefined && !debug)
		{
			this.errorCatcher('Files Errors', 0, word, "Inner Error");
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

	// Слияние списков
 	this.arrayAddition = function(arr1, arr2)
 	{
 		var loop = (loop !== undefined) ? loop:false,
 			arr1 = (arr1 !== undefined) ? arr1:[],
 			arr2 = (arr2 !== undefined) ? arr2:[];

		if (arr1.length > arr2.length)
		{
			var temp = this.cloneArray(arr1);

			arr1 = this.cloneArray(arr2);
			arr2 = temp;
		}

 		for (var n=0; n < arr2.length; n++)
 		{
 			var val = arr2[n];

 			arr1.push(val);
 		}

 		return arr1;
 	}

 	// Слияние объектов.
 	this.objectAddition = function(mainObject, addObject, specialParser)
	{
		var specialParser = (specialParser !== undefined) ? specialParser:false,
			currentObject = (mainObject !== undefined)    ? mainObject:{},
			addObject     = (addObject !== undefined)     ? addObject:{};

		for (var att in addObject)
		{
			var val = addObject[att];

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

		if (!shedules) this.errorCatcher('Shedules Error', 0, shedulesName);

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

	this.changeMainView = function(view, toDestroy)
	{
		var view     = ((typeof view) === "object") ? view:this.getViewElement(view),
			mainView = this.compileInnerElement(view);

		if (toDestroy) this.destView(toDestroy);
		
		document.body.style.background         = mainView.style.background;
		document.body.style['background-size'] = (mainView.style['background-size'] !== undefined) ? mainView.style['background-size']:'100%';
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
			this.errorCatcher('View Error', 1, viewName, "Inner Error");
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

	this.__init__();
}


function __Core__(debug)
{
	var self  	   = this,					
		OOPMethods = new OOP(this),
		debug 	   = (debug !== undefined) ? debug:false,
		parents    = [
			Element,
			ErrorsCatcher,
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
		}]
	}

	this.elements = {
	}
	
	// Все подключенные объекты.
	this.objects = [
	]

	// Главное представление страницы.
	this.mainView = {
		title: null,
		data: null
	}

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
	this.__init__ = function()
	{
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
			this.errorCatcher('Append Method or Elems Key Error', 0, attKey, "Inner Error");
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
				this.errorCatcher('Append Method or Elems Key Error', 1, key, "Inner Error");
			}
		}
	}

	this.__init__();
}