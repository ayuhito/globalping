import type {Server} from 'node:http';
import request from 'supertest';
import {expect} from 'chai';

import {getTestServer} from '../../../utils/http.js';

describe('domain redirect', function () {
	this.timeout(15_000);

	let app: Server;
	let requestAgent: any;

	before(async () => {
		app = await getTestServer();
		requestAgent = request(app);
	});

	describe('http requests', () => {
		it('should be redirected to "https://jsdelivr.com/globalping" if Host is "globalping.io"', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await requestAgent
				.get('/v1/probes')
				.send()
				.set('Host', 'globalping.io')
				.expect(301)
				.expect(response => {
					expect(response.header.location).to.equal('https://jsdelivr.com/globalping');
				});
		});

		it('should not be redirected to if Host is not "globalping.io"', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await requestAgent
				.get('/v1/probes')
				.send()
				.set('Host', 'api.globalping.io')
				.expect(200)
				.expect(response => {
					expect(response.body).to.deep.equal([]);
				});
		});
	});
});