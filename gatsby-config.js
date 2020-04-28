module.exports = {
  siteMetadata: {
    title: 'Gatsby + WordPress Starter',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        // The base url to your WP site.
        baseUrl: 'localhost:8080',
        // WP.com sites set to true, WP.org set to false
        hostingWPCOM: false,
        // The protocol. This can be http or https.
        protocol: 'http',
        // Use 'Advanced Custom Fields' Wordpress plugin
        useACF: false,
        auth: {},
        // Set to true to debug endpoints on 'gatsby build'
        verboseOutput: false,
        includedRoutes: [
          "**/categories",
          "**/posts",
          "**/pages",
          "**/media",
          "**/tags",
          "**/taxonomies",
          "**/users",
          "**/pickups",
          "**/blocks",
          "**/wp_v2",
          "**/comments",
          "**/search",
          "**/statuses",
          "**/types"
        ],
        // use a custom normalizer which is applied after the built-in ones.
        normalizer: function ({ entities }) {
          const pickups = entities.filter(e => e.__type === 'wordpress__wp_pickups')
          return entities.map(e => {
            if (e.__type === 'wordpress__POST') {
              let hasPickups = e.pickups && Array.isArray(e.pickups) && e.pickups.length
              // Replace pickups with links to their nodes.
              if (hasPickups) {
                e.pickups___NODE = e.pickups.map(
                  c => pickups.find(pObj => c === pObj.wordpress_id).id
                )
              }
              delete e.pickups
            }
            return e
          })
        },
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      // Removes unused css rules
      resolve:'gatsby-plugin-purgecss',
      options: {
        // Activates purging in gatsby develop
        develop: true,
        // Purge only the main css file
        purgeOnly: ['/all.sass'],
      },
    }, // must be after other CSS plugins
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
