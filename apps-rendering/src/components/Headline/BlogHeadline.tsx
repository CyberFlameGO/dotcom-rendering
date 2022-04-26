import { css } from '@emotion/react';
import { remSpace } from '@guardian/source-foundations';
import { Item } from 'item';
import { ReactElement } from 'react';

import { DefaultHeadline, defaultStyles, fontSizeRestriction } from './';

const liveblogStyles = css`
	padding: 0 0 ${remSpace[5]};
`;

interface Props {
	item: Item;
}

export default ({ item }: Props): ReactElement => (
	<DefaultHeadline
		item={item}
		styles={css(defaultStyles(item), fontSizeRestriction, liveblogStyles)}
	/>
);
