import React from "react";
import Helmet from "react-helmet";
import {ThemeProvider} from "styled-components"
import config from "../../data/SiteConfig";
import "./css/index.css";
import "./css/prism-okaidia.css"
import theme from './theme'


export default class MainLayout extends React.Component {
  getLocalTitle() {
    const pathPrefix = config.pathPrefix ? config.pathPrefix : "/";
    const currentPath = this.props.location.pathname
      .replace(pathPrefix, "")
      .replace("/", "");
    let title = "";
    if (currentPath === "") {
      title = "Home";
    } else if (currentPath.includes("posts")) {
      title = "Article";
    }
    return title;
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <Helmet>
          <title>{`${config.siteTitle} |  ${this.getLocalTitle()}`}</title>
          <meta name="description" content={config.siteDescription} />
        </Helmet>
        <ThemeProvider theme={theme}>
          {children()}
        </ThemeProvider>
      </div>
    );
  }
}
