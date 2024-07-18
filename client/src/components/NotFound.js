import React from 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div id="main">
      <div className="fof">
        <h1>Error 404</h1>
        <p>Page Not Found</p>
        <iframe
          src="https://giphy.com/embed/XnfY5snjBfH4ZZu0uH"
          width="480"
          height="346"
          style={{ border: 'none', margin: '20px 0' }}
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        ></iframe>
        <p>
          <a href="https://giphy.com/gifs/fallontonight-jimmy-fallon-tonight-show-tonightshow-XnfY5snjBfH4ZZu0uH">
            via GIPHY
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
