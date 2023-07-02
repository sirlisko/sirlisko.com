import React from "react";

import SEO from "../components/Seo";

import "../styles/style.scss";

const NotFoundPage = () => (
  <>
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </>
);

export const Head = () => <SEO pageTitle="404: Not found" />;

export default NotFoundPage;
