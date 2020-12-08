import React from 'react';
import { css, cx } from 'emotion';

import {
    neutral,
    brandBackground,
    brandBorder,
} from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

import { pillarPalette } from '@root/src/lib/pillars';
import { namedAdSlotParameters } from '@root/src/model/advertisement';
import { ArticleBody } from '@root/src/web/components/ArticleBody';
import { RightColumn } from '@root/src/web/components/RightColumn';
import { ContainerLayout } from '@root/src/web/components/ContainerLayout';
import { ArticleContainer } from '@root/src/web/components/ArticleContainer';
import { ArticleMeta } from '@root/src/web/components/ArticleMeta';
import { GuardianLines } from '@root/src/web/components/GuardianLines';
import { SubMeta } from '@root/src/web/components/SubMeta';
import { MainMedia } from '@root/src/web/components/MainMedia';
import { ArticleTitle } from '@root/src/web/components/ArticleTitle';
import { ArticleHeadline } from '@root/src/web/components/ArticleHeadline';
import { ArticleStandfirst } from '@root/src/web/components/ArticleStandfirst';
import { Footer } from '@root/src/web/components/Footer';
import { SubNav } from '@root/src/web/components/SubNav/SubNav';
import { Section } from '@root/src/web/components/Section';
import { Nav } from '@root/src/web/components/Nav/Nav';
import { MobileStickyContainer, AdSlot } from '@root/src/web/components/AdSlot';
import { Border } from '@root/src/web/components/Border';
import { GridItem } from '@root/src/web/components/GridItem';
import { Caption } from '@root/src/web/components/Caption';
import { CommentsLayout } from '@frontend/web/components/CommentsLayout';
import { Flex } from '@frontend/web/components/Flex';
import { ContributorAvatar } from '@root/src/web/components/ContributorAvatar';

import { buildAdTargeting } from '@root/src/lib/ad-targeting';
import { parse } from '@frontend/lib/slot-machine-flags';
import { Display } from '@root/src/lib/display';

import { getCurrentPillar } from '@root/src/web/lib/layoutHelpers';
import { Hide } from '../components/Hide';

const ImmersiveGrid = ({
    children,
}: {
    children: JSX.Element | JSX.Element[];
}) => (
    <div
        className={css`
            /* IE Fallback */
            display: flex;
            flex-direction: column;
            ${until.leftCol} {
                margin-left: 0px;
            }
            ${from.leftCol} {
                margin-left: 151px;
            }
            ${from.wide} {
                margin-left: 230px;
            }

            @supports (display: grid) {
                display: grid;
                width: 100%;
                margin-left: 0;

                ${from.wide} {
                    grid-column-gap: 10px;
                    grid-template-columns:
                        219px /* Left Column (220 - 1px border) */
                        1px /* Vertical grey border */
                        1fr /* Main content */
                        300px; /* Right Column */
                    grid-template-areas:
                        '.          border      standfirst  caption'
                        '.          border      byline      right-column'
                        'meta       border      body        right-column'
                        'meta       border      body        right-column'
                        '.          border      body        right-column'
                        '.          border      .           right-column';
                }

                ${until.wide} {
                    grid-column-gap: 10px;
                    grid-template-columns:
                        140px /* Left Column (220 - 1px border) */
                        1px /* Vertical grey border */
                        1fr /* Main content */
                        300px; /* Right Column */
                    grid-template-areas:
                        '.          border      standfirst  caption'
                        'meta       border      body        right-column'
                        'meta       border      body        right-column'
                        '.          border      body        right-column'
                        '.          border      .           right-column';
                }

                ${until.leftCol} {
                    grid-column-gap: 20px;
                    grid-template-columns:
                        1fr /* Main content */
                        300px; /* Right Column */
                    grid-template-areas:
                        'standfirst  caption'
                        'meta        right-column'
                        'body        right-column';
                }

                ${until.desktop} {
                    grid-column-gap: 0px;
                    grid-template-columns: 1fr; /* Main content */
                    grid-template-areas:
                        'caption'
                        'standfirst'
                        'caption'
                        'meta'
                        'body';
                }
            }
        `}
    >
        {children}
    </div>
);

// const RowAboveMobileMedium = ({ children }: { children: React.ReactNode }) => (
//     <div
//         className={css`
//             display: flex;
//             ${from.mobileMedium} {
//                 flex-direction: row;
//             }
//         `}
//     >
//         {children}
//     </div>
// );

const avatarPositionStyles = css`
    position: absolute;
    right: 20px;
    bottom: -33px;
`;

const maxWidth = css`
    ${from.desktop} {
        max-width: 620px;
    }
`;

// const stretchLines = css`
//     ${until.phablet} {
//         margin-left: -20px;
//         margin-right: -20px;
//     }
//     ${until.mobileLandscape} {
//         margin-left: -10px;
//         margin-right: -10px;
//     }
// `;

interface Props {
    CAPI: CAPIType;
    NAV: NavType;
    display: Display;
    designType: DesignType;
    pillar: Pillar;
}

const decideCaption = (mainMedia: ImageBlockElement): string => {
    const caption = [];
    if (mainMedia && mainMedia.data && mainMedia.data.caption)
        caption.push(mainMedia.data.caption);
    if (
        mainMedia &&
        mainMedia.displayCredit &&
        mainMedia.data &&
        mainMedia.data.credit
    )
        caption.push(mainMedia.data.credit);
    return caption.join(' ');
};

export const ImmersiveCommentLayout = ({
    CAPI,
    NAV,
    display,
    designType,
    pillar,
}: Props) => {
    const {
        config: { isPaidContent },
    } = CAPI;

    const adTargeting: AdTargeting = buildAdTargeting(CAPI.config);

    const showBodyEndSlot =
        parse(CAPI.slotMachineFlags || '').showBodyEnd ||
        CAPI.config.switches.slotBodyEnd;

    // TODO:
    // 1) Read 'forceEpic' value from URL parameter and use it to force the slot to render
    // 2) Otherwise, ensure slot only renders if `CAPI.config.shouldHideReaderRevenue` equals false.

    const seriesTag = CAPI.tags.find(
        (tag) => tag.type === 'Series' || tag.type === 'Blog',
    );
    const showOnwardsLower = seriesTag && CAPI.hasStoryPackage;

    const showComments = CAPI.isCommentable;

    const mainMedia = CAPI.mainMediaElements[0] as ImageBlockElement;
    const captionText = decideCaption(mainMedia);

    const contributorTag = CAPI.tags.find((tag) => tag.type === 'Contributor');
    const avatarUrl = contributorTag && contributorTag.bylineImageUrl;
    const onlyOneContributor: boolean =
        CAPI.tags.filter((tag) => tag.type === 'Contributor').length === 1;

    const showAvatar = avatarUrl && onlyOneContributor;

    return (
        <>
            <Section
                showSideBorders={false}
                showTopBorder={false}
                padded={false}
                backgroundColour={brandBackground.primary}
            >
                <Nav
                    pillar={getCurrentPillar(CAPI)}
                    nav={NAV}
                    display={display}
                    subscribeUrl={CAPI.nav.readerRevenueLinks.header.subscribe}
                    edition={CAPI.editionId}
                />
            </Section>

            <ContainerLayout
                backgroundColour={pillarPalette[pillar].main}
                padContent={false}
                showTopBorder={false}
                sideBorders={false}
                leftContent={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <ArticleTitle
                        display={display}
                        designType={designType}
                        tags={CAPI.tags}
                        sectionLabel={CAPI.sectionLabel}
                        sectionUrl={CAPI.sectionUrl}
                        guardianBaseURL={CAPI.guardianBaseURL}
                        pillar={pillar}
                        badge={CAPI.badge}
                    />
                }
            >
                <Flex direction="row">
                    <div
                        className={cx(
                            maxWidth,
                            css`
                                min-height: 180px;
                            `,
                        )}
                    >
                        <ArticleHeadline
                            display={display}
                            headlineString={CAPI.headline}
                            designType={designType}
                            pillar={pillar}
                            tags={CAPI.tags}
                            byline={CAPI.author.byline}
                        />
                    </div>
                    <>
                        {showAvatar && avatarUrl && (
                            <div className={avatarPositionStyles}>
                                <ContributorAvatar
                                    imageSrc={avatarUrl}
                                    imageAlt={CAPI.author.byline || ''}
                                />
                            </div>
                        )}
                    </>
                </Flex>
            </ContainerLayout>

            <div
                className={css`
                    background-color: ${pillarPalette[pillar].main};
                `}
            >
                <GuardianLines pillar={pillar} count={8} effect="straight" />
            </div>

            {mainMedia && (
                <MainMedia
                    display={display}
                    designType={designType}
                    elements={CAPI.mainMediaElements}
                    pillar={pillar}
                    adTargeting={adTargeting}
                    starRating={
                        CAPI.designType === 'Review' && CAPI.starRating
                            ? CAPI.starRating
                            : undefined
                    }
                    hideCaption={true}
                />
            )}

            <Section showTopBorder={false} showSideBorders={false}>
                <ImmersiveGrid>
                    {/* Above leftCol, the Caption is controled by ImmersiveHeadline because the
                    headline stretches all the way right it can't be inside a Section so that
                    top area of the page is rendered outside the grid */}
                    <GridItem area="caption">
                        <Hide when="above" breakpoint="leftCol">
                            <Caption
                                display={display}
                                designType="Article"
                                captionText={captionText}
                                pillar={pillar}
                                shouldLimitWidth={false}
                            />
                        </Hide>
                    </GridItem>
                    <GridItem area="border">
                        <Border />
                    </GridItem>
                    <GridItem area="standfirst">
                        <ArticleStandfirst
                            display={display}
                            designType={designType}
                            pillar={pillar}
                            standfirst={CAPI.standfirst}
                        />
                    </GridItem>
                    <GridItem area="meta">
                        <div className={maxWidth}>
                            <ArticleMeta
                                display={display}
                                designType={designType}
                                pillar={pillar}
                                pageId={CAPI.pageId}
                                webTitle={CAPI.webTitle}
                                author={CAPI.author}
                                tags={CAPI.tags}
                                primaryDateline={CAPI.webPublicationDateDisplay}
                                secondaryDateline={
                                    CAPI.webPublicationDateDisplay
                                }
                            />
                        </div>
                    </GridItem>
                    <GridItem area="body">
                        <ArticleContainer>
                            <main className={maxWidth}>
                                <ArticleBody
                                    display={display}
                                    pillar={pillar}
                                    blocks={CAPI.blocks}
                                    designType={designType}
                                    adTargeting={adTargeting}
                                />
                                {showBodyEndSlot && <div id="slot-body-end" />}
                                <GuardianLines count={4} pillar={pillar} />
                                <SubMeta
                                    pillar={pillar}
                                    subMetaKeywordLinks={
                                        CAPI.subMetaKeywordLinks
                                    }
                                    subMetaSectionLinks={
                                        CAPI.subMetaSectionLinks
                                    }
                                    pageId={CAPI.pageId}
                                    webUrl={CAPI.webURL}
                                    webTitle={CAPI.webTitle}
                                    showBottomSocialButtons={
                                        CAPI.showBottomSocialButtons
                                    }
                                    badge={CAPI.badge}
                                />
                            </main>
                        </ArticleContainer>
                    </GridItem>
                    <GridItem area="right-column">
                        <RightColumn>
                            <>
                                {mainMedia && (
                                    <div
                                        className={css`
                                            margin-top: ${space[4]}px;
                                        `}
                                    >
                                        <AdSlot
                                            asps={namedAdSlotParameters(
                                                'right',
                                            )}
                                        />
                                    </div>
                                )}
                            </>
                        </RightColumn>
                    </GridItem>
                </ImmersiveGrid>
            </Section>

            <Section
                padded={false}
                showTopBorder={false}
                showSideBorders={false}
                backgroundColour={neutral[93]}
            >
                <AdSlot asps={namedAdSlotParameters('merchandising-high')} />
            </Section>

            {!isPaidContent && (
                <>
                    {/* Onwards (when signed IN) */}
                    <Section sectionId="onwards-upper-whensignedin" />
                    {showOnwardsLower && (
                        <Section sectionId="onwards-lower-whensignedin" />
                    )}

                    {showComments && (
                        <Section sectionId="comments">
                            <CommentsLayout
                                pillar={pillar}
                                baseUrl={CAPI.config.discussionApiUrl}
                                shortUrl={CAPI.config.shortUrlId}
                                commentCount={0}
                                isClosedForComments={true}
                                discussionD2Uid={CAPI.config.discussionD2Uid}
                                discussionApiClientHeader={
                                    CAPI.config.discussionApiClientHeader
                                }
                                enableDiscussionSwitch={false}
                                expanded={false}
                                onPermalinkClick={() => {}}
                            />
                        </Section>
                    )}

                    {/* Onwards (when signed OUT) */}
                    <Section
                        sectionId="onwards-upper-whensignedout"
                        showTopBorder={false}
                    />
                    {showOnwardsLower && (
                        <Section sectionId="onwards-lower-whensignedout" />
                    )}

                    <Section sectionId="most-viewed-footer" />
                </>
            )}

            <Section
                padded={false}
                showTopBorder={false}
                showSideBorders={false}
                backgroundColour={neutral[93]}
            >
                <AdSlot asps={namedAdSlotParameters('merchandising')} />
            </Section>

            {NAV.subNavSections && (
                <Section padded={false} sectionId="sub-nav-root">
                    <SubNav
                        subNavSections={NAV.subNavSections}
                        currentNavLink={NAV.currentNavLink}
                        pillar={pillar}
                    />
                    <GuardianLines count={4} pillar={pillar} />
                </Section>
            )}

            <Section
                padded={false}
                backgroundColour={brandBackground.primary}
                borderColour={brandBorder.primary}
            >
                <Footer
                    pageFooter={CAPI.pageFooter}
                    pillar={pillar}
                    pillars={NAV.pillars}
                />
            </Section>

            <div id="cmp" />
            <MobileStickyContainer />
        </>
    );
};
