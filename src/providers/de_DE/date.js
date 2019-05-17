var moment = require('moment');

var momentInstance = new moment();
momentInstance.locale('de');

var provider = {

	date: function(format) {
		format = format || 'DD.MM.YYYY';
		return momentInstance.format(format);
	}
};

module.exports = provider;
