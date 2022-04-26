import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import type { ArticleFormat } from '@guardian/libs';
import { ArticleDesign, ArticleDisplay, ArticleSpecial } from '@guardian/libs';
import { from, headline, remSpace } from '@guardian/source-foundations';
import StarRating from 'components/starRating';
import { headlineBackgroundColour, headlineTextColour } from 'editorialStyles';
import type { Item } from 'item';
import type { ReactElement } from 'react';
import { articleWidthStyles } from 'styles';

import ImmersiveHeadline from './ImmersiveHeadline';
import LabsHeadline from './LabsHeadline';
import AnalysisHeadline from './LabsHeadline';
import FeatureHeadline from './FeatureHeadline';
import CommentHeadline from './CommentHeadline';
import MediaHeadline from './MediaHeadline';
import BlogHeadline from './BlogHeadline';

interface Props {
	item: Item;
}

export const defaultStyles = (format: ArticleFormat): SerializedStyles => css`
	${headline.medium()}
	${headlineTextColour(format)}
    ${headlineBackgroundColour(format)}
    padding-bottom: ${remSpace[6]};
	margin: 0;

	${articleWidthStyles}
`;

// stop headlines from growing in size with font resizer
export const fontSizeRestriction = css`
	font-size: 28px;
	${from.tablet} {
		font-size: 34px;
	}
`;

interface DefaultProps extends Props {
	styles: SerializedStyles;
}

export const DefaultHeadline: React.FC<DefaultProps> = ({ item, styles }) => (
	<h1 css={styles}>
		<span>{item.headline}</span>
		<StarRating item={item} />
	</h1>
);

export default ({ item }: Props): ReactElement => {
	if (item.display === ArticleDisplay.Immersive) {
		return <ImmersiveHeadline item={item} />;
	}

	if (item.theme === ArticleSpecial.Labs) {
		return <LabsHeadline item={item} />;
	}

	switch (item.design) {
		case ArticleDesign.Analysis:
			return <AnalysisHeadline item={item} />;
		case ArticleDesign.Feature:
			return <FeatureHeadline item={item} />;
		case ArticleDesign.Editorial:
		case ArticleDesign.Letter:
		case ArticleDesign.Comment:
			return <CommentHeadline item={item} />;
		case ArticleDesign.Media:
			return <MediaHeadline item={item} />;
		case ArticleDesign.LiveBlog:
		case ArticleDesign.DeadBlog:
			return <BlogHeadline item={item} />;
		default:
			return (
				<DefaultHeadline
					item={item}
					styles={css(defaultStyles(item), fontSizeRestriction)}
				/>
			);
	}
};
