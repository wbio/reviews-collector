'use strict';

const CollectorForiOS = require('reviews-collector-ios');
const CollectorForAndroid = require('reviews-collector-android');
const P = require('bluebird');
const recorder = require('./recorder.js');


function Collector(options) {
	if (!options.daysOfReviews) {
		throw new Error('You must specify how many days of reviews to collect using the "daysOfReviews" property');
	}
	if (!options.ios && !options.android) {
		throw new Error('You must include a list of apps to collect in the "ios" and/or "android" properties');
	}
	const daysOfReviews = options.daysOfReviews;
	const now = new Date();
	const earliestReviewTime = now.setDate(now.getDate() - daysOfReviews);

	const collectors = [];
	const inserts = [];

	if (options.ios) {
		// Create a collector for iOS
		collectors.push(new CollectorForiOS(
			options.ios,
			{ checkBeforeContinue: true }
		));
	}

	if (options.android) {
		// Create a collector for Android
		collectors.push(new CollectorForAndroid(
			options.android,
			{ checkBeforeContinue: true }
		));
	}

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
}
module.exports = Collector;
