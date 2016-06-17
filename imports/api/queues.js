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
  'queues.add'(storeId, letter, description) {
    const store = Stores.findOne(storeId);

    if (!Meteor.userId() || store.owner != Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (typeof store != "undefined") {
      let existingQueue = Queues.findOne({store:store._id,letter:letter});
      if (typeof existingQueue == "undefined") {
        Queues.insert({
          owner: store.owner,
          store: store._id,
          storeName: store.name,
          letter: letter,
          description: description,
          current: 0,
          next: 1,
          tickets: []
        })
      }
    }
  },
  'queues.currentMinus'(queueId) {
    const oneQueue = Queues.findOne(queueId);

    if (!Meteor.userId() && oneQueue.owner != Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (oneQueue.current > 0) {
      let newCode = oneQueue.current - 1;
      Queues.update(queueId, {
        $set: {
          current: newCode
        }
      });
    }
  },
  'queues.currentPlus'(queueId) {
    const oneQueue = Queues.findOne(queueId);

    if (!Meteor.userId() && oneQueue.owner != Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (oneQueue.current < oneQueue.next - 1) {
      let newCode = oneQueue.current + 1;
      Queues.update(queueId, {
        $set: {
          current: newCode
        }
      });
    }
  },
  'queues.nextCode'(queueId) {
    const oneQueue = Queues.findOne(queueId);

    let newCode = 1;
    if (typeof oneQueue != "undefined") {
      newCode = parseInt(oneQueue.next) + 1;
      Queues.update(queueId, {
        $set: {
          next: newCode
        }
      });
    }
    return newCode;
  },
  'queues.getTicket'(queueId) {
    const oneQueue = Queues.findOne(queueId);

    let ticket = "";
    if (typeof oneQueue != "undefined") {
      let randomKey = Math.floor(Math.random() * 1000000);
      ticket = oneQueue._id + '|' + oneQueue.letter + '|' + oneQueue.next + '|' + randomKey
      newCode = parseInt(oneQueue.next) + 1;
      let newTickets = oneQueue.tickets;
      newTickets.push(ticket);

      Queues.update(queueId, {
        $set: {
          next: newCode,
          tickets: newTickets
        }
      });
    }
    return ticket;
  },
  'queues.reset'(queueId) {
    const oneQueue = Queues.findOne(queueId);

    if (!Meteor.userId() && oneQueue.owner != Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Queues.update({queue:queueId}, {
      $set: {
        current: 0,
        next: 1
      }},
      {multi: true}
    );
  },
});
