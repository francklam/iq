import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Stores = new Mongo.Collection('stores');

if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish('storeList', function storesPublication(hasOwner) {
    if (hasOwner) {
      return Stores.find({owner:this.userId});
    }
    else {
      return Stores.find();
    }
  });
}

Meteor.methods({
  'stores.add'(name, address, type) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    let existingStore = Stores.findOne({name:name});
    if (typeof existingStore == "undefined") {
      Stores.insert({
        owner: Meteor.userId(),
        name: name,
        address: address,
        type: type
      })
    }
  }
});
