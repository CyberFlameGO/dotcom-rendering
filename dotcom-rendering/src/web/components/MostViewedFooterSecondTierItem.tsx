import { css } from '@emotion/react';

import {
	border,
	neutral,
	text,
	headline,
	from,
} from '@guardian/source-foundations';

import { AgeWarning } from './AgeWarning';
import { Avatar } from './Avatar';
import { LinkHeadline } from './LinkHeadline';
import { Flex } from './Flex';
import { decidePalette } from '../lib/decidePalette';

const itemStyles = (showRightBorder?: boolean) => css`
	position: relative;

	padding-left: 10px;
	padding-right: 10px;
	padding-bottom: 12px;

	border-top: 1px solid ${border.secondary};
	${from.tablet} {
		border-right: ${showRightBorder && `1px solid ${border.secondary}`};
	}

	min-height: 3.25rem;

	flex-basis: 100%;

	&:hover {
		cursor: pointer;
	}

	&:hover,
	:focus {
		background: ${neutral[97]};
	}
`;

const titleStyles = css`
	${headline.xxxsmall({ fontWeight: 'bold' })}
	padding-top: 4px;
`;

const headlineStyles = css`
	word-wrap: break-word;
	overflow: hidden;
`;

const headlineLink = css`
	text-decoration: none;
	color: ${text.anchorSecondary};
	font-weight: 500;
	${headline.xxxsmall()};

	display: block; /* To ensure focus outline works okay */
`;

const ageWarningStyles = css`
	margin-top: 4px;
`;

const avatarSizeStyles = css`
	height: 90px;
	width: 90px;
`;

const avatarContainerStyles = css`
	display: flex;
	flex-direction: row-reverse;

	margin-left: 5px;
	margin-top: 24px;
`;

type Props = {
	trail: TrailType;
	title: string;
	showRightBorder?: boolean; // Prevents double borders
	dataLinkName: string;
};

export const MostViewedFooterSecondTierItem = ({
	trail,
	title,
	showRightBorder,
	dataLinkName,
}: Props) => {
	const {
		url,
		avatarUrl,
		image,
		format,
		byline,
		showByline,
		ageWarning,
		headline: headlineText,
	} = trail;

	const avatarToShow = avatarUrl || image;

	return (
		<div css={itemStyles(showRightBorder)}>
			<a css={headlineLink} href={url} data-link-name={dataLinkName}>
				<Flex>
					<div css={headlineStyles}>
						<div css={titleStyles}>{title}</div>
						<LinkHeadline
							headlineText={headlineText}
							format={format}
							size="small"
							byline={showByline ? byline : undefined}
						/>

						{ageWarning && (
							<div css={ageWarningStyles}>
								<AgeWarning age={ageWarning} size="small" />
							</div>
						)}
					</div>
					<>
						{avatarToShow && (
							<div css={avatarContainerStyles}>
								<div css={avatarSizeStyles}>
									<Avatar
										imageSrc={avatarToShow}
										imageAlt=""
										palette={decidePalette(format)}
									/>
								</div>
							</div>
						)}
					</>
				</Flex>
			</a>
		</div>
	);
};
