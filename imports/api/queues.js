import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Queues = new Mongo.Collection('queues');
export const QueueOptions = new Mongo.Collection('queueOptions');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('queueList', function queuesPublication() {
    return Queues.find();
  });

  Meteor.publish('queueOptionList', function queueOptionsPublication() {
    return QueueOptions.find();
  });
}

Meteor.methods({
  'queues.create'(name, facebookLink) {
    let existingQueue = Queues.findOne({name:name});
    if (typeof existingQueue == "undefined") {
      Queues.insert({
        name: name,
        facebook: facebookLink
      })
    }
  },
  'queues.add'(name, letter, description) {
    let existingQueue = Queues.findOne({name:name});
    if (typeof existingQueue != "undefined") {
      let existingLetter = QueueOptions.findOne({queue:existingQueue._id,letter:letter});
      if (typeof existingLetter == "undefined") {
        QueueOptions.insert({
          queue: existingQueue._id,
          letter: letter,
          description: description,
          current: 0,
          next: 0
        })
      }
    }
  },
  'queues.currentMinus'(queueId) {
    const oneCode = QueueOptions.findOne(queueId);
    if (oneCode.current > 0) {
      let newCode = oneCode.current - 1;
      QueueOptions.update(queueId, {
        $set: {
          current: newCode
        }
      });
    }
  },
  'queues.currentPlus'(queueId) {
    const oneCode = QueueOptions.findOne(queueId);
    if (oneCode.current < oneCode.next - 1) {
      let newCode = oneCode.current + 1;
      QueueOptions.update(queueId, {
        $set: {
          current: newCode
        }
      });
    }
  },
  'queues.nextCode'(queueId) {
    let newCode = 1;
    const oneCode = QueueOptions.findOne(queueId);
    if (typeof oneCode != "undefined") {
      newCode = parseInt(oneCode.next) + 1;
      QueueOptions.update(queueId, {
        $set: {
          next: newCode
        }
      });
    }
    return newCode;
  },
  'queues.reset'(queueId) {
    QueueOptions.update({queue:queueId}, {
      $set: {
        current: 0,
        next: 0
      }},
      {multi: true}
    );
  },
  'queues.setScannedcode'(code) {
    
  }
});
