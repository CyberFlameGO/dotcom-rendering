import { css } from '@emotion/react';
import { textSans } from '@guardian/source-foundations';
import type { Item } from 'item';
import { ReactElement } from 'react';

import { defaultStyles, DefaultHeadline, fontSizeRestriction } from './';

const labsStyles = css`
	${textSans.xxxlarge({ lineHeight: 'regular' })}
`;

interface Props {
	item: Item;
}

export default ({ item }: Props): ReactElement => (
	<DefaultHeadline
		item={item}
		styles={css(defaultStyles(item), labsStyles, fontSizeRestriction)}
	/>
);
