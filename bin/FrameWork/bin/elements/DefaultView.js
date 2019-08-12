var DefaultView = function(core, child, master)
{
	var self = this,
		than = core;

	this.type       = "View";
	this.class      = "DefaultView";
	this.master     = null;
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "div":child.htmlClass;
	this.style      = than.style.parameters[this.class];
	
	this.background = this.style['back-ground'];
	this.items      = null;

	this.compile = function(child, master)
	{
		this.bg = (child.background !== undefined) ?  child.background:this.background;
		
		than.setBackground(this.bg);
	}

	this.compile(child, master);
};