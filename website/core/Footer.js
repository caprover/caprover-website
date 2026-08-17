/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const labels = {
  en: {
    docs: "Docs",
    gettingStarted: "Getting Started",
    community: "Community",
    more: "More",
  },
  "zh-CN": {
    docs: "文档",
    gettingStarted: "开始使用",
    community: "社区",
    more: "更多",
  },
};

class Footer extends React.Component {
  currentLanguage() {
    return this.props.language || "en";
  }

  homeUrl() {
    const language = this.currentLanguage();
    const baseUrl = this.props.config.baseUrl;
    return language && language !== "en" ? baseUrl + language + "/" : baseUrl;
  }

  docUrl(doc) {
    const language = this.currentLanguage();
    const baseUrl = this.props.config.baseUrl;
    return language && language !== "en"
      ? baseUrl + "docs/" + language + "/" + doc
      : baseUrl + "docs/" + doc;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + "/" : "") + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    const t = labels[this.currentLanguage()] || labels.en;
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.homeUrl()} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>{t.docs}</h5>
            <a href={this.docUrl("get-started.html")}>{t.gettingStarted}</a>
          </div>
          <div>
            <h5>{t.community}</h5>
            <a
              href="https://twitter.com/cap_rover"
              target="_blank"
              rel="noreferrer noopener"
            >
              Twitter
            </a>
            <a
              href="https://join.slack.com/t/caprover/shared_invite/zt-3lmngygtv-MOIiGy~LHkZ6S8sbYYqTDA"
              target="_blank"
              rel="noreferrer noopener"
            >
              Slack Group
            </a>
          </div>
          <div>
            <h5>{t.more}</h5>
            <a href="https://github.com/caprover/caprover" target="_blank">
              GitHub
            </a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/caprover/caprover/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>

        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
