import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import React from 'react';

import Queue from '../imports/ui/queue/Queue.jsx';

import '../imports/ui/core/layout.jsx';

import '../imports/startup/accounts-config.js';
import '../imports/api/queues.js';

FlowRouter.route('/', {
  name: 'Queue',
  action() {
    mount(MainLayout,{
       content: <Queue />
    });
  },
});
