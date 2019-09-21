var List = function(core, child, master)
{
	var self = this,
		than = core;

	this.type       = "innerElement";
	this.class      = "List";
	this.master     = null;
	this.domElement = null;
	this.htmlClass  = (child.htmlClass === undefined) ? "div":child.htmlClass;
	this.items      = null;
	this.content    = (child !== undefined) ? child.content:"";

	this.converChildItemsToList = function(items)
	{
		var caption = than.createNotTuchLable(child.master, self.content),
			table   = {
				items: [{
					type:      'HTMLCollection', 
					htmlClass: 'th',
					class:     'caption',
					items:     caption
				}]
			};

		than.appendItemsInTable(table, items, true);

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