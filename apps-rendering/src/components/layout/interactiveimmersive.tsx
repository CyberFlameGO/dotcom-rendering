// ----- Imports ----- //

import { css } from '@emotion/react';
import {
	background,
	breakpoints,
	from,
	neutral,
} from '@guardian/source-foundations';
import { Lines } from '@guardian/source-react-components-development-kitchen';
import Body from 'components/articleBody';
import Epic from 'components/epic';
import Footer from 'components/footer';
import Headline from 'components/headline';
import ImmersiveCaption from 'components/immersiveCaption';
import Logo from 'components/logo';
import Metadata from 'components/metadata';
import RelatedContent from 'components/relatedContent';
import Series from 'components/series';
import Standfirst from 'components/standfirst';
import Tags from 'components/tags';
import { getFormat } from 'item';
import type {
	MatchReport as MatchReportItem,
	Review as ReviewItem,
	Standard as StandardItem,
} from 'item';
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
	background: ${neutral[100]};
	${darkModeCss`background: ${background.inverse};`}

	${from.wide} {
		width: ${breakpoints.wide}px;
		margin: 0 auto;
	}
`;

interface Props {
	item: StandardItem | ReviewItem | MatchReportItem;
	children: ReactNode[];
}

const InteractiveImmersive: FC<Props> = ({ item, children }) => {
	// client side code won't render an Epic if there's an element with this id
	const epicContainer = item.shouldHideReaderRevenue ? null : (
		<div css={articleWidthStyles}>
			<Epic />
		</div>
	);

	return (
		<main css={[Styles, DarkStyles]}>
			<article className="js-article" css={BorderStyles}>
				<header>
					<MainMedia
						format={getFormat(item)}
						mainMedia={item.mainMedia}
					/>
					<Series item={item} />
					<Headline item={item} />
					<div css={articleWidthStyles}>
						<Standfirst item={item} />
						<ImmersiveCaption item={item} />
					</div>
					<div css={lineStyles}>
						<Lines count={4} />
					</div>
					<section css={articleWidthStyles}>
						<Metadata item={item} />
						<Logo item={item} />
					</section>
				</header>
				<Body format={item}>{children}</Body>
				{epicContainer}
				<section className="js-tags" css={articleWidthStyles}>
					<Tags tags={item.tags} format={item} />
				</section>
			</article>
			<section css={onwardStyles}>
				<RelatedContent content={item.relatedContent} />
			</section>
			<Footer isCcpa={false} format={item} />
		</main>
	);
};

// ----- Exports ----- //

export default InteractiveImmersive;
