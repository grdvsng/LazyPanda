var index_view_main = function(core)
{
	var self = this,
		than = core;

	this.type  = "inner";
	this.class = "page";

	this.items = [{
		type: "inner",
		class: "MenuPanel",
		items: [{
			type: "inner",
			class: "MenuButton",
			innerText: "Главная"
		}, {
			type: "inner",
			class: "MenuButton",
			innerText: "О Компании"
		}, {
			type: "inner",
			class: "MenuButton",
			innerText: "Контакты"
		}]
	}]

	this.__init__ = function()
	{
		
	}

	this.__init__();
};