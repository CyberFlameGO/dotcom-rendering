import { ArticleDesign } from '@guardian/libs';
import { Flex } from './Flex';
import { LeftColumn } from './LeftColumn';
import { Hide } from './Hide';

import { useComments } from '../lib/useComments';
import { formatAttrString } from '../lib/formatAttrString';

import { ContainerTitle } from './ContainerTitle';
import { OnwardsContainer } from './OnwardsContainer';
import { MoreThanFive } from './MoreThanFive';
import { ExactlyFive } from './ExactlyFive';
import { FourOrLess } from './FourOrLess';
import { Spotlight } from './Spotlight';

const decideLayout = (trails: TrailType[]) => {
	switch (trails.length) {
		case 1:
			return <Spotlight content={trails} />;
		case 2:
		case 3:
		case 4:
			return <FourOrLess content={trails} />;
		case 5:
			return <ExactlyFive content={trails} />;
		case 6:
		case 7:
		case 8:
		default:
			return <MoreThanFive content={trails} />;
	}
};

export const OnwardsLayout: React.FC<OnwardsType> = (
	data: OnwardsType,
	format: ArticleFormat,
) => {
	const sections = useComments([data]);

	return (
		<>
			{sections.map((section, index) => (
				<Flex key={`${section.heading}-${index}`}>
					<LeftColumn
						borderType="partial"
						size={
							format.design === ArticleDesign.LiveBlog ||
							format.design === ArticleDesign.DeadBlog
								? 'wide'
								: 'compact'
						}
					>
						<ContainerTitle
							title={section.heading}
							description={section.description}
							url={section.url}
						/>
					</LeftColumn>
					<OnwardsContainer
						dataComponentName={section.ophanComponentName}
						dataLinkName={formatAttrString(section.heading)}
					>
						<Hide when="above" breakpoint="leftCol">
							<ContainerTitle
								title={section.heading}
								description={section.description}
								url={section.url}
							/>
						</Hide>
						{decideLayout(section.trails.slice(0, 8))}
					</OnwardsContainer>
				</Flex>
			))}
		</>
	);
};
