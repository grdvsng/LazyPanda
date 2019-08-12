var index_view_main = {
	class: "DefaultView",
	type:  "innerElement",

	master: {
		id:   "__MainBody__",
		type: "HTMLCollection"
	},

	style: {
		width:      "100%",
		height:     "100%"
	},
	
	items: [{
		type:     "innerElement",
		class:    "FlexMenu",
		position: 'top',

		'auto-position': true,
		
		items: [{
			type:    "innerElement",
			class:   "MenuButton",
			content: "Главная"
		}, {
			type:    "innerElement",
			class:   "MenuButton",
			content: "О Компании"
		}, {
			type:    "innerElement",
			class:   "MenuButton",
			content: "Контакты"
		}]
	}]
};