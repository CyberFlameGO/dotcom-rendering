import { Article } from '../../fixtures/generated/articles/Article';
import { enhanceEmbeds } from './enhance-embeds';

const example = Article;
const metaData = {
	id: '123',
	primaryDateLine: 'Wed 9 Dec 2020 06.30 GMT',
	secondaryDateLine: 'Last modified on Wed 9 Dec 2020 13.40 GMT',
};

describe('Enhance Embeds', () => {
	it('creates an identical but new object when no changes are needed', () => {
		expect(enhanceEmbeds(example.blocks)).not.toBe(example.blocks); // We created a new object
		expect(enhanceEmbeds(example.blocks)).toEqual(example.blocks); // The new object is what we expect
	});

	it('sets the divider flag correctly', () => {
		const input: Block[] = [
			{
				...metaData,
				elements: [
					{
						html: '<iframe id="the-fiver" name="the-fiver" src="https://www.theguardian.com/email/form/plaintone/the-fiver" scrolling="no" seamless="" class="iframed--overflow-hidden email-sub__iframe" height="52px" frameborder="0" data-component="email-embed--the-fiver"></iframe>',
						safe: true,
						alt: 'Sign up to The Fiver',
						isMandatory: true,
						isThirdPartyTracking: false,
						source: 'The Guardian',
						sourceDomain: 'theguardian.com',
						_type: 'model.dotcomrendering.pageElements.EmbedBlockElement',
						elementId: '17bb4750-37c3-4cef-a535-82a5c40509fd',
						caption: 'Sign up to the Fiver',
					},
				],
			},
		];

		const expectedOutput = [
			{
				...metaData,
				elements: [
					{
						html: '<iframe id="the-fiver" name="the-fiver" src="https://www.theguardian.com/email/form/plaintone/the-fiver" scrolling="no" seamless="" class="iframed--overflow-hidden email-sub__iframe" height="52px" frameborder="0" data-component="email-embed--the-fiver" title="Sign up to The Fiver"></iframe>',
						safe: true,
						alt: 'Sign up to The Fiver',
						isMandatory: true,
						isThirdPartyTracking: false,
						source: 'The Guardian',
						sourceDomain: 'theguardian.com',
						_type: 'model.dotcomrendering.pageElements.EmbedBlockElement',
						elementId: '17bb4750-37c3-4cef-a535-82a5c40509fd',
						caption: 'Sign up to the Fiver',
					},
				],
			},
		];

		expect(enhanceEmbeds(input)).toEqual(expectedOutput);
	});
});
