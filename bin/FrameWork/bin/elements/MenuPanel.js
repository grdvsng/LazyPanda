var MenuPanel = function(core, child, master)
{
	var self = this,
		than = core;
	
	this.class      = "MenuPanel";
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "table":child.htmlClass;
	this.type       = "innerElement";
	this.position   = (child.position  === undefined) ? 0:child.position;
	this.positions  = [{
			top:         '0px',
			left:        '0px',
			right:       '0px',
			width:       '100%'
		}, {
			style: 
			{
				top:     '0px',
				left:    '0px',
				height:  '100%'
			},

			render: function()
			{
				self.makeLineBetweenChildNodes();
			}
		}, {
			bottom:     '0px',
			left:       '0px',
			right:      '0px',
			width:      '100%'	
		}, {
			style: 
			{
				top:    '0px',
				right:  '0px',
				height: '100%'
			},

			render: function()
			{
				self.makeLineBetweenChildNodes();
			}
	}]

	this.effects = [
		'scroller'
	];

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