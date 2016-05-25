# reviews-collector

---

## About

This module gathers reviews for the specified app and stores them in a SQLite database (`reviews.db`) in the module's root directory. Reviews for each app are collected until we find reviews older than the age specified by `daysOfReviews`.

## Installation

```shell
git clone git@github.com:wbio/reviews-collector.git
npm install
```

## Configuration

All of the configuration takes place in `index.js`. There are only 3 properties to configure:

- `daysOfReviews` (Integer): The number of days worth of reviews to collect (so reviews will be collected until we find a review older than today minus `daysOfReviews`
- `ios` (String[]): An array of app IDs for iOS apps. The app ID can be found in the app's iTunes URL (Google '<app name> iTunes' and you should find it). The app ID is the string of numbers directly after "id" in the URL: https://<i></i>itunes.apple.com/us/app/google-maps-real-time-navigation/id**585027354**?mt=8
- `android` (String[]): An array of app IDs for Android apps. The app ID can be found in the app's Google Play URL (Google '<app name> Google Play' and you should find it). The app ID is the string directly after "id=" in thr URL: https://<i></i>play.google.com/store/apps/details?id=**com.google.android.apps.maps**&hl=en

The object passed to `Collector#collect` should look something like:

```javascript
{
	// The # of days worth of reviews to collect
	daysOfReviews: 2,
	// The list of iOS app IDs to collect reviews for
	ios: [
		'585027354',
	],
	// The list of Android app IDs to collect review for
	android: [
		'com.google.android.apps.maps',
	],
}
```

## Running the script

```shell
npm start
```
