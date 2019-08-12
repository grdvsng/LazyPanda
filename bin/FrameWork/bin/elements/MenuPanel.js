var MenuPanel = function(core, child, master)
{
	var self = this,
		than = core;
	
	this.class      = "MenuPanel";
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "table":child.htmlClass;
	this.style      = than.style.parameters[this.class];
	this.type       = "innerElement";
	
	this.position = {
		top: "1%",
		bottom: "0%"
	};

	this.compile = function(child, master)
	{
		var pos      = (child.position !== undefined) ? child.position:'top',
			position = this.position[pos];
		
		this.style   = than.modules.MethodsForObjects.objectAddition(position, this.style);
		child.master = this.master;
	}

	this.compile(child, master);
}