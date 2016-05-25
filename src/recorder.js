'use strict';

// Require our modules
const path = require('path');
const Sequelize = require('sequelize');
const P = require('bluebird');

// Setup the database
const dbPath = path.join(__dirname, '../reviews.db');
const sequelize = new Sequelize('database', null, null, {
	dialect: 'sqlite',
	storage: dbPath,
	logging: false,
});

// Define the model
const Review = sequelize.define('review', {
	os: {
		type: Sequelize.STRING,
		field: 'app_os',
	},
	appId: {
		type: Sequelize.STRING,
		field: 'app_id',
	},
	reviewId: {
		type: Sequelize.STRING,
		field: 'review_id',
	},
	date: {
		type: Sequelize.DATE,
		field: 'review_date',
	},
	rating: {
		type: Sequelize.INTEGER,
		field: 'review_rating',
	},
	title: {
		type: Sequelize.STRING,
		field: 'review_title',
	},
	text: {
		type: Sequelize.STRING,
		field: 'review_text',
	},
}, {
	timestamps: false,
});

// Create a Promise for the creation of the table
const createTheTable = Review.sync();

/**
 * Record a single review in our database
 * @param {Object} result - The object emitted from the 'review' event
 * @return {Promise} A promise that is fulfilled when the review is inserted
 */
function record(result) {
	// Make sure that the table has been created first
	return createTheTable
		// Then insert the review
		.then(() => Review.create(
			{
				os: result.os,
				appId: result.appId,
				reviewId: result.review.id,
				date: result.review.date,
				rating: result.review.rating,
				title: result.review.title,
				text: result.review.text,
			}
		));
}
module.exports.record = record;

/**
 * Record a page of reviews in our database
 * @param {Object} result - The object emitted from the 'page complete' event
 * @return {Promise} A promise that is fulfilled when all of the reviews are inserted
 */
function recordAll(result) {
	// Make sure that the table has been created first
	return createTheTable
		// Then insert the reviews
		.then(() => {
			const inserts = [];
			let i;
			for (i = 0; i < result.reviews.length; i++) {
				const review = result.reviews[i];
				inserts.push(Review.create(
					{
						os: result.os,
						appId: result.appId,
						reviewId: review.id,
						date: review.date,
						rating: review.rating,
						title: review.title,
						text: review.text,
					}
				));
			}
			return P.all(inserts);
		});
}
module.exports.recordAll = recordAll;
