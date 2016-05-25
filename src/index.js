'use strict';

const CollectorForiOS = require('reviews-collector-ios');
const CollectorForAndroid = require('reviews-collector-android');
const P = require('bluebird');
const recorder = require('./recorder.js');

const daysOfReviews = 2;	// The # of days of reviews to collect
const now = new Date();
const earliestReviewTime = now.setDate(now.getDate() - daysOfReviews);

const collectors = [];
const inserts = [];

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
		'com.capitalone.mobile.wallet',
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
		inserts.push(recorder.record(result));
	}

	function handlePageComplete(result) {
		console.log(`${result.os}/${result.appId}: Parsed to ${result.firstReviewTime} (page ${result.pageNum})`);
		// If we find a review from earlier than the first date we care about, stop collecting
		if (result.firstReviewTime < earliestReviewTime) {
			result.stop();
		} else {
			result.continue();
		}
	}

	function handleAllAppsComplete(result) {
		console.log(`>>> We have finished collecting reviews for the ${result.os} collector`);
		numComplete++;
		if (numComplete === numCollectors) {
			console.log('>>>>> We have finished collecting reviews for all of the collectors');
			// Wait for all of the inserts to finish and then exit
			P.all(inserts)
				.then(() => {
					process.exit();
				});
		}
	}
}
