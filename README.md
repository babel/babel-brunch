6to5-brunch
===========
Brunch plugin using [6to5](https://github.com/sebmck/6to5) to turn ES6 code
into vanilla ES5 with no runtime required.

All the `.js` files in your project will be run through the 6to5 compiler.

Installation
------------
`npm install --save 6to5-brunch`

Configuration
-------------
Set [6to5 options](https://github.com/sebmck/6to5#options) in your brunch
config (such as `brunch-config.coffee`) exceptfor `filename` and `sourceMap`
which are handled internally.

```coffee
plugins:
	ES6to5:
		whitelist: ['arrowFunctions']
		format:
			semicolons: false
```

License
-------
[ISC](https://raw.github.com/es128/6to5-brunch/master/LICENSE)
