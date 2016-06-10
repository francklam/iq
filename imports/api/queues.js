import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Stores } from './stores.js';

export const Queues = new Mongo.Collection('queues');

if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish('queueList', function queuesPublication() {
    return Queues.find();
  });
}

Meteor.methods({
  'queues.add'(name, letter, description) {
    let store = Stores.findOne({name:name});
    if (typeof store != "undefined") {
      let existingQueue = Queues.findOne({store:store._id,letter:letter});
      if (typeof existingQueue == "undefined") {
        Queues.insert({
          store: store._id,
          storeName: name,
          letter: letter,
          description: description,
          current: 0,
          next: 1
        })
      }
    }
  },
  'queues.currentMinus'(queueId) {
    const oneCode = Queues.findOne(queueId);
    if (oneCode.current > 0) {
      let newCode = oneCode.current - 1;
      Queues.update(queueId, {
        $set: {
          current: newCode
        }
      });
    }
  },
  'queues.currentPlus'(queueId) {
    const oneCode = Queues.findOne(queueId);
    if (oneCode.current < oneCode.next - 1) {
      let newCode = oneCode.current + 1;
      Queues.update(queueId, {
        $set: {
          current: newCode
        }
      });
    }
  },
  'queues.nextCode'(queueId) {
    let newCode = 1;
    const oneCode = Queues.findOne(queueId);
    if (typeof oneCode != "undefined") {
      newCode = parseInt(oneCode.next) + 1;
      Queues.update(queueId, {
        $set: {
          next: newCode
        }
      });
    }
    return newCode;
  },
  'queues.reset'(queueId) {
    Queues.update({queue:queueId}, {
      $set: {
        current: 0,
        next: 1
      }},
      {multi: true}
    );
  },
  'queues.setScannedcode'(code) {

  }
});
