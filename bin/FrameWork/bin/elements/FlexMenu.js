var FlexMenu = function(core, child, master)
{
	var self  = this,
		than  = core,
		child = child;
	
	this.class          = "FlexMenu";
	this.defaultLabel   = {position: 'left'};
	this.domElement     = null;
	this.domElementType = "table";
	this.type           = "innerElement";
	this.style          = than.style.parameters[this.class];

	this.effects = [
		'pursuit of scroll'
	]

    this.innerItems     = [{
		type:      "HTMLCollection",
		htmlClass: "td",

		items: [{
			type:      "HTMLCollection",
			htmlClass: "div",
			style:     self.style['inner line']
		}, {
			type:      "HTMLCollection",
			htmlClass: "div",
			style:     self.style['inner line']
		}, {
			type:      "HTMLCollection",
			htmlClass: "div",
			style:     self.style['inner line']
		}]
    }]
	
	this.onRender = function()
	{
		var rect = this.domElement.getBoundingClientRect();
		
		this.domElement.style.height = (this.label) ? ((rect.height * 1.3) + 'px'):(rect.width + 'px');
	}
	
	this.compile = function(child, master)
	{
		this.items  = child.items;
		child.items = this.innerItems;

		if (!child['auto-position']) this.effects.splice(0, 1);
		
		than.elementCoreCompile(this, child, master);
		
		return this;
	}

	this.compile(child, master);
};