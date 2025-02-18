import React from 'react';
import sha256 from 'crypto-js/sha256';

const AB_TEST_GROUPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

const NUM_GROUPS = AB_TEST_GROUPS.length;

type ContentABTestGroup = typeof AB_TEST_GROUPS[number];

const isContentABTestGroup = (n: number): n is ContentABTestGroup =>
	AB_TEST_GROUPS.includes(n as ContentABTestGroup);

interface ContentABTestContext {
	group?: ContentABTestGroup;
}

/**
 * Compute which test group to place the current page in
 *
 * @param pageId The data that is used to assign a certain piece of content into a bucket
 * @returns The test group the content is placed in
 */
export const getGroup = (pageId: string): ContentABTestGroup => {
	// Apply a SHA-256 hash to the page ID
	// Add the leading slash as this will be present when we apply the equivalent algorithm at the analysis stage
	const hashedPageId = sha256(`/${pageId}`);
	// Take the last 4 bytes of the hash
	const lastFourBytes = hashedPageId.words[hashedPageId.words.length - 1];
	// Assign the group by applying mod base 12
	// Mod can return negative values so we apply `Math.abs` to avoid negative groups
	const group = Math.abs(lastFourBytes) % NUM_GROUPS;

	if (isContentABTestGroup(group)) {
		return group;
	}

	// This should be unreachable
	// Report and throw an error if it isn't
	const error = new Error('Failed to put AMP content into group');
	window.guardian.modules.sentry.reportError(error, 'commercial');
	throw error;
};

const Context = React.createContext<ContentABTestContext | undefined>(
	undefined,
);

export const ContentABTestProvider = ({
	switches,
	pageId,
	children,
}: {
	switches: Switches;
	pageId: string;
	children: React.ReactNode;
}) => {
	const group = getGroup(pageId);
	const providerValue = switches.ampContentAbTesting ? { group } : {};
	return (
		<Context.Provider value={providerValue}>{children}</Context.Provider>
	);
};

/**
 * Obtain the current test group
 *
 * @example
 * const { group } = useContentABTestGroup();
 *
 *	switch(group) {
 *    case (0): {
 * 		// ...
 *    }
 *    case (1): {
 * 		// ...
 *    }
 *    // Handle other groups
 *  }
 *
 */
export const useContentABTestGroup = () => {
	const context = React.useContext(Context);

	if (context === undefined) {
		throw Error(
			'useContentABTestGroup must be used within the ContentABTestProvider',
		);
	}

	return context;
};
