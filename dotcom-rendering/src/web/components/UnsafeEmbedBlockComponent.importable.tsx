import { css } from '@emotion/react';
import { updateIframeHeight } from '../browser/updateIframeHeight';
import { ClickToView } from './ClickToView';

type Props = {
	html: string;
	alt: string;
	index: number;
	role?: RoleType;
	isTracking: boolean;
	isMainMedia?: boolean;
	source?: string;
	sourceDomain?: string;
};

const fullWidthStyles = css`
	width: 100%;
`;

export const UnsafeEmbedBlockComponent = ({
	html,
	alt,
	index,
	role,
	isTracking,
	isMainMedia,
	source,
	sourceDomain,
}: Props) => (
	<ClickToView
		role={role}
		isTracking={isTracking}
		isMainMedia={isMainMedia}
		source={source}
		sourceDomain={sourceDomain}
		onAccept={() =>
			updateIframeHeight(`iframe[name="unsafe-embed-${index}"]`)
		}
	>
		<iframe
			css={fullWidthStyles}
			className="js-embed__iframe"
			title={alt}
			// name is used to identify each unique iframe on the page to resize
			// we therefore use the "unsafe-embed-" prefix followed by index to
			// construct a unique ID
			name={`unsafe-embed-${index}`}
			data-cy="embed-block"
			srcDoc={`${html}
            <script src="https://interactive.guim.co.uk/libs/iframe-messenger/iframeMessenger.js"></script>
            <gu-script>iframeMessenger.enableAutoResize();</gu-script>`}
		/>
	</ClickToView>
);
