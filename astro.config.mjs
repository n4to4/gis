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
				{ label: 'CityGML', slug: 'data-formats/citygml' },
				{ label: 'MVT', slug: 'data-formats/mvt' },
				{ label: '3D Tiles', slug: 'data-formats/3d-tiles' },
				{ label: 'glTF', slug: 'data-formats/gltf' },
				{ label: 'CityGML 3.0', slug: 'data-formats/citygml-3-0' },
				{ label: 'CityGML 3.0 Conceptual Model Standard', slug: 'data-formats/citygml-3-0/conceptual-model-standard' },
				{ label: 'CityGML 3.0 GML Encoding Standard', slug: 'data-formats/citygml-3-0/gml-encoding-standard' },
			],
		}),
	],
});
