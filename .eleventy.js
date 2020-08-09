const getTweets = require('./tweets');
const htmlmin = require('html-minifier');
const { DateTime } = require('luxon');

module.exports = function (eleventyConfig) {
	eleventyConfig.addCollection('tweets', async (collection) => {
		const tweets = await getTweets();
		collection = Object.keys(tweets).map((tweet) => tweets[tweet]);
		return collection;
	});

	eleventyConfig.addFilter('timestampFromTweet', (dateStr) => {
		const inFormat = 'EEE MMM dd HH:mm:ss ZZZ yyyy';
		const outFormat = 'dd-LLLL-yyyy h:mm:ss a ZZZ';
		const opt = { zone: 'America/Chicago' };
		return DateTime.fromFormat(dateStr, inFormat, opt).toFormat(outFormat);
	});

	eleventyConfig.addFilter('humanTimeFromTweet', (dateStr) => {
		const inFormat = 'EEE MMM dd HH:mm:ss ZZZ yyyy';
		const outFormat = 'd-LLLL-yyyy h:mm:ss a';
		const opt = { zone: 'America/Chicago' };
		return DateTime.fromFormat(dateStr, inFormat, opt).toFormat(outFormat);
	});

	eleventyConfig.addFilter('machineTimeFromTweet', (dateStr) => {
		const inFormat = 'EEE MMM dd HH:mm:ss ZZZ yyyy';
		const opt = { zone: 'America/Chicago' };
		return DateTime.fromFormat(dateStr, inFormat, opt).toISO();
	});

	eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
		if (outputPath.endsWith('.html') && process.env.ENVIRONMENT !== 'local') {
			let minified = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
			return minified;
		}

		return content;
	});

	eleventyConfig.addFilter('RSSTimeFormat', (dateStr) => {
		const inFormat = 'EEE MMM dd HH:mm:ss ZZZ yyyy';
		const outFormat = 'yyyy-MM-ddTHH:mm:ssZZZ';
		const opt = { zone: 'America/Chicago' };
		return DateTime.fromFormat(dateStr, inFormat, opt).toFormat(outFormat);
	});

	eleventyConfig.addPassthroughCopy('assets');

	return {
		dir: {
			input: 'templates',
			output: process.env.BUILD_PATH,
			layouts: 'layouts',
		},
		templateFormats: ['njk', 'html'],
	};
};
