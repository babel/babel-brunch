babel-brunch
===========
Brunch plugin using [babel](https://github.com/babel/babel) to turn ES6 code
into vanilla ES5 with no runtime required.

All the `.js` files in your project will be run through the babel compiler,
except those it is configured to ignore.

Installation
------------
`npm install --save babel-brunch`

Configuration
-------------
Set [babel options](https://babeljs.io/docs/usage/options) in your brunch
config (such as `brunch-config.coffee`) except for `filename` and `sourceMap`
which are handled internally.

Additionally, you can set an `ignore` value to specify which `.js` files in
your project should not be compiled by babel. By default, `ignore` is set to
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
[See release notes page on GitHub](https://github.com/babel/babel-brunch/releases)

License
-------
[ISC](https://raw.github.com/babel/babel-brunch/master/LICENSE)
