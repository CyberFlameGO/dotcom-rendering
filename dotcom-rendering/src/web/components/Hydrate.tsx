import React from 'react';

interface HydrateProps {
	when?: 'immediate' | 'idle' | 'visible';
	children: JSX.Element;
}

/**
 * Hydrates a component in the client by async loading the exported component.
 *
 * @param when - When hydration should take place.
 * 		- immediate - Hydrate without delay
 * 		- idle - Hydrate when browser idle
 * 		- visible - Hydrate when component appears in viewport
 * @param children - What you want hydrated.
 *
 */
export const Hydrate = ({ when = 'immediate', children }: HydrateProps) => (
	<gu-hydrate
		name={children.type.name}
		when={when}
		props={JSON.stringify(children.props)}
	>
		{children}
	</gu-hydrate>
);
