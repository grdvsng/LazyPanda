var colors = [
	'White',
	'#1F4E6B',
	'#1F4E7B',
	'Black'
	],
	
	fonts = [
		'Verdana'
	];

var default_style = {

	universal: 
	{
		'DefaultView': 
		{
			'background': 'url({FramePath}/bin/styles/shaders/default.svg) no-repeat bottom center fixed',
		},

		'FlexMenu':
		{
			'background-color': colors[0],
			'border-radius':    '15px',
			'border-style':     'solid',
			'border-color':     colors[1],
			color:              colors[2],
			position:           'absolute',
			'vertical-align':   'middle',

			'inner line': {
				'border-radius':    '15px',
				'background-color': colors[1]
			},

			label: {
				color: colors[1]
			}
		},

		'MenuButton':
		{
			'font-family':      fonts[0],
			'background-color': 'inherit',
			'position':         'relative',
			'border':         	'none',
			'text-align':       'left',
			'color':         	'inherit',
			'outline':        	'none'
		},

		'MenuPanel':
		{
			'padding':          '1%',
			'border-color':     colors[1],
			'background-color': colors[1],
			'color':            colors[0],
			'position':         'absolute'
		},

		'List':
		{
			'ul':
			{
				'text-align':          'left',
				'list-style-position': 'inside',
				'font-family':         fonts[0],
				'list-style-type':     'none'
			}
		}
	},

	mobile:
	{
		'DefaultView': 
		{
		},

		'FlexMenu':
		{
			'padding':          '5px',
			'padding-bottom':   '1px',
			'font-weight':      '800',
			'width':            '900px',
			'heght':            '100px'
		},

		'MenuButton':
		{
			'width':           	'20%',
			'font-size':        '14pt',
			'font-weight':      '700',
		},

		'MenuPanel':
		{
			'border':           '2px solid ' + colors[0]
		}
	},

	desktop:
	{
		'DefaultView': 
		{
		},

		'FlexMenu':
		{
			'border-width':     '2px',
			'padding':          '2px',
			'padding-top':      '0px',
			'font-weight':      '800',
			'width':            '50px',

			'inner line': {
				'left':       '2%',
				'right':      '2%',
				'height':     '4px',
				'margin-top': '5px'
			},

			label: {
				'font-size':   '16pt',
				'padding-top': '6px'
			}
		},

		'MenuButton':
		{
			'font-size':       '12pt',
			'font-weight':     700
		},

		'MenuPanel':
		{
			'border':          '2px solid ' + colors[0],
			'box-shadow': 	   'inset 1px 1px 1px 1px ' + colors[2]
		},

		'List':
		{
			'position': 	   'relative',

			'ul':
			{
				'font-size':    '16pt',
				'font-weight':  700,

				'li': 
				{
					'padding-left': '0.5em'
				}
			}
		}
	}
}