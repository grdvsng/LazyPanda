var index_view_main = function(core)
{
	var self   = this,
		than   = core,
		master = master;

	this.class  = "DefaultView";
	this.master = {
		id:   "__MainBody__",
		type: "HTMLCollection"
	};

	this.style = {
		width:      "100%",
		height:     "100%",
		fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
	}
	
	this.background = {
		type:  "color",
		value: than.config.window.colors[10]
	}
	
	this.items = [{
		type: "inner",
		class: "MenuPanel",

		style: {
			backgroundColor: than.config.window.colors[0],
			fontFamily:      this.style.fontFamily,
			color:           "black"
		},

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
};