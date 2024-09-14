/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config.html for all the possible
// site configuration options.

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/logo.png'.
    image: '/img/logo.png',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'CapRover' /* title for your website */,
  tagline: 'Scalable, Free and Self-hosted PaaS!',
  cname: 'caprover.com',
  url: 'https://caprover.com' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'CapRover',
  organizationName: 'CapRover',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
      {doc: 'get-started', label: 'Docs'},
      {
          href: 'https://github.com/caprover/caprover',
          label: 'GitHub',
      },
      {
          href: 'https://join.slack.com/t/caprover/shared_invite/zt-2qlb28drp-RpxNfY3nUhroLuRJUUJzDA',
          label: 'Slack Group',
      },
  ],

  editUrl: 'https://github.com/caprover/caprover-website/edit/master/docs/',

  gaTrackingId: 'UA-132762521-1',

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/favicon.ico',

  /* colors for website */
  colors: {
    primaryColor: '#135c8c',
    secondaryColor: '#0e4468',
  },

  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/

  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' githubsaturn',

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags
  scripts: ['https://buttons.github.io/buttons.js'],

  /* On page navigation for the current documentation page */
  onPageNav: 'separate',

  /* Open Graph and Twitter card images */
  ogImage: 'img/logo.png',
  twitterImage: 'img/logo.png',

  algolia: {
    apiKey: '81e546c2e0c9258e48c359465bde6909',
    indexName: 'caprover',
  },

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
    repoUrl: 'https://github.com/caprover/caprover',
};

module.exports = siteConfig;
