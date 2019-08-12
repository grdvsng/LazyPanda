var FlexMenu = function(core, child, master)
{
	var self  = this,
		than  = core,
		child = child;
	
	this.class        = "FlexMenu";
	this.defaultLabel = {position: 'left'};
	this.domElement   = null;
	this.htmlClass    = (child.htmlClass === undefined) ? "table":child.htmlClass;
	this.type         = "innerElement";
	this.style        = than.style.parameters[this.class];

	this.effects = [
		'pursuit of scroll',
		'click effect 1'
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
		var rect = self.domElement.getBoundingClientRect();

		self.domElement.style.height = (self.label) ? ((rect.height * 1.3) + 'px'):(rect.width + 'px');
	}
	
	this.compile = function(child, master)
	{
		self.items  = child.items;
		child.items = this.innerItems;

		if (!child['auto-position']) this.effects.splice(0, 1);
	}

	this.compile(child, master);
};