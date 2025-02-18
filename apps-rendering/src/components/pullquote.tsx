import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import type { ArticleFormat } from '@guardian/libs';
import { headline, remSpace } from '@guardian/source-foundations';
import { SvgQuote } from '@guardian/source-react-components';
import type { Option } from '@guardian/types';
import { map, withDefault } from '@guardian/types';
import { pipe } from 'lib';
import type { FC, ReactNode } from 'react';
import { darkModeCss } from 'styles';
import { getThemeStyles } from 'themeStyles';

const styles = (format: ArticleFormat): SerializedStyles => {
	const { kicker, inverted } = getThemeStyles(format.theme);
	return css`
		color: ${kicker};
		margin: 0;
		${headline.xsmall({ fontWeight: 'light' })};
		${darkModeCss`color: ${inverted};`}
	`;
};

const quoteStyles = (format: ArticleFormat): SerializedStyles => {
	const { kicker, inverted } = getThemeStyles(format.theme);

	return css`
		margin: ${remSpace[4]} 0 ${remSpace[3]} 0;

		svg {
			margin-bottom: -0.6rem;
			height: 2.3rem;
			margin-left: -0.3rem;
			line-height: 1.2;
			fill: ${kicker};
			${darkModeCss`fill: ${inverted};`}
		}
	`;
};

const citeStyles = css`
	font-style: normal;
`;

type Props = {
	quote: string;
	format: ArticleFormat;
	attribution: Option<string>;
};

const blockQuoteStyles = css`
	margin-left: 0;
`;

const Pullquote: FC<Props> = ({ quote, attribution, format }) => {
	const quoteElement = (
		<p css={quoteStyles(format)}>
			<SvgQuote />
			{quote}
		</p>
	);
	const children = pipe(
		attribution,
		map((attribution) => [
			quoteElement,
			<cite key={attribution} css={citeStyles}>
				{attribution}
			</cite>,
		]),
		withDefault<ReactNode>([quoteElement]),
	);

	return (
		<aside css={styles(format)}>
			<blockquote css={blockQuoteStyles}>{children}</blockquote>
		</aside>
	);
};

export default Pullquote;
