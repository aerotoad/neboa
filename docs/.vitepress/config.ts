import { defineConfig } from 'vitepress'
import https from 'https';

// https://vitepress.dev/reference/site-config
export default async function () {

  const nebraLatestRelease = await getRelease() as any;

  return defineConfig({
    title: "Nebra",
    description: "Type-safe NoSQL with Node & SQLite.",
    appearance: 'dark',
    cleanUrls: true,
    head: [
      ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
      ['link', { rel: 'manifest', href: '/site.webmanifest' }],
      ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }],
      ['meta', { name: 'msapplication-TileColor', content: '#5bbad5' }],
      ['meta', { name: 'theme-color', content: '#ffffff' }],
    ],
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      search: {
        provider: 'local'
      },
      logo: '/logo.png',
      nav: [
        {
          text: 'Documentation',
          items: [
            { text: 'Guide', link: '/guide/what-is-nebra' },
            { text: 'Getting started', link: '/guide/getting-started' },
          ]
        },
        {
          text: nebraLatestRelease.tag_name,
          items: [
            { text: 'Latest Release', link: nebraLatestRelease.html_url },
            { text: 'Changelog', link: 'https://github.com/aerotoad/nebra/blob/main/CHANGELOG.md' },
          ]
        }
      ],

      sidebar: [
        {
          text: 'Introduction',
          collapsed: false,
          items: [
            { text: 'What is Nebra?', link: '/guide/what-is-nebra' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ]
        },
        {
          text: 'Basic usage',
          collapsed: false,
          items: [
            { text: 'Connecting to a database', link: '/guide/basic/connecting-a-database' },
            { text: 'Working with collections', link: '/guide/basic/working-with-collections' },
          ]
        },
        {
          text: 'Queries',
          collapsed: false,
          items: [
            { text: 'Creating queries', link: '/guide/queries/creating-queries' },
            { text: 'Query constraints', link: '/guide/queries/query-constraints' },
            { text: 'Relational data', link: '/guide/queries/relational-data' },
          ]
        }
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/aerotoad/nebra' }
      ],
      footer: {
        message: `
          Released under the 
          <a href="https://opensource.org/licenses/MIT" target="_blank" class="footer-year">MIT License</a>.
        `,
        copyright: 'Copyright © 2022 Samuel Bazaga'
      },
    }
  })
}

function getRelease() {
  return new Promise((resolve) => {
    https.get({
      hostname: 'api.github.com',
      path: '/repos/aerotoad/nebra/releases/latest',
      headers: {
        'User-Agent': 'nebra-docs'
      }
    }, (res) => {
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });
  });
}
