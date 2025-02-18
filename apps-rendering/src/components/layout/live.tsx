// ----- Imports ----- //

import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import type { KeyEvent } from '@guardian/common-rendering/src/components/keyEvents';
import KeyEvents from '@guardian/common-rendering/src/components/keyEvents';
import { Pagination } from '@guardian/common-rendering/src/components/Pagination';
import { background } from '@guardian/common-rendering/src/editorialPalette';
import type { ArticleFormat } from '@guardian/libs';
import { ArticleDesign } from '@guardian/libs';
import {
	from,
	neutral,
	news,
	pxToRem,
	remSpace,
} from '@guardian/source-foundations';
import { OptionKind } from '@guardian/types';
import Footer from 'components/footer';
import GridItem from 'components/gridItem';
import LiveBlocks from 'components/liveBlocks';
import LiveblogHeader from 'components/liveblogHeader';
import Metadata from 'components/metadata';
import RelatedContent from 'components/relatedContent';
import Tags from 'components/tags';
import { getFormat } from 'item';
import type { DeadBlog, LiveBlog } from 'item';
import { toNullable } from 'lib';
import type { LiveBlock } from 'liveBlock';
import MainMedia from 'mainMedia';
import type { FC } from 'react';
import { articleWidthStyles, darkModeCss, onwardStyles } from 'styles';

// ----- Component ----- //

const mainStyles = (format: ArticleFormat): SerializedStyles => css`
	display: grid;
	background-color: ${neutral[97]};
	grid-template-columns: 1fr;
	grid-template-areas:
		'metadata'
		'main-media'
		'key-events'
		'live-blocks';

	${darkModeCss`
		background-color: ${background.articleContentDark(format)};
	`}

	${from.tablet} {
		column-gap: 20px;
		grid-template-columns: 1fr 700px 1fr;
		grid-template-areas:
			'metadata metadata metadata'
			'. main-media .'
			'. key-events .'
			'. live-blocks .';
	}

	${from.desktop} {
		grid-template-columns: 1fr 220px 700px 1fr;
		grid-template-areas:
			'. metadata main-media'
			'. key-events main-media'
			'. key-events live-blocks';
		padding-top: ${remSpace[3]};
	}

	${from.leftCol} {
		grid-template-columns: 1fr 220px 700px 140px 1fr;
	}

	${from.wide} {
		grid-template-columns: 1fr 220px 700px 300px 1fr;
	}
`;

const metadataWrapperStyles = (format: ArticleFormat): SerializedStyles => {
	switch (format.design) {
		case ArticleDesign.DeadBlog:
			return css`
				background-color: ${neutral[93]};
			`;
		default:
			return css`
				background-color: ${news[200]};
			`;
	}
};

const keyEventsWrapperStyles = css`
	${from.desktop} {
		position: sticky;
		top: 10px;
		margin-bottom: 12px;
	}
`;

const keyEvents = (blocks: LiveBlock[]): KeyEvent[] =>
	blocks.reduce<KeyEvent[]>(
		(events, block) =>
			block.isKeyEvent && block.firstPublished.kind !== OptionKind.None
				? [
						...events,
						{
							date: block.firstPublished.value,
							text: block.title,
							url: `?page=with:block-${block.id}#block-${block.id}`,
						},
				  ]
				: events,
		[],
	);

interface Props {
	item: LiveBlog | DeadBlog;
}

const Live: FC<Props> = ({ item }) => {
	const pagination = (
		<Pagination
			format={item}
			currentPage={item.pagedBlocks.currentPage.pageNumber}
			totalPages={item.pagedBlocks.pagination.numberOfPages}
			newest={toNullable(item.pagedBlocks.pagination.newest)}
			newer={toNullable(item.pagedBlocks.pagination.newer)}
			oldest={toNullable(item.pagedBlocks.pagination.oldest)}
			older={toNullable(item.pagedBlocks.pagination.older)}
		/>
	);
	return (
		<article
			className="js-article"
			css={darkModeCss`
					background-color: ${background.articleContentDark(item)};
				`}
		>
			<LiveblogHeader item={item} />
			<main css={mainStyles(item)}>
				<GridItem area="metadata">
					<div css={metadataWrapperStyles(item)}>
						<Metadata item={item} />
					</div>
				</GridItem>
				<GridItem area="key-events">
					<div css={keyEventsWrapperStyles} data-chromatic="ignore">
						<KeyEvents
							keyEvents={keyEvents(item.blocks)}
							format={item}
							supportsDarkMode
						/>
					</div>
				</GridItem>
				<GridItem area="main-media">
					<MainMedia
						format={getFormat(item)}
						mainMedia={item.mainMedia}
					/>
				</GridItem>
				<GridItem area="live-blocks">
					<div
						css={css`
							padding-left: ${pxToRem(10)}rem;
							padding-right: ${pxToRem(10)}rem;
							padding-top: ${remSpace[3]};

							${from.mobileLandscape} {
								padding-left: ${remSpace[5]};
								padding-right: ${remSpace[5]};
							}

							${from.tablet} {
								padding-left: 0;
								padding-right: 0;
							}

							${from.desktop} {
								padding: 0;
							}
						`}
						id="liveblock-container"
					>
						{item.pagedBlocks.currentPage.pageNumber > 1 &&
							pagination}
						<LiveBlocks
							blocks={item.pagedBlocks.currentPage.blocks}
							format={item}
						/>
						{pagination}
					</div>
				</GridItem>
			</main>
			<section css={articleWidthStyles}>
				<Tags tags={item.tags} format={item} />
			</section>
			<section css={onwardStyles}>
				<RelatedContent content={item.relatedContent} />
			</section>
			<section css={articleWidthStyles}>
				<Footer format={item} isCcpa={false} />
			</section>
		</article>
	);
};

// ----- Exports ----- //

export default Live;
