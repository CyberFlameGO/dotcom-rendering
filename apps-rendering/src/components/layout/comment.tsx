// ----- Imports ----- //

import { css } from '@emotion/react';
import {
	background,
	breakpoints,
	from,
	neutral,
	opinion,
	remSpace,
} from '@guardian/source-foundations';
import { Lines } from '@guardian/source-react-components-development-kitchen';
import ArticleBody from 'components/articleBody';
import Byline from 'components/byline';
import Cutout from 'components/cutout';
import Footer from 'components/footer';
import Headline from 'components/headline';
import Logo from 'components/logo';
import Metadata from 'components/metadata';
import RelatedContent from 'components/relatedContent';
import Series from 'components/series';
import Standfirst from 'components/standfirst';
import Tags from 'components/tags';
import { getFormat } from 'item';
import type { Comment as CommentItem, Editorial, Letter } from 'item';
import MainMedia from 'mainMedia';
import type { FC, ReactNode } from 'react';
import {
	articleWidthStyles,
	darkModeCss,
	lineStyles,
	onwardStyles,
} from 'styles';

// ----- Styles ----- //

const Styles = css`
	background: ${neutral[97]};
`;

const DarkStyles = darkModeCss`
    background: ${background.inverse};
`;

const BorderStyles = css`
	background: ${opinion[800]};
	${darkModeCss`background: ${background.inverse};`}

	${from.wide} {
		width: ${breakpoints.wide}px;
		margin: 0 auto;
	}
`;

const topBorder = css`
	border-top: solid 1px ${neutral[86]};
	margin-top: ${remSpace[3]};

	${from.wide} {
		margin-top: ${remSpace[3]};
	}

	${darkModeCss`
        border-top: solid 1px ${neutral[20]};
    `}
`;

const commentLineStylePosition = css`
	margin-top: 83px;
`;

interface Props {
	item: CommentItem | Letter | Editorial;
	children: ReactNode[];
}

const Comment: FC<Props> = ({ item, children }) => (
	<main css={[Styles, DarkStyles]}>
		<article css={BorderStyles}>
			<header>
				<Series item={item} />
				<Headline item={item} />
				<div css={articleWidthStyles}>
					<Byline {...item} />
				</div>
				<Cutout
					contributors={item.contributors}
					className={articleWidthStyles}
					format={item}
				/>
				<div css={[commentLineStylePosition, lineStyles]}>
					<Lines count={8} />
				</div>

				<div css={articleWidthStyles}>
					<Standfirst item={item} />
				</div>

				<section css={[articleWidthStyles, topBorder]}>
					<Metadata item={item} />
				</section>

				<MainMedia
					format={getFormat(item)}
					mainMedia={item.mainMedia}
				/>
				<section css={articleWidthStyles}>
					<Logo item={item} />
				</section>
			</header>
			<ArticleBody className={[articleWidthStyles]} format={item}>
				{children}
			</ArticleBody>
			<section css={articleWidthStyles}>
				<Tags tags={item.tags} format={item} />
			</section>
		</article>
		<section css={onwardStyles}>
			<RelatedContent content={item.relatedContent} />
		</section>
		<Footer isCcpa={false} format={item} />
	</main>
);

// ----- Exports ----- //

export default Comment;
