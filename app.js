const cron = require('node-cron');
const shell = require('shelljs');

cron.schedule('* 0 * * *', () => {
	shell.exec('eleventy');
});
