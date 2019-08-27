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
		class:    "MenuPanel",
		position: 1,
		scroller: true,
		effects: [
			'hide panel button'
		],

		items: [{
			type:     "innerElement",
			class:    "List",
			content:  "Меню",

			effects: [
			],

			items: [{
				type:    "innerElement",
				class:   "MenuButton",
				content: "Главная"
			}, {
				type:    "innerElement",
				class:   "MenuButton",
				content: "Контакты"
			}, {
				type:    "innerElement",
				class:   "MenuButton",
				content: "Войти"
			}]
		}]
	}]
};