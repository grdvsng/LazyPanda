var List = function(core, child, master)
{
	var self = this,
		than = core;

	this.type       = "innerElement";
	this.class      = "List";
	this.master     = null;
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "div":child.htmlClass;
	this.style      = than.style.parameters[this.class];
	this.items      = null;
	this.content    = (child !== undefined) ? child.content:"";
	this.effects    = [
		'hide list'
	]

	this.converChildItemsToList = function(items)
	{
		var td     = {
				type:      'HTMLCollection', 
				htmlClass: 'table',
			},
			child  = {
				type:      'HTMLCollection', 
				htmlClass: 'th',
				content:   than.createNotTuchLable(self.content, self.style['ul']),
				style:     self.style['ul']
			},
			_items = [];

		for (var n=0; n < items.length; n++)
		{
			var elem = items[n],
				tr   = {
					type:      'HTMLCollection',
					htmlClass: 'tr',
				},
				obj  = {
					type:      'HTMLCollection',
					htmlClass: 'td',
					style:     self.style['ul']['li'],
					items:     [elem]
				};

			_items.push(obj);
			if (n != items.length) _items.push(tr);
		}
		
		child.items = _items;
		td.items    = [child];

		return [td];
	}

	this.compile = function(child, master)
	{
		child.items   = this.converChildItemsToList(child.items);
		child.content = undefined;
	}

	this.compile(child, master); 
};