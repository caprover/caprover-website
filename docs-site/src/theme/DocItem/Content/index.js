import React from "react";
import Content from "@theme-original/DocItem/Content";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useDoc } from "@docusaurus/plugin-content-docs/client";

const archiveNotices = {
  "es-ES": ["Esta documentación está en inglés.", "Documentación anterior en español"],
  "zh-CN": ["此文档目前为英文。", "查看存档中文版文档"],
};

export default function DocItemContentWrapper(props) {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const { metadata } = useDoc();
  const notice = archiveNotices[currentLocale];
  const isUntranslated = notice &&
    metadata.permalink.startsWith(`/${currentLocale}/docs/`);

  if (!isUntranslated) return <Content {...props} />;

  return (
    <>
      <Head><meta name="robots" content="noindex, follow" /></Head>
      <aside className="alert alert--info margin-bottom--md" role="note">
        {notice[0]}{" "}
        <a href={`/${currentLocale}/docs-legacy/get-started`}>{notice[1]}</a>
      </aside>
      <Content {...props} />
    </>
  );
}
