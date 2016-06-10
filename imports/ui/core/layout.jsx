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

		  <a className="item" href="/store">
		    <i className="calendar icon"></i>
		    Store
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
