var DefaultView = function(core, child, master)
{
	var self = this,
		than = core;

	this.type       = "View";
	this.class      = "DefaultView";
	this.master     = null;
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "div":child.htmlClass;
	this.items      = null;
};