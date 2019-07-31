function __Core__(MyPath)
{
	var self = this;

	this.mainView = {
		title: null,
		coreElement: null
	}

	this.shedules = {
		onLoad: [{
			title: 'Connect modules and elements', 
			
			run:  function()
			{
				var master = document.getElementsByTagName('head')[0];

				self.globalStartConnector(self.config.modules, 'script', master, 'src');
				self.globalStartConnector(self.config.elements, 'script', master, 'src');
				self.globalStartConnector(self.config.views.viewsList, 'script', master, 'src');
			}
		}],

		onStart: [{
			title: 'Set MainView', 
			
			run: function() 
			{
				var view    = localStorage.getItem('mainView'),
					defView = self.config.views.mainView;
				
				if ((view === null) || (view === undefined)) 
				{
					self.mainView.title = defView;
					self.changeMainView(self.mainView);
				} else {
					self.changeMainView(view);
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
		}]
	}

	this.__init__ = function(MyPath)
	{
		this.FramePath = MyPath.replace(/\/$/g,"");
		this.config    = window["__config__"];

		this.start_schedules('onLoad'); 
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
		if ((el.type === "inner") && (el.class === "page"))
		{
			this.compileInnerElement(el);	
		}
		else if ((el.type === "inner") && (el.class !== "page"))
		{
			this.compilePageElement(el);	
		} else {
			this.compileHTMLElement(el);
		}
	}

	this.compileHTMLElement = function(el)
	{
	}

	this.compileInnerElement = function(el)
	{
	}

	this.compilePageElement = function(el)
	{
	}

	this.changeMainView = function(view)
	{
		this.mainView = view;
		this.destView();

		if (view.coreElement === null) view.coreElement = this.compileCoreElement(view.title);
		
		this.compileElement(view.coreElement);
		//localStorage.setItem('mainView', view);
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
			shablone   = "{title}\n{line}\n{body}\n{line}\nGlobal Error:\n{ge}\n{line}\n\n",
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

	this.globalStartConnector = function(listOfElems, elemsType, elemsMaster, paramType)
	{	
		for (var n in listOfElems)
		{
			var elem   = document.createElement(elemsType),
				val    = listOfElems[n],
				params = {};

			params[paramType] = this.replaceKeyInStringByCoreVariable(val);
			this.connect(elem, elemsMaster, params);
		}
	}

	this.replaceKeyInStringByCoreVariable = function(str)
	{
		var list = str.match(/(?<=\{).*?(?=\})/g),
			args = {};

		if (list !== undefined && list !== null)
		{
			for (var n=0; n < list.length; n++)
			{
				var key = list[n],
					val = this[key];

				if (val === undefined || val === null) 
				{
					this.errorCatcher('Replace Key In String By Core Variable', 0, key, e);
				} else {
					args[key] = val;
				}
			}
		}

		return this.format(str, args);
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