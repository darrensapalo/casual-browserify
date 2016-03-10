var helpers = require('./helpers');

var providers = {
    address: require('./providers/address'),
    color: require('./providers/color'),
    date: require('./providers/date'),
    internet: require('./providers/internet'),
    misc: require('./providers/misc'),
    number: require('./providers/number'),
    payment: require('./providers/payment'),
    person: require('./providers/person'),
    text: require('./providers/text')
};

var locales = {
    'en_CA': {
         address: require('./providers/en_CA/address')
    },
    'en_US': {
         address: require('./providers/en_US/address')
    },
    'it_CH': {
         address: require('./providers/it_CH/address'),
         date: require('./providers/it_CH/date'),
         person: require('./providers/it_CH/person')
    },
    'nl_NL': {
         address: require('./providers/nl_NL/address'),
         person: require('./providers/nl_NL/person')
    },
    'ru_RU': {
         address: require('./providers/ru_RU/address'),
         color: require('./providers/ru_RU/color'),
         internet: require('./providers/ru_RU/internet'),
         person: require('./providers/ru_RU/person'),
         text: require('./providers/ru_RU/text')
    },
    'uk_UA': {
         address: require('./providers/uk_UA/address'),
         color: require('./providers/uk_UA/color'),
         text: require('./providers/uk_UA/text')
    }
};
var safe_require = function(filename) {
	var parts = filename.split(require('path').sep).slice(-2),
		locale = parts[0],
		provider = parts[1];

	return locales[locale][provider] || {};
};



var build_casual = function() {
	var casual = helpers.extend({}, helpers);

	casual.functions = function() {
		var adapter = {};

		Object.keys(this).forEach(function(name) {
			if (name[0] === '_') {
				adapter[name.slice(1)] = casual[name];
			}
		});

		return adapter;
	};

	var providers = [
		'address',
		'text',
		'internet',
		'person',
		'number',
		'date',
		'payment',
		'misc',
		'color'
	];

	casual.register_locale = function(locale) {
		casual.define(locale, function() {
			var casual = build_casual();

			providers.forEach(function(provider) {
				casual.register_provider(helpers.extend(
					require('./providers/' + provider),
					safe_require(__dirname + '/providers/' + locale + '/' + provider)
				));
			});

			return casual;
		});
	}

	var locales = [
		'en_US',
		'ru_RU',
		'uk_UA',
		'nl_NL',
		'en_CA',
		'it_CH'
	];

	locales.forEach(casual.register_locale);

	return casual;
};

// Default locale is en_US
module.exports = build_casual().en_US;