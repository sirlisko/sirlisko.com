module.exports = {
  siteMetadata: {
    title: `sirLisko... Luca Lischetti`,
    description: `personal (and experimental) website of Luca Lischetti aka sirLisko or just another f@$#&amp;n' web developer, full time dreamer and sometimes sleeper, true 8-bit lover and sunday super hero..`,
    author: `Luca Lischetti`,
    image: `https://sirlisko.com/images/lisko.png`
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "sirLisko - Luca Lischetti's personal website",
        short_name: "sirLisko's",
        start_url: "/",
        display: "browser",
        theme_color: "#c0deed",
        background_color: "#FFFFFF",
        icon: `src/images/icon.png`
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ]
};
