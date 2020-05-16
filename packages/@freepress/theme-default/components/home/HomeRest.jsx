import React from 'react';
import { useSiteContext } from '@freepress/core';

const homeRest = () => {
  const {
    currentPageInfo: { Markdown }
  } = useSiteContext();

  return (
    <div className="home-page page2">
      <div className="home-page-wrapper home-markdown markdown">
        <Markdown />
      </div>
    </div>
  );
};

export default homeRest;
