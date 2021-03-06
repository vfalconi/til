require('dotenv').config();
const twitterAPI = require('twitter');
const fs = require('fs');
const client = new twitterAPI({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const readArchive = (file) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', (err, contents) => {
			if (err) {
				fs.writeFile(file, JSON.stringify({}), (err) => reject(err));
				resolve({});
			} else resolve(JSON.parse(contents));
		});
	});
};
const writeArchive = (file, contents) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, contents, 'utf8', (err) => {
			if (err) reject(err);
			else resolve(true);
		});
	});
};

module.exports = async () => {
	const tweets = await readArchive('./tweets.json').catch((err) =>
		console.log(err)
	);

	const newTweets = await client
		.get('statuses/user_timeline', {
			screen_name: process.env.TWITTER_SCREEN_NAME,
			count: 200,
			exclude_replies: true,
		})
		.then((tweets) =>
			tweets
				.filter((tweet) => tweet.retweeted_status === undefined)
				.filter((tweet) => tweet.text.startsWith('TIL'))
		)
		.catch((err) => console.log(err));

	newTweets.forEach((tweet) => {
		tweets[tweet.id] = tweet;
	});

	await writeArchive('./tweets.json', JSON.stringify(tweets));

	return tweets;
};
