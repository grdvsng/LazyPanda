var FlexMenu = function(core, child, master)
{
	var self  = this,
		than  = core,
		child = child;
	
	this.class        = "FlexMenu";
	this.defaultLabel = {position: 'left'};
	this.domElement   = null;
	this.htmlClass    = (child.htmlClass === undefined) ? "table":child.htmlClass;
	this.position     = (child.position  === undefined) ? 0:child.position;
	this.type         = "innerElement";

	this.positions = [{
			left:   '2%',
			top:    '2%'
		}, {
			left:   '2%',
			bottom: '2%'	
		}, {
			right:  '2%',
			top:    '2%'	
		}, {
			right:  '2%',
			bottom: '2%'	
	}]

	this.effects = [
		'scroller',
		'flip_1'
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
	
	this.changePos = function(positionNumber)
	{
		var pos = self.positions[positionNumber];

		than.objectAddition(self.domElement.style, pos);
	}

	this.onRender = function()
	{
		var rect = self.domElement.getBoundingClientRect();

		self.domElement.style.height = (self.label) ? ((rect.height * 1.3) + 'px'):(rect.width + 'px');
		
		self.changePos(self.position);
	}
	
	this.compile = function(child, master)
	{
		self.items   = child.items;
		child.items  = this.innerItems;
		scroller     = (child['scroller'] !== undefined) ? child['scroller']:false;

		if (!scroller) this.effects.splice(0, 1);
	}

	this.compile(child, master);
};