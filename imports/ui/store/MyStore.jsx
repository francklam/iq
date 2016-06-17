import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Stores } from '../../api/stores.js';
import AccountsUIWrapper from '../login/AccountsUIWrapper.jsx';
import SampleMap from '../map/SampleMap.jsx';

class MyStore extends Component {

  handleAddStore(event) {
    event.preventDefault();

    let name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    let address = ReactDOM.findDOMNode(this.refs.address).value.trim();
    let type = ReactDOM.findDOMNode(this.refs.type).value.trim();

    if (name != "" && address != "" && type !="") {
      Meteor.call('stores.add', name, address, type);

      ReactDOM.findDOMNode(this.refs.name).value = "";
      ReactDOM.findDOMNode(this.refs.address).value = "";
      ReactDOM.findDOMNode(this.refs.type).value = "";
    }
  }

  handleAddMap(event) {
    event.preventDefault();

  }

  renderInputStoreInfo() {
    return (
      <form className="ui form">
        <button className="ui button" type="text" onClick={this.handleAddStore.bind(this)}>Add Store</button>
        <table width='100%'>
          <tbody>
            <tr>
              <td><label>Name</label></td>
              <td><input type="text" ref="name" placeholder="Input a name"/></td>
            </tr>
            <tr>
              <td><label>Address</label></td>
              <td><input type="text" ref="address" placeholder="Input an address"/></td>
            </tr>
            <tr>
              <td><label>Add a map</label></td>
              <td><button className="ui button" onClick={this.handleAddMap.bind(this)}>Add map</button></td>
            </tr>
            <tr>
              <td><label>Type</label></td>
              <td><input type="text" ref="type" placeholder="Input a type"/></td>
            </tr>
          </tbody>
        </table>
      </form>
    )
  }

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
	    	<AccountsUIWrapper />
        {this.props.currentUser ?
          <div>
            <h3>Logged in as: { this.props.currentUser.emails[0].address}</h3>
            {this.renderInputStoreInfo()}
            {this.renderStores()}
          </div>
          : <h3>You are not logged in</h3>
        }
      </div>
    )
  }
}

MyStore.propTypes = {
  currentUser: PropTypes.object,
  stores: PropTypes.array.isRequired,
};

export default createContainer(() => {

  Meteor.subscribe("storeList", true);

  return {
    currentUser: Meteor.user(),
    stores: Stores.find().fetch(),
  };
}, MyStore);
