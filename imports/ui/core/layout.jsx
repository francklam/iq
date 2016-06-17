import React from 'react';

MainLayout = ({content}) => (
    <div>
      <header>
      	IQ
      </header>
      <main>
        {content}
      </main>
      <nav className="navigation ui fluid four item menu labeled icon">
  		  <a className="item" href="/mystore">
  		    <i className="calendar icon"></i>
  		    My Stores
  		  </a>
        <a className="item" href="/findstore">
  		    <i className="calendar icon"></i>
  		    Find Stores
  		  </a>
  		  <a className="item" href="/queueing">
  		    <i className="dollar icon"></i>
  		    Queue
  		  </a>
  		  <a className="item" href="/map">
  		    <i className="setting icon"></i>
  		    Map
  		  </a>
      </nav>
    </div>
);
