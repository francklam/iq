import { Meteor } from 'meteor/meteor';
import { Push } from 'meteor/raix:push';

Meteor.methods({
  'notification.server'(title,text) {
      let badge = 1
      Push.send({
          from: 'push',
          title: title,
          text: text,
          badge: badge,
          // sound: 'airhorn.caf',
          query: {
              // this will send to all users
          },
          notId: 5
      });
  },
  'notification.user'(title,text,userId) {
      let badge = 1
      Push.send({
          from: 'push',
          title: title,
          text: text,
          badge: badge,
          // sound: 'airhorn.caf',
          query: {
              userId: userId //this will send to a specific Meteor.user()._id
          }
      });
  },
  'notification.token'(title,text,token) {
      let badge = 1
      Push.send({
          from: 'push',
          title: title,
          text: text,
          badge: badge,
          // sound: 'airhorn.caf',
          token: token
      });
  },
});
