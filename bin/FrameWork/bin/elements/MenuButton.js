var MenuButton = function(core, child, master)
{
	var self = this,
		than = core;

	this.class      = "MenuButton";
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "button":child.htmlClass;
	this.type       = "innerElement";
	this.style      = than.style.parameters[this.class];

	this.setText = function(data)
	{
		self.domElement.innerText = data;
	}
}