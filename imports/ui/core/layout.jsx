import React from 'react';

MainLayout = ({content}) => (
    <div>
      <header>
      	IQ
      </header>
      <main>
        {content}
      </main>
      <nav className="navigation ui fluid three item menu labeled icon">

		  <a className="item" href="/newEvent">
		    <i className="calendar icon"></i>
		    Events
		  </a>
		  <a className="item" href="/balance">
		    <i className="dollar icon"></i>
		    Balance
		  </a>
		  <a className="item" href="/setting">
		    <i className="setting icon"></i>
		    Settings
		  </a>

      </nav>
    </div>
);
