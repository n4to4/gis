// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://n4to4.github.io',
	base: '/gis',
	integrations: [
		starlight({
			title: 'GIS Wiki',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/n4to4/gis' }],
			sidebar: [
				{ label: 'GISの全体像', slug: '' },
				{ label: 'データフォーマット一覧', slug: 'data-formats' },
				{ label: 'CityGML 2.0', slug: 'citygml-2-0' },
			],
		}),
	],
});
