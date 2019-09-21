var MenuButton = function(core, child, master)
{
	var self = this,
		than = core;

	this.class      = "MenuButton";
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "button":child.htmlClass;
	this.type       = "innerElement";
	this.effects    = [
		'flip_2',
		'focus_1'
	]

	
	this.setText = function(data)
	{
		self.domElement.innerText = data;
	}

	this.compile = function(child, master)
	{
		child.content = (child.content !== undefined &&  child.content !== "") ? "<div>" + child.content + "</div>":"";
	}

	this.compile(child, master); 
}