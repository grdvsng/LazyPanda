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
		'hide list 2'
	]

	this.converChildItemsToList = function(items)
	{
		var caption = than.createNotTuchLable(child.master, self.style['ul'], self.content),
			table   = {
				items: [{
					type:      'HTMLCollection', 
					htmlClass: 'th',
					style:     self.style['ul'],
					class:     'caption',
					items:     caption
				}]
			};

		than.appendItemsInTable(table, items, self.style['ul']['li'], true);

		self.caption = table.items[0];

		return table.items;
	}

	this.compile = function(child, master)
	{
		child.items   = this.converChildItemsToList(child.items);
		child.content = undefined;
	}

	this.compile(child, master); 
};