import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import QRCode from 'qrcode.react';
import QueueingItem from './QueueingItem.jsx';
import { Queues } from '../../api/queues.js';


class Queueing extends Component {

  constructor(props) {
    super(props);

    Session.setDefault('token','');
  }

  codeAlreadyAdded(queue, letter) {
    let array = this.props.myCodes;
    for (let i=0; i < array.length; i++) {
      if (array[i].queue == queue && array[i].letter == letter ) return true;
    }
    return false;
  }

  scanQRCode(event) {
    event.preventDefault();

    cordova.plugins.barcodeScanner.scan( (res) => {
      alert("Scanned :" + res.text);
      let array = res.text.split('|');
      if (!this.codeAlreadyAdded(array[0], array[1])) {
        Meteor.call('queues.setScannedcode', res.text);
        this.props.myCodes.push({queue:array[0],letter:array[1],number:array[2]});
        Session.setPersistent("myCodes", this.props.myCodes);
      }
    }, (error) => {
      alert("Scan failed: " + error);
    });
  }

  getCode() {
    if (this.props.currentCode != "" && typeof this.props.currentCode != 'undefined') {
      let array = this.props.currentCode.split('|');
      if (!this.codeAlreadyAdded(array[0], array[1])) {
        Meteor.call('queues.setScannedcode', this.props.currentCode);
        this.props.myCodes.push({queue:array[0],letter:array[1],number:array[2]});
        Session.setPersistent("myCodes", this.props.myCodes);
      }
    }
  }

  clearCode() {
    Session.setPersistent("myCodes", []);
  }

  componentWillMount() {
    // Empty array by default
    Session.setDefaultPersistent("myCodes", []);
  }

  renderMyQueue() {
    return (
      <table className="ui compact unstackable table">
        <thead>
          <tr>
            <th>Queue</th>
            <th>Letter</th>
            <th>Number</th>
            <th>Current</th>
          </tr>
        </thead>
        <tbody>
          { this.props.myCodes.map((oneCode,i) => {
            let currentQueue = this.props.queues.find((oneQueue) => {
              return oneCode.queue == oneQueue.store && oneCode.letter == oneQueue.letter;
            });
            return (
              <QueueingItem key={i} code={oneCode} queue={currentQueue}/>
            )
          })}
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div className="container">
        <div>
          <button className="ui button" type="text" onClick={this.scanQRCode.bind(this)}>Scan code</button>
          <button className="ui button" type="text" onClick={this.getCode.bind(this)}>Get code</button>
          <button className="ui button" type="text" onClick={this.clearCode.bind(this)}>Clear</button>

        </div>
        {this.renderMyQueue()}
      </div>

    )
  }
}

Queueing.propTypes = {
  currentCode: PropTypes.string,
  queues: PropTypes.array.isRequired,
  myCodes: PropTypes.array.isRequired,
};

export default createContainer((props) => {

  Meteor.subscribe('queueList');

  return {
    currentCode: props.currentCode,
    queues: Queues.find().fetch(),
    myCodes: Session.get("myCodes"),
  };
}, Queueing);
