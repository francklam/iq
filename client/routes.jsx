import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import React from 'react';

import Queue from '../imports/ui/queue/Queue.jsx';
import Queueing from '../imports/ui/queue/Queueing.jsx';
import MyStore from '../imports/ui/store/MyStore.jsx';
import FindStore from '../imports/ui/store/FindStore.jsx';
import SampleMap from '../imports/ui/map/SampleMap.jsx';

import '../imports/ui/core/layout.jsx';

import '../imports/startup/accounts-config.js';
import '../imports/api/queues.js';

FlowRouter.route('/', {
  name: 'Default',
  triggersEnter: [(context, redirect) => {
    redirect('FindStore');
  }]
});
FlowRouter.route('/queueing', {
  name: 'Queueing',
  action() {
    mount(MainLayout,{
       content: <Queueing />
    });
  },
});
FlowRouter.route('/map', {
  name: 'Map',
  action() {
    mount(MainLayout,{
       content: <SampleMap />
    });
  },
});
FlowRouter.route('/mystore', {
  name: 'MyStore',
  action() {
    mount(MainLayout,{
       content: <MyStore />
    });
  },
});
FlowRouter.route('/findstore', {
  name: 'FindStore',
  action() {
    mount(MainLayout,{
       content: <FindStore />
    });
  },
});
FlowRouter.route('/store/:_storeId', {
  name: 'StoreQueue',
  action(params, queryParams) {
    mount(MainLayout,{
      content: <Queue store={params._storeId} />
    });
  },
});
