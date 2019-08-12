var MenuButton = function(core, child, master)
{
	var self = this,
		than = core;

	this.class          = "MenuButton";
	this.domElement     = null;
	this.domElementType = "button";
	this.type           = "innerElement";
	this.style          = than.style.parameters[this.class];

	this.setText = function(data)
	{
		self.domElement.innerText = data;
	}

	this.compile = function(child, master)
	{
		than.elementCoreCompile(this, child, master);

		return this;
	}

	this.compile(child, master);
}