function __Core__(MyPath, debug)
{
	var self  = this,
		debug = (debug !== undefined);

	this.style = {
		title: null,
		parameters: null
	}

	this.elements = {
	}

	this.UI_effects = {
		'pursuit of scroll':
		{
			event: 'scroll',

			def: function(target)
			{
				return function()
				{
					target.style.top = self.scrollTop();
				}
			},

			compile: function(innerElement)
			{
				var elem = innerElement.domElement,
					func = this.def(elem);

				document.addEventListener(this.event, func);
			}
		},

		'click effect 1':
		{
			event: 'click',

			def: function(target)
			{
				return function()
				{
					target.style.top = self.scrollTop();
				}
			},

			compile: function(innerElement)
			{
				var elem = innerElement.domElement,
					func = this.def(elem);

				elem.addEventListener(this.event, func);
			}
		}
	}

	this.innerErrors = {
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
		}]
	}

	this.localStorage = {
		onError: function(e)
		{
			self.errorCatcher('Browser Error', 0, null, e);
		},

		getItem: function(key)
		{
			var result;
			
			try {
				result = localStorage.getItem(key);
			} catch(e) {
				result = undefined;
				this.onError(e);
			}

			return undefined;
		},

		setItem: function(key, data)
		{
			try {
				localStorage.setItem(key, data);
			} catch(e) {
				this.onError(e);
			}
		}
	}

	this.mainView = {
		title: null,
		data: null
	}

	this.modules = {
	}

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
				var view    = self.localStorage.getItem('mainView'),
					defView = self.config.views.mainView;
				
				if ((view === null) || (view === undefined)) 
				{
					self.changeMainView(defView);
				} else {
					self.changeMainView(view);
				}
			}
		}]
	}

	this.views = {
	}

	this.__init__ = function(MyPath)
	{
		this.FramePath = MyPath.replace(/\/$/g,"");
		this.config    = window["__config__"];

		this.start_schedules('onLoad'); 
	}

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

 	this.arrayAddition = function(arr1, arr2)
 	{
 		var arr1 = (arr1 !== undefined) ? arr1:[],
 			arr2 = (arr2 !== undefined) ? arr2:[];

 		for (var n=0; n < arr2.length; n++)
 		{
 			var val = arr2[n];

 			arr1.push(val);
 		}

 		return arr1;
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

	this.compileTextLabel = function(el, label)
	{
		var domElement = el.domElement,
			elemType   = (label.position !== 'top' && label.position !== 'bottom') ? 'td':'tr',
			elem       = document.createElement(elemType);
		
		label.style      = this.objectAddition(el.style.label, label.style);
		label.content    = "<span>" + label.content + "</span>";
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
		HTMLElement.innerHTML += (innerElement.content !== undefined) ? innerElement.content:"";
		
		this.objectAddition(HTMLElement.style, innerElement.style);
		this.objectAddition(HTMLElement, innerElement.events);
		this.generateDictWithIdAndClassAttributs(innerElement, HTMLElement);

		if (innerElement.effects) 
		{
			if (paramsForElement) this.arrayAddition(innerElement.effects, innerElement.paramsForElement);
			this.compileEffectsToElement(innerElement);
		}

		return HTMLElement;
	}

	this.compileElement = function(el, master)
	{
		var type  = el.type;
		el.master = (el.master !== undefined) ? el.master:master;
		
		if (type === "HTMLCollection")   var elem = this.compileHTMLElement(el, master);
		if (type === "innerElement")     var elem = this.compileInnerElement(el, master);		
		if (elem.onRender !== undefined) elem.onRender();
	}

	this.compileEffectsToElement = function(innerElement)
	{
		var effects = innerElement.effects;

		for (var n=0; n < effects.length; n++)
		{
			var name = effects[n],
			    data = this.UI_effects[name];

		   data.compile(innerElement);
		}
	}

	this.compileHTMLElement = function(el, master)
	{
		var element = document.createElement(el.htmlClass),
			master  = (master.domElement === undefined) ? master:master.domElement,
			items   = el.items;

		this.connectInnerAttsToHTMLObject(el, element);
		if (items) this.compileElements(items, element);

		if (!debug) 
		{
			try      {master.appendChild(element);} 
			catch(e) {this.errorCatcher('Connect Element Error', 0, el.htmlClass, e);}
		} else {
			master.appendChild(element);
		}

		return element;
	}

	this.compileInnerElement = function(element, master)
	{
		var compiler = this.elements[element.class],
			master   = (element.master !== undefined) ? element.master:master,
			compiled = new compiler(this, element, master),
			items    = compiled.items,
			label    = element.label;

		if (items) this.compileElements(items, element);
		if (label) compiled.label = this.compileTextLabel(compiled, element.label);	
		
		return compiled;
	}
	
	this.compileElements = function(items, master)
	{
		for (var n in items)
		{
			var elem  = items[n];

			this.compileElement(elem, master);
		}
	}

	this.changeMainView = function(view, toDestroy)
	{
		var view = ((typeof view) === "object") ? view:this.getViewElement(view);

		if (toDestroy) this.destView(toDestroy);

		this.compileInnerElement(view);
		//self.localStorage.setItem('mainView', view);
	}

	this.changeHTMLElementTag = function(element, tag)
	{
		console.log(element, tag);
	}

 	this.createMirrorHTMLElement = function(element)
 	{

 	}

	this.destView = function(view)
	{
		var master = document.getElementById(view.master.id);

		master.innerHtml = "";
	}

	this.elementCoreCompile = function(elemConstructor, child, master)
	{
		var element = document.createElement(elemConstructor.domElementType),
			master  = this.getMaster(master);
		
		elemConstructor.style      = this.objectAddition(elemConstructor.style, child.style);
		elemConstructor.domElement = element;
		elemConstructor            = this.objectAddition(elemConstructor, child);

		this.connectInnerAttsToHTMLObject(elemConstructor, element, child);

		if (!debug) 
		{
			try {
				master.appendChild(element);
			} catch(e) {
				this.errorCatcher('Connect Element Error', 0, elemConstructor.domElement, e);
			}
		} else {
			master.appendChild(element);
		} 
	}
	
	this.elementStyleCompile = function(el, params)
	{
		var elem = el;

		for (var key in params)
		{
			var val = params[key]
				att = elem[key];
			
			if ((typeof val) === 'object' && (typeof att) === 'object') 
			{
				elem[key] = this.objectAddition(att, val);
			} else {
				elem[key] = val;
			}
		}

		return elem;
	}

	this.errorCatcher = function(errorType, errorNumber, args, browseError)
	{
		var error      = this.innerErrors[errorType][errorNumber],
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

	this.getAndCallMainFunctionFromElemPath = function(path)
	{
		var cleanName = path.replace(/(?!\/).*?(?=\/)|\//g, "").split('.')[0];
		
		return window[cleanName];
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
	
	this.getMethodVaribleByPath = function(val)
	{
		var result  = val.match(/\/{1,1}[^\/]+\.{1,1}/g),
			varible = ((typeof result) === "object") ? result[0].replace(/[\.\/]/g, ""):undefined;
	
		return varible;
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

	this.globalStartConnector = function(listOfElems, elemsType, elemsMaster, paramType)
	{	
		for (var n in listOfElems)
		{
			var elem   = document.createElement(elemsType),
				val    = listOfElems[n],
				params = {},
				attKey = this.getMethodVaribleByPath(val);

			if (attKey !== undefined) this.appendMethodOrElemKey(val, attKey);
			params[paramType] = this.replaceKeyInStringByCoreVariable(val);
			
			this.connect(elem, elemsMaster, params);
		}
	}

	this.objectAddition = function(mainObject, addObject, appended)
	{
		var currentObject = (mainObject !== undefined) ? mainObject:{},
			addObject     = (addObject !== undefined)  ? addObject:{};

		for (var att in addObject)
		{
			currentObject[att] = addObject[att];
		}

		if (appended === undefined) 
		{
			currentObject = this.objectAddition(addObject, currentObject, true);
		}
		
		return currentObject;
	}

	this.replaceKeyInStringByCoreVariable = function(str)
	{
		var list = str.match(/\{{1,1}(.+?)\}{1,1}/g),
			args = {};

		if (list !== undefined && list !== null)
		{
			for (var n=0; n < list.length; n++)
			{
				var key = list[n].replace(/[\{\}]/g, ""),
					val = this[key];

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

	this.scrollTop = function() 
	{
		var scrollY = (window.scrollY) ? window.scrollY:0,
			rect    = document.body.getBoundingClientRect(),
			result  = Math.max(scrollY, window.pageYOffset, rect.top);
		
		return result + 'px';
	}

	this.setBackground = function(backGround)
	{
		var type = backGround.type;
		
		if (type === "walpers") 
		{
			this.setBackgroundWalpers(backGround.value);
		}
		else if (type === "color")   
		{
			this.setBackgroundColor(backGround.value);
		}
		else if (type !== undefined) 
		{
			this.errorCatcher('Background Error', 0, [backGround, type], "Inner Error");
		} else {
			// type not in ("walpers", "walpers") and type === undefined
			this.errorCatcher('Background Error', 1, backGround, "Inner Error");
		}                     
	}
	
	this.setBackgroundWalpers = function(value)
	{
		var style = document.getElementsByTagName('body')[0].style;
		
		style.backgroundImage = "url('" + value + "')";
	}

	this.setBackgroundColor = function(value)
	{
		var body = document.getElementsByTagName('body')[0];

		body.style.backgroundColor = value;
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

	this.start_schedules = function(shedulesName)
	{
		var shedules = (this.shedules[shedulesName] !== undefined) ? this.shedules[shedulesName]:false;

		if (!shedules) this.errorCatcher('Shedules Error', 0, shedulesName);

		for (var n=0; n < shedules.length; n++)
		{
			var shedule = shedules[n];
			shedule.run = (shedule.run !== undefined) ? shedule.run:shedule.compile(this, shedule.compileArgs);

				if (!debug) 
				{
					try {shedule.run();} 
					catch(e) {this.errorCatcher('Shedules Error', 1, shedule.title, e);}
				} else {
					shedule.run();
				}
		}
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

	this.__init__(MyPath);
}