import { css } from '@emotion/react';

type Props = {
	children: React.ReactNode;
};

export const HeadlineWrapper = ({ children }: Props) => (
	<div
		css={css`
			padding-bottom: 8px;
			padding-left: 5px;
			padding-right: 5px;
			flex-grow: 1;
		`}
	>
		{children}
	</div>
);
