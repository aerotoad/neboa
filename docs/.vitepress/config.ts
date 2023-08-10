import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nebra",
  description: "Type-safe NoSQL with Node & SQLite.",
  appearance: 'dark',
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
        text: 'Usage',
        collapsed: false,
        items: [
          { text: 'Creating a Database', link: '/guide/creating-a-database' },
          { text: 'Creating a Collection', link: '/guide/creating-a-collection' },
          { text: 'Working with documents', link: '/guide/working-with-documents' },
        ]
      },
      {
        text: 'Querying',
        collapsed: false,
        items: [
          { text: 'Creating queries', link: '/guide/creating-queries' },
          { text: 'Query constraints', link: '/guide/query-constraints' },
          { text: 'Relational data', link: '/guide/relational-data' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
