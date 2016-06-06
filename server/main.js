import { Meteor } from 'meteor/meteor';
import { Push } from 'meteor/raix:push';

import '../imports/api/notifications.js';
import '../imports/api/queues.js';

Meteor.startup(() => {
  // code to run on server at startup
  Push.debug = true;

  Push.allow({
    send: function(userId, notification) {
        return true; // Allow all users to send
    }
  });

  Push.addListener('token', (token) => {
    console.log('Token: ' + JSON.stringify(token));
  });

  Push.addListener('error', (err) => {
    console.log(err);
  });

  Push.addListener('alert', (notification) => {
    // Called on every message
    console.log(notification.message);
  });

  let smtp = {
    username: 'lambrotherstest@gmail.com',   // eg: server@gentlenode.com
    password: '123456May',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.googlemail.com',  // eg: mail.gandi.net
    port: 465
  };
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + smtp.password + '@' + smtp.server + ':' + smtp.port;

});
