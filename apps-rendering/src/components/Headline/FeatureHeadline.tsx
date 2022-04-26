import { css } from '@emotion/react';
import { headline } from '@guardian/source-foundations';
import { Item } from 'item';
import { ReactElement } from 'react';

import { DefaultHeadline, defaultStyles, fontSizeRestriction } from './';

const featureStyles = css`
	${headline.medium({ fontWeight: 'bold' })}
`;

interface Props {
	item: Item;
}

export default ({ item }: Props): ReactElement => (
	<DefaultHeadline
		item={item}
		styles={css(defaultStyles(item), featureStyles, fontSizeRestriction)}
	/>
);
