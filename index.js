'use strict';

const Collector = require('src/collector.js');

Collector.collect({
	// The # of days worth of reviews to collect
	daysOfReviews: 2,
	// The list of iOS app IDs to collect reviews for
	ios: [
		'585027354',
	],
	// The list of Android app IDs to collect review for
	android: [
		'com.capitalone.mobile.wallet',
	],
});
