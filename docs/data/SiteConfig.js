module.exports = {
  siteTitleInHeader: "LambStatus", // Site title.
  siteTitle: "Serverless Status Page system", // Site title.
  siteUrl: "https://lambstatus.github.io", // Domain of your website without pathPrefix.
  pathPrefix: "/", // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteDescription: "Build and maintain your status page with minimum effort and cost", // Website description used for meta description tag.
  logoForMetatag: "/logos/logo-metatag.png",
  templateLink: "https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.5.1/lamb-status.yml",
  googleAnalyticsID: "UA-54764667-3 ", // GA tracking ID.
  userTwitter: "LambStatus",
  // Links to social profiles/projects you want to display in the author segment/navigation bar.
  userLinks: {
    APIDoc: "https://lambstatus.github.io/apidocs/",
    GitHub: "https://github.com/ks888/LambStatus",
    Twitter: "https://twitter.com/LambStatus"
  },
  copyright: "Copyright © 2017. Advanced User", // Copyright string for the footer of the website.
  themeColor: "#C8E6C9", // Used for setting manifest and progress theme colors.
  backgroundColor: "#e0e0e0" // Used for setting manifest background color.
  // TODO: Move this literally anywhere better.
};
