import { ArticleSpecial, ArticlePillar } from '@guardian/libs';
import type { ArticleTheme } from '@guardian/libs';

import {
	news,
	opinion,
	sport,
	culture,
	lifestyle,
	specialReport,
	labs,
	border,
} from '@guardian/source-foundations';

type ColourType = string;

export const pillarNames: ArticleTheme[] = [
	ArticlePillar.News,
	ArticlePillar.Opinion,
	ArticlePillar.Sport,
	ArticlePillar.Culture,
	ArticlePillar.Lifestyle,
	ArticleSpecial.Labs,
];

type PillarPalette = {
	dark: ColourType;
	main: ColourType;
	bright: ColourType;
	pastel: ColourType;
	faded: ColourType;
	300: ColourType;
	400: ColourType;
	500: ColourType;
	600: ColourType;
	800: ColourType;
};

type SpecialPalette = {
	dark: ColourType;
	main: ColourType;
	bright: ColourType;
	faded: ColourType;
	300: ColourType;
	400: ColourType;
	500: ColourType;
	800: ColourType;
};

type LabsPalette = {
	dark: ColourType;
	main: ColourType;
	bright: ColourType;
	faded: ColourType;
	300: ColourType;
	400: ColourType;
	500: ColourType;
	800: ColourType;
};

// pillarPalette_DO_NOT_USE should no longer be used. Use palette from  decidePalette instead
// eslint-disable-next-line @typescript-eslint/naming-convention
export const pillarPalette_DO_NOT_USE: Record<
	ArticleTheme,
	PillarPalette | SpecialPalette | LabsPalette
> = {
	[ArticlePillar.News]: {
		dark: news[300],
		main: news[400],
		bright: news[500],
		pastel: news[600],
		faded: news[800],
		300: news[300],
		400: news[400],
		500: news[500],
		600: news[600],
		800: news[800],
	},
	[ArticlePillar.Opinion]: {
		dark: opinion[300],
		main: opinion[300],
		bright: opinion[500],
		pastel: opinion[600],
		faded: opinion[800],
		300: opinion[300],
		400: opinion[400],
		500: opinion[500],
		600: opinion[600],
		800: opinion[800],
	},
	[ArticlePillar.Sport]: {
		dark: sport[300],
		main: sport[400],
		bright: sport[500],
		pastel: sport[600],
		faded: sport[800],
		300: sport[300],
		400: sport[400],
		500: sport[500],
		600: sport[600],
		800: sport[800],
	},
	[ArticlePillar.Culture]: {
		dark: culture[300],
		main: culture[400],
		bright: culture[500],
		pastel: culture[600],
		faded: culture[800],
		300: culture[300],
		400: culture[400],
		500: culture[500],
		600: culture[600],
		800: culture[800],
	},
	[ArticlePillar.Lifestyle]: {
		dark: lifestyle[300],
		main: lifestyle[400],
		bright: lifestyle[500],
		pastel: lifestyle[600],
		faded: lifestyle[800],
		300: lifestyle[300],
		400: lifestyle[400],
		500: lifestyle[500],
		600: lifestyle[600],
		800: lifestyle[800],
	},
	[ArticleSpecial.Labs]: {
		dark: labs[300],
		main: labs[400],
		bright: '#69d1ca', // bright teal
		faded: '#65a897', // dark teal
		300: labs[300],
		400: labs[400],
		500: '#69d1ca', // bright teal
		800: '#65a897', // dark teal
	},
	[ArticleSpecial.SpecialReport]: {
		dark: specialReport[300],
		main: specialReport[400],
		bright: specialReport[500],
		faded: specialReport[800],
		300: specialReport[300],
		400: specialReport[400],
		500: specialReport[500],
		800: specialReport[800],
	},
};

/*
This takes a function, f, and applies it to all pillars.
It returns an object with each pillar as the keys and f('pillar') as the value
*/
export const pillarMap: <T>(f: (name: ArticleTheme) => T) => {
	[K in ArticleTheme]: T;
} = (f) => ({
	[ArticlePillar.News]: f(ArticlePillar.News),
	[ArticlePillar.Opinion]: f(ArticlePillar.Opinion),
	[ArticlePillar.Sport]: f(ArticlePillar.Sport),
	[ArticlePillar.Culture]: f(ArticlePillar.Culture),
	[ArticlePillar.Lifestyle]: f(ArticlePillar.Lifestyle),
	[ArticleSpecial.Labs]: f(ArticleSpecial.Labs),
	[ArticleSpecial.SpecialReport]: f(ArticleSpecial.SpecialReport),
});
/*
Further notes on this function:
	- It maps by hand because it's easy to lose track of types when you use Object.assign()
	- Where the function parameter f returns type T, pillarMap will return an object with
	  a key for each pillar and values of type T.
 */

export const neutralBorder = (pillar: ArticleTheme): ColourType => {
	switch (pillar) {
		case ArticleSpecial.Labs:
			return border.primary; // 'dark' theme
		default:
			return border.secondary;
	}
};
