const fetch = require('node-fetch');

async function getConfigFromURL(_url) {
	try {
		if (!_url) {
			throw new Error('The url query parameter is mandatory');
		}

		const url = new URL(_url);

		// searchParams will only work for the first set of query params because 'url' is already a query param itself
		const searchparams = url.searchParams && url.searchParams.toString();

		// Reconstruct the parsed url adding .json?dcr which we need to force dcr to return json
		const jsonUrl = `${url.origin}${url.pathname}.json?dcr=true&${searchparams}`;

		const { html, ...config } = await fetch(jsonUrl).then((article) =>
			article.json(),
		);

		return config;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
	}
}

exports.default = getConfigFromURL;

exports.getConfigFromURLMiddleware = async (req, res, next) => {
	if (req.query.url) {
		req.body = await getConfigFromURL(req.query.url);
	}
	next();
};
