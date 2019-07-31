function __Core__(MyPath)
{
	var self = this;

	this.modules = {
	}

	this.elements = {
	}

	this.mainView = {
		title: null,
		coreElement: null
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

	this.shedules = {
		onLoad: [{
			title: 'Connect modules and elements', 
			
			run:  function()
			{
				var master = document.getElementsByTagName('head')[0];

				self.globalStartConnector(self.config.modules,         'script', master, 'src');
				self.globalStartConnector(self.config.elements,        'script', master, 'src');
				self.globalStartConnector(self.config.views.viewsList, 'script', master, 'src');
			}
		}],

		onStart: [{
			title: 'Set MainView', 
			
			run: function() 
			{
				var view    = self.localStorage.getItem('mainView'),
					defView = self.config.views.mainView;
				
				if ((view === null) || (view === undefined)) 
				{
					self.mainView.title = defView;
					self.changeMainView(self.mainView);
				} else {
					self.changeMainView(view);
				}
			}
		}, {
			title: 'Connect modules', 
			
			run: function() 
			{
				for (var key in self.modules)
				{
					var att = window[key];

					if ((att !== undefined) || (att !== null))
					{
						self.modules[key] = new att();
					} else {
						this.errorCatcher('Append Method or Elems Key Error', 1, key, "Inner Error");
					}
				}
			}
		}, {
			title: 'Connect elements', 
			
			run: function() 
			{
				for (var key in self.elements)
				{
					var att = window[key];

					if ((att !== undefined) || (att !== null))
					{
						self.elements[key] = att;
					} else {
						this.errorCatcher('Append Method or Elems Key Error', 1, key, "Inner Error");
					}
				}
			}
		}]
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
		}]
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
			this.elements[attKey] = null;
		}
		else if (path.match(/elements/g)) 
		{
			this.modules[attKey]  = null;
		} else if (!path.match(/view/g)){
			this.errorCatcher('Append Method or Elems Key Error', 0, attKey, "Inner Error");
		}
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

	this.compileCoreElement = function(viewName)
	{
		var params = window[viewName];

		if ((params === undefined) || (params === null))
		{
			this.errorCatcher('View Error', 1, viewName, "Inner Error");
		} else {
			params = new params(this);
		}

		return params;
	}

	this.compileElement = function(el)
	{
		var type = el.type;
		
		if (type === "HTMLCollection") this.compileHTMLElement(el);
		if (type === "innerElement")   this.compileInnerElement(el);	
		if (type === "page")           this.compilePageElement(el);	
	}

	this.compileHTMLElement = function(el)
	{
	}

	this.compileInnerElement = function(el)
	{
	}

	this.compilePageElement = function(el)
	{
		var bg = el.background;
		
		if (bg !== undefined) this.setBackground(bg);
	}

	this.changeMainView = function(view)
	{
		this.mainView = view;
		this.destView();

		if (view.coreElement === null) view.coreElement = this.compileCoreElement(view.title);
		
		this.compileElement(view.coreElement);
		//self.localStorage.setItem('mainView', view);
	}

	this.destView = function(View)
	{
		var body = document.getElementsByTagName('body')[0];

		body.innerHtml = "";
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

	this.getAndCallMainFunctionFromElemPath = function(path)
	{
		var cleanName = path.replace(/(?!\/).*?(?=\/)|\//g, "").split('.')[0];
		
		return window[cleanName];
	}

	this.getMethodVaribleByPath = function(val)
	{
		var result  = val.match(/\/{1,1}[^\/]+\.{1,1}/g),
			varible = ((typeof result) === "object") ? result[0].replace(/[\.\/]/g, ""):undefined;
	
		return varible;
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

	this.start_schedules = function(shedulesName)
	{
		var shedules = (this.shedules[shedulesName] !== undefined) ? this.shedules[shedulesName]:false;

		if (!shedules) this.errorCatcher('Shedules Error', 0, shedulesName);

		for (var n=0; n < shedules.length; n++)
		{
			var shedule = shedules[n];

			try {
				shedule.run = (shedule.run !== undefined) ? shedule.run:shedule.compile(this, shedule.compileArgs);
				shedule.run();
			} catch(e) {
				this.errorCatcher('Shedules Error', 1, shedule.title, e);
			}
		}
	} 

	this.__init__(MyPath);
}