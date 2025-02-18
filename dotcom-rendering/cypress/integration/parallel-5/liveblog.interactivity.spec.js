/* eslint-disable mocha/no-exclusive-tests */
/* eslint-disable mocha/no-pending-tests */
/* eslint-disable mocha/no-skipped-tests */
/* eslint-disable no-undef */
/* eslint-disable func-names */
import { mockApi } from '../../lib/mocks';
import { disableCMP } from '../../lib/disableCMP';
import { setLocalBaseUrl } from '../../lib/setLocalBaseUrl.js';
import { tweetBlock } from '../../fixtures/manual/tweet-block';

const blogUrl =
	'https://www.theguardian.com/australia-news/live/2022/feb/22/australia-news-live-updates-scott-morrison-nsw-trains-coronavirus-covid-omicron-weather';

/**
 * 	Thrown by the twitter lib. This error is unrelated to the test in question
 *  so return false to prevent this error from failing this test
 */
const ignoreTwitterError = () => {
	cy.on('uncaught:exception', (err) => {
		if (err.message.includes('Illegal invocation')) {
			return false;
		}
	});
};

const stubUpdates = () => {
	cy.intercept(
		{
			url: /\?lastUpdate=.*/,
		},
		{},
	);
};

describe('Liveblogs', function () {
	beforeEach(function () {
		disableCMP();
		setLocalBaseUrl();
		mockApi();
		ignoreTwitterError();
	});

	it('should show the toast, incrementing the count as new updates are sent', function () {
		stubUpdates();
		cy.visit(`/Article?url=${blogUrl}?live=true`);
		// Wait for hydration
		cy.get('gu-island[name=Liveness]')
			.first()
			.should('have.attr', 'data-gu-ready', 'true');
		cy.scrollTo('center');
		cy.get(`[data-cy="toast"]`).should('not.exist');
		cy.window().then(function (win) {
			win.mockLiveUpdate({
				numNewBlocks: 1,
				html: '<p>New block</p>',
				mostRecentBlockId: 'abc',
			});
			cy.get(`[data-cy="toast"]`).should('exist');
			cy.contains('1 new update');
			cy.window().then(function (win) {
				win.mockLiveUpdate({
					numNewBlocks: 1,
					html: '<p>New block</p>',
					mostRecentBlockId: 'abc',
				});
				cy.contains('2 new updates');
			});
		});
	});

	it('should insert the html from the update call', function () {
		stubUpdates();
		cy.visit(`/Article?url=${blogUrl}?live=true`);
		// Wait for hydration
		cy.get('gu-island[name=Liveness]')
			.first()
			.should('have.attr', 'data-gu-ready', 'true');
		cy.window().then(function (win) {
			win.mockLiveUpdate({
				numNewBlocks: 1,
				html: '<p>New block</p>',
				mostRecentBlockId: 'abc',
			});
			cy.contains('New block');
		});
	});

	it('should scroll the page to the top and reveal content when the toast is clicked', function () {
		stubUpdates();
		cy.visit(`/Article?url=${blogUrl}?live=true`);
		// Wait for hydration
		cy.get('gu-island[name=Liveness]', { timeout: 30000 })
			.first()
			.should('have.attr', 'data-gu-ready', 'true');
		cy.scrollTo('bottom');
		cy.get(`[data-cy="toast"]`).should('not.exist');
		cy.window().then(function (win) {
			win.mockLiveUpdate({
				numNewBlocks: 1,
				html: '<p>New block</p>',
				mostRecentBlockId: 'abc',
			});
			cy.get(`[data-cy="toast"]`).should('exist');
			cy.contains('1 new update').click({ force: true });
			cy.get(`[data-cy="toast"]`).should('not.exist');
		});
	});

	it('should enhance tweets after they have been inserted', function () {
		const getTwitterIframe = () => {
			return cy
				.get('#46d194c9-ea50-4cd5-af8b-a51e8b15c65e iframe', {
					timeout: 12000,
				})
				.its('0.contentDocument.body')
				.should('not.be.empty')
				.then(cy.wrap);
		};
		stubUpdates();
		cy.visit(`/Article?url=${blogUrl}?live=true`);
		// Wait for hydration
		cy.get('gu-island[name=Liveness]')
			.first()
			.should('have.attr', 'data-gu-ready', 'true');
		cy.window().then(function (win) {
			win.mockLiveUpdate({
				numNewBlocks: 1,
				html: tweetBlock,
				mostRecentBlockId: 'abc',
			});
			cy.scrollTo(0, 1200);
			getTwitterIframe().contains(
				'They will prepare the extraordinary European Council meeting tonight',
				{
					timeout: 15000,
				},
			);
		});
	});

	it('should use the right block id when polling from the second page', function () {
		cy.intercept(
			{
				url: /\?lastUpdate=.*/,
			},
			(req) => {
				expect(req.query.lastUpdate).to.equal(
					'block-62148e2d8f081f9e465d1bb7',
				);
			},
		).as('updateCall');
		cy.visit(
			`/Article?url=${blogUrl}?live=true&page=with:block-6214732b8f08f86d89ef68d6&filterKeyEvents=false#liveblog-navigation`,
		);
		cy.wait('@updateCall');
	});

	it('should handle when the toast is clicked from the second page', function () {
		stubUpdates();
		cy.visit(
			`/Article?url=${blogUrl}?live=true&page=with:block-6214732b8f08f86d89ef68d6&filterKeyEvents=false#liveblog-navigation`,
		);
		// Wait for hydration
		cy.get('gu-island[name=Liveness]', { timeout: 30000 })
			.first()
			.should('have.attr', 'data-gu-ready', 'true');
		cy.scrollTo('bottom');
		cy.get(`[data-cy="toast"]`).should('not.exist');
		cy.window().then(function (win) {
			win.mockLiveUpdate({
				numNewBlocks: 1,
				html: '<p>New block</p>',
				mostRecentBlockId: 'abc',
			});
			cy.get(`[data-cy="toast"]`).should('exist');
			cy.contains('1 new update').click({ force: true });
			cy.location().should((loc) => {
				expect(loc.hash).to.eq('#maincontent');
				expect(loc.pathname).to.eq(
					'/australia-news/live/2022/feb/22/australia-news-live-updates-scott-morrison-nsw-trains-coronavirus-covid-omicron-weather',
				);
				expect(loc.search).to.eq('');
			});
		});
	});

	it('should initially hide new blocks, only revealing them when the top of blog is in view', function () {
		stubUpdates();
		cy.visit(`/Article?url=${blogUrl}?live=true`);
		// Wait for hydration
		cy.get('gu-island[name=Liveness]')
			.first()
			.should('have.attr', 'data-gu-ready', 'true');
		cy.scrollTo('bottom', { duration: 1000 });
		cy.window().then(function (win) {
			win.mockLiveUpdate({
				numNewBlocks: 1,
				html: tweetBlock,
				mostRecentBlockId: 'abc',
			});
			cy.get('#46d194c9-ea50-4cd5-af8b-a51e8b15c65e').should(
				'not.be.visible',
			);
			cy.scrollTo(0, 900);
			cy.get('#46d194c9-ea50-4cd5-af8b-a51e8b15c65e').should(
				'be.visible',
			);
		});
	});
});
