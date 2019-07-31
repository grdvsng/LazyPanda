var DefaultView = function(core, child)
{
	var self = this,
		than = core;

	this.type   = "View";
	this.master = null;

	this.style = {
		fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
	}
	
	this.background = {
		type:  "color",
		value: "white"
	}
	
	this.items = null

	this.compile = function(child)
	{
		this.style = than.modules.MethodsForObjects.objectAddition(this.style, child.style);
		
		than.modules.MethodsForObjects.objectAddition(this, child);
		than.setBackground(this.background);

		return this;
	}

	this.compile(child);
};