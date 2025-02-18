import React from 'react';
import { css } from '@emotion/react';

import { neutral, textSans } from '@guardian/source-foundations';
import ChevronRightSingle from '../../static/icons/chevron-right-single.svg';
import ChevronRightDouble from '../../static/icons/chevron-right-double.svg';
import ChevronLeftSingle from '../../static/icons/chevron-left-single.svg';
import ChevronLeftDouble from '../../static/icons/chevron-left-double.svg';

const paginationStyle = css`
	${textSans.xxsmall()};
	font-weight: bold;

	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const paginationLinkStyle = (isActive: boolean) => css`
	width: 36px;
	border-radius: 100%;

	position: relative;
	color: ${neutral[7]};
	border: 1px solid ${neutral[86]};
	height: 36px;
	display: inline-block;

	margin-right: 0px;

	span {
		fill: ${neutral[100]};

		svg {
			position: absolute;
			top: 10px;
			left: 9px;
			width: 16px;
			height: 16px;
			fill: ${isActive ? neutral[46] : neutral[86]};
		}
	}
`;

const marginRightStyle = css`
	margin-right: 5px;
`;

export const Pagination: React.FunctionComponent<{
	pagination?: Pagination;
	guardianURL: string;
}> = ({ pagination, guardianURL }) => {
	if (!pagination) {
		return null;
	}

	return (
		<div css={paginationStyle}>
			<p>
				<a
					css={[
						paginationLinkStyle(pagination.newest !== undefined),
						marginRightStyle,
					]}
					href={
						pagination.newest
							? `${guardianURL}${pagination.newest}`
							: ''
					}
				>
					<span>
						<ChevronLeftDouble />
					</span>
				</a>

				<a
					css={paginationLinkStyle(pagination.newest !== undefined)}
					href={
						pagination.newest
							? `${guardianURL}${pagination.newest}`
							: ''
					}
				>
					<span>
						<ChevronLeftSingle />
					</span>
				</a>
			</p>

			<p>
				{pagination.currentPage} of {pagination.totalPages}
			</p>

			<p>
				<a
					css={[
						paginationLinkStyle(pagination.older !== undefined),
						marginRightStyle,
					]}
					href={
						pagination.older
							? `${guardianURL}${pagination.older}`
							: ''
					}
				>
					<span>
						<ChevronRightSingle />
					</span>
				</a>

				<a
					css={paginationLinkStyle(pagination.older !== undefined)}
					href={
						pagination.older
							? `${guardianURL}${pagination.older}`
							: ''
					}
				>
					<span>
						<ChevronRightDouble />
					</span>
				</a>
			</p>
		</div>
	);
};
