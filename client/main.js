import { Meteor } from 'meteor/meteor';
import { Push } from 'meteor/raix:push';

Meteor.startup(() => {

  if (Meteor.isClient) {
    FlowRouter.go('Default');
  }

  if (Meteor.isCordova) {
    FlowRouter.go('Queue');

    Push.debug = true;

    Push.addListener('token', (token) => {
      alert('Token: ' + JSON.stringify(token));
      console.log(device.platform);
      if (device.platform =='Android') {
        Session.set('token',token)
      }
      else if (device.platform =='iOS') {
        Session.set('token',token)
      }
    });

    Push.addListener('alert', (notification) => {
      // Called on every message
      alert(notification.message);
    });

    Push.addListener('error', (err) => {
      alert(err);
    });

    // window.open = cordova.InAppBrowser.open;
  }

})
