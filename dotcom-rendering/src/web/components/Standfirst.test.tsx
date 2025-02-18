import { render } from '@testing-library/react';

import { ArticleDesign, ArticleDisplay, ArticlePillar } from '@guardian/libs';

import { Standfirst } from './Standfirst';
import { interactiveLegacyClasses } from '../layouts/lib/interactiveLegacyStyling';

describe('Standfirst', () => {
	it('It should contain legacy class names to support customised styling in interactives', () => {
		const { container } = render(
			<Standfirst
				format={{
					theme: ArticlePillar.Lifestyle,
					design: ArticleDesign.Interactive,
					display: ArticleDisplay.Immersive,
				}}
				standfirst="Standfirst"
			/>,
		);

		expect(
			container.querySelector(`.${interactiveLegacyClasses.standFirst}`),
		).not.toBeNull();
	});

	it("It should not contain legacy class names for articles that aren't interactives", () => {
		const { container } = render(
			<Standfirst
				format={{
					theme: ArticlePillar.Lifestyle,
					design: ArticleDesign.Standard,
					display: ArticleDisplay.Standard,
				}}
				standfirst="Standfirst"
			/>,
		);

		expect(
			container.querySelector(`.${interactiveLegacyClasses.standFirst}`),
		).toBeNull();
	});
});
