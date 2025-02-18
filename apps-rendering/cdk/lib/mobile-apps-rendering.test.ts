import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { MobileAppsRendering } from './mobile-apps-rendering';

describe('The MobileAppsRendering stack', () => {
	it('matches the snapshot', () => {
		const app = new App();
		const stack = new MobileAppsRendering(app, 'MobileAppsRendering', {
			stack: 'mobile',
			recordPrefix: 'mobile-rendering',
			asgMinSize: { CODE: 1, PROD: 3 },
			asgMaxSize: { CODE: 2, PROD: 12 },
		});
		expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
	});
});

describe('The MobileAppsRenderingPreview stack', () => {
	it('matches the snapshot', () => {
		const app = new App();
		const stack = new MobileAppsRendering(
			app,
			'MobileAppsRenderingPreview',
			{
				stack: 'mobile-preview',
				recordPrefix: 'mobile-preview-rendering',
				asgMinSize: { CODE: 1, PROD: 1 },
				asgMaxSize: { CODE: 2, PROD: 2 },
			},
		);
		expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
	});
});
