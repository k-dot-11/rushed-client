const colors = require('tailwindcss/colors');
module.exports = {
	purge: [ './components/**/*.js', './pages/**/*.js' ],
	darkMode: 'media',
	theme: {
		colors: {
			brand: {
				bg: '#222831',
				bgup: '#393e46',
				bgupup: '#333333',
				primary: '#e94560'
			},
			...colors
		}
	}
};

//https://colorhunt.co/palette/201882
