import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Stores } from '../../api/stores.js';

class FindStore extends Component {

  renderStores() {
    return (
      <div>
        <table className="ui compact unstackable table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            { this.props.stores.map((store) => {
                let link = "/store/" + store._id;
                return (
                  <tr key={store._id}>
                    <td><a href={link}>{store.name}</a></td>
                    <td>{store.address}</td>
                    <td>{store.type}</td>
                  </tr>
                )}
            )}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
    	<div className="container">
        {this.renderStores()}
      </div>
    )
  }
}

FindStore.propTypes = {
  stores: PropTypes.array.isRequired,
};

export default createContainer(() => {

  Meteor.subscribe("storeList");

  return {
    stores: Stores.find().fetch(),
  };
}, FindStore);
