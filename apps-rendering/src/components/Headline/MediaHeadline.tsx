import { css } from '@emotion/react';
import { headline } from '@guardian/source-foundations';
import { Item } from 'item';
import { ReactElement } from 'react';

import { DefaultHeadline, defaultStyles, fontSizeRestriction } from './';

const mediaStyles = css`
	${headline.medium({ fontWeight: 'medium' })}
`;

interface Props {
	item: Item;
}

export default ({ item }: Props): ReactElement => (
	<DefaultHeadline
		item={item}
		styles={css(defaultStyles(item), mediaStyles, fontSizeRestriction)}
	/>
);
