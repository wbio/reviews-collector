'use strict';

const CollectorForiOS = require('reviews-collector-ios');
const CollectorForAndroid = require('reviews-collector-android');

const daysOfReviews = 2;	// The # of days of reviews to collect
const now = new Date();
const earliestReviewTime = now.setDate(now.getDate() - daysOfReviews);

const collectors = [];

// Create a collector for iOS
collectors.push(new CollectorForiOS(
	[ // List the IDs of the iOS apps you want to collect reviews for
		'585027354',
	],
	{ checkBeforeContinue: true }
));

// Create a collector for Android
collectors.push(new CollectorForAndroid(
	[ // List the IDs of the Android apps you want to collect reviews for
		'com.instagram.android',
	],
	{ checkBeforeContinue: true }
));

begin();

function begin() {
	const numCollectors = collectors.length;
	let numComplete = 0;
	let i;

	for (i = 0; i < numCollectors; i++) {
		// Handle the review events
		collectors[i].on('review', handleReview);
		// Handle the page complete events
		collectors[i].on('page complete', handlePageComplete);
		// Handle the page complete events
		collectors[i].on('done with apps', handleAllAppsComplete);
		// Start collecting reviews
		collectors[i].collect();
	}

	function handleReview(result) {
		console.log(result);
	}

	function handlePageComplete(result) {
		result.stop();
	}

	function handleAllAppsComplete(result) {
		console.log(`We have finished collecting reviews for the ${result.os} collector`);
		numComplete++;
		if (numComplete === numCollectors) {
			console.log('We have finished collecting reviews for all of the collectors');
			process.exit();
		}
	}
}
