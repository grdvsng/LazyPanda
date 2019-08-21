var MenuPanel = function(core, child, master)
{
	var self = this,
		than = core;
	
	this.class      = "MenuPanel";
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "table":child.htmlClass;
	this.style      = than.style.parameters[this.class];
	this.type       = "innerElement";
	this.position   = (child.position  === undefined) ? 0:child.position;
	this.positions  = [{
			top:         '0%',
			left:        '0%',
			right:       '0%',
			width:       '100%'
		}, {
			style: 
			{
				top:     '0%',
				left:    '0%',
				height:  '100%'
			},

			render: function()
			{
				self.makeLineBetweenChildNodes();
			}
		}, {
			bottom:     '0%',
			left:       '0%',
			right:      '0%',
			width:      '100%'	
		}, {
			style: 
			{
				top:    '0%',
				right:  '0%',
				height: '100%'
			},

			render: function()
			{
				self.makeLineBetweenChildNodes();
			}
	}]

	this.effects = than.arrayAddition(child.effects, ['scroller']);

	this.changePos = function(positionNumber)
	{
		var pos = self.positions[positionNumber];

		if (pos.render)
		{
			pos.render();
			pos = pos.style;
		} 
		
		than.objectAddition(self.domElement.style, pos);
		
	}

	this.onRender = function()
	{
		var newWidth = self.getChildNodesMaxWidth(self);

		self.makeInnerWidthForChildNodes(newWidth);
		self.changePos(self.position);
	}
}