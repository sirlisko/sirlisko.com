import React from "react";
import Head from "next/head";

const data = {
  title: `sirLisko... Luca Lischetti`,
  description: `personal (and experimental) website of Luca Lischetti aka sirLisko or just another f@$#&amp;n' web developer, full time dreamer and sometimes sleeper, true 8-bit lover and sunday super hero..`,
  author: `Luca Lischetti`,
  image: `https://sirlisko.com/images/lisko.png`,
  siteUrl: `https://sirlisko.com`,
};

interface SEOProps {
  pageTitle: string;
  keywords?: string[];
  description?: string;
  lang?: string;
  image?: string;
}

const SEO = ({ description, keywords, pageTitle, image }: SEOProps) => {
  const metaDescription = description || data.description;
  const formattedTitle = `${pageTitle} | ${data.title}`;
  return (
    <Head>
      <title>{formattedTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:image" content={image || data.image} />
      <meta property="og:description" content="metaDescription" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={data.author} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {keywords && keywords.length > 0 ? (
        <meta name="keywords" content={keywords.join(`, `)} />
      ) : null}
      <link
        type="text/plain"
        rel="author"
        href="https://sirlisko.com/humans.txt"
      />
    </Head>
  );
};

export default SEO;
