const getTweets = require('./tweets');

module.exports = function (eleventyConfig) {
	eleventyConfig.addCollection('tweets', async (collection) => {
		const tweets = await getTweets();
		collection = Object.keys(tweets).map((tweet) => tweets[tweet]);
		return collection;
	});

	eleventyConfig.addPassthroughCopy('assets');

	return {
		dir: {
			input: 'templates',
			output: 'build',
		},
		templateFormats: ['njk', 'html'],
	};
};
