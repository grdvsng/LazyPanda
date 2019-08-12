var default_style = {
	
	universal: 
	{
		'DefaultView': 
		{
			'back-ground':
			{
				type:  'color',
				value: 'rgb(242, 243, 243)'
			}
		},

		'FlexMenu':
		{
			'background-color': 'White',
			'border-radius':    '15px',
			'border-style':     'solid',
			'border-color':     '#2F4F4F',
			color:              'Black',
			position:           'absolute',
			'vertical-align':   'middle',

			'inner line': {
				'border-radius':    '15px',
				'background-color': '#2F4F4F'
			},

			label: {
				color: '#2F4F4F'
			}
		},

		'MenuButton':
		{
			'background-color': 'inherit',
			position:           'relative',
			border:         	'none',
			color:         	    'white',
			outline:        	'none'
		},

		'MenuPanel':
		{
			heigth:             '10%',
			'padding':          '1%',
			'background-color': '#2F4F4F',
			left:               '0.5%',
			right:              '0.5%',
			'border-radius':    '5px',
			color:              'black',
			position:           'absolute'
		}
	},

	mobile:
	{
		'DefaultView': 
		{
			'back-ground': 
			{
				type:  'color',
				value: '#133CAC'
			}
		},

		'FlexMenu':
		{
			padding:            '5px',
			'padding-bottom':   '1px',
			'font-weight':      '800',
			'width':            '900px',
			'heght':            '100px'
		},

		'MenuButton':
		{
			width:           	'20%',
			'font-size':        '14pt',
			'font-weight':      '700',
		},

		'MenuPanel':
		{
			heigth:             '10%',
			width:              '98%',
			border:             '2px solid white'
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
			padding:            '2px',
			'padding-top':      '0px',
			'font-weight':      '800',

			'inner line': {
				'width':      '40px',
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
			width:           	'20%',
			'font-weight':      '700',
			'font-size':        '14pt',
			'font-weight':      '700'
		},

		'MenuPanel':
		{
			border: '2px solid white'
		}
	}
}