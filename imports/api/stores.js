import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Stores = new Mongo.Collection('stores');

if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish('storeList', function storesPublication() {
    return Stores.find({owner:this.userId});
  });
}

Meteor.methods({
  'stores.add'(owner, name, address, type) {
    let existingStore = Stores.findOne({name:name});
    if (typeof existingStore == "undefined") {
      Stores.insert({
        owner: owner,
        name: name,
        address: address,
        type: type
      })
    }
  }
});
