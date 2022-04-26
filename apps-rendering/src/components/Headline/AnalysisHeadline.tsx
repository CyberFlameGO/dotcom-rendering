import { css, SerializedStyles } from '@emotion/react';
import { ArticleFormat } from '@guardian/libs';
import { headline, neutral } from '@guardian/source-foundations';
import { border } from '@guardian/common-rendering/src/editorialPalette';
import { Item } from 'item';
import { ReactElement } from 'react';
import { darkModeCss } from 'styles';
import { DefaultHeadline, defaultStyles, fontSizeRestriction } from './';

const analysisStyles = (format: ArticleFormat): SerializedStyles => css`
	${headline.medium({ lineHeight: 'regular', fontWeight: 'light' })}

	span {
		box-shadow: inset 0 -0.025rem ${border.articleLink(format)};
		padding-bottom: 0.2rem;

		${darkModeCss`
            box-shadow: inset 0 -0.025rem ${neutral[46]};
        `}
	}
`;

interface Props {
	item: Item;
}

export default ({ item }: Props): ReactElement => (
	<DefaultHeadline
		item={item}
		styles={css(
			defaultStyles(item),
			analysisStyles(item),
			fontSizeRestriction,
		)}
	/>
);
