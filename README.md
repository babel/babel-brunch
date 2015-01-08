6to5-brunch
===========
Brunch plugin using [6to5](https://github.com/sebmck/6to5) to turn ES6 code
into vanilla ES5 with no runtime required.

All the `.js` files in your project will be run through the 6to5 compiler,
except those it is configured to ignore.

Installation
------------
`npm install --save 6to5-brunch`

Configuration
-------------
Set [6to5 options](https://github.com/sebmck/6to5#options) in your brunch
config (such as `brunch-config.coffee`) except for `filename` and `sourceMap`
which are handled internally.

Additionally, you can set an `ignore` value to specify which `.js` files in
your project should not be compiled by 6to5. By default, `ignore` is set to
`/^(bower_components|vendor)/`.

```coffee
plugins:
	ES6to5:
		whitelist: ['arrowFunctions']
		format:
			semicolons: false
		ignore: [
			/^(bower_components|vendor)/
			'app/legacyES5Code/**/*'
		]
```

Change Log
----------
[See release notes page on GitHub](https://github.com/es128/6to5-brunch/releases)

License
-------
[ISC](https://raw.github.com/es128/6to5-brunch/master/LICENSE)
