import { css } from '@emotion/react';
import { headline, remSpace } from '@guardian/source-foundations';
import { Item } from 'item';
import { ReactElement } from 'react';

import { DefaultHeadline, defaultStyles, fontSizeRestriction } from './';

const commentStyles = css`
	${headline.medium({ fontWeight: 'light' })}
	padding-bottom: ${remSpace[1]};
`;

interface Props {
	item: Item;
}

export default ({ item }: Props): ReactElement => (
	<DefaultHeadline
		item={item}
		styles={css(defaultStyles(item), commentStyles, fontSizeRestriction)}
	/>
);
