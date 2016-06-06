import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import QRCode from 'qrcode.react';
import QueueOption from './QueueOption.jsx';
import Queueing from './Queueing.jsx';
import { Queues, QueueOptions } from '../../api/queues.js';

class Queue extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scanCode: "",
    };
  }

  componentWillMount() {
    Session.setDefault("scannedCode", "");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scannedCode == this.state.scanCode) {
      this.setState({
        scanCode: "",
      })
    }
  }

  handleAddQueue(event) {
    event.preventDefault();

    let letter = ReactDOM.findDOMNode(this.refs.letter).value.trim();
    let description = ReactDOM.findDOMNode(this.refs.description).value.trim();

    if (letter != "" && description != "") {
      Meteor.call('queues.add','Toto',letter,description);
    }
  }

  renderInputQueue() {
    return (
      <form className="ui form">
        <button className="ui button" type="text" onClick={this.handleAddQueue.bind(this)}>Add</button>
        <table width='100%'>
          <tbody>
            <tr>
              <td><label>Letter</label></td>
              <td><input type="text" ref="letter" placeholder="Input a letter"/></td>
            </tr>
            <tr>
              <td><label>Description</label></td>
              <td><input type="text" ref="description" placeholder="Input a description"/></td>
            </tr>
          </tbody>
        </table>
      </form>
    )
  }

  handleNextCode(letter, number) {
    event.preventDefault();

    let randomKey = Math.floor(Math.random() * 1000000);

    this.setState({
      scanCode: this.props.queues[0].queue + '|' + letter + '|' + number + '|' + randomKey
    })
  }

  handleReset(event) {
    event.preventDefault();

    Meteor.call('queues.reset', this.props.queues[0].queue);
  }

  renderQueues() {
    return (
      <div>
        <button className="ui button" type="text" onClick={this.handleReset.bind(this)}>Reset numbers</button>
        <table className="ui compact unstackable table">
          <thead>
            <tr>
              <th>Desc</th>
              <th>Letter</th>
              <th>Number</th>
              <th>Next</th>
            </tr>
          </thead>
          <tbody>
            { this.props.queues.map((queue) => {
                return (
                  <QueueOption key={queue._id} queue={queue} onSelected={this.handleNextCode.bind(this)}/>
                )}
            )}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderInputQueue()}
        {this.renderQueues()}
        <div className="ui center aligned basic segment" id="context">
          <div>
            <span>Code : {this.state.scanCode}</span>
          </div>
          <QRCode value={this.state.scanCode.toString()}/>
        </div>
        <Queueing currentCode={this.state.scanCode} />
      </div>
    )
  }

}

Queue.propTypes = {
  queues: PropTypes.array.isRequired,
  scannedCode: PropTypes.string.isRequired
};

export default createContainer(() => {

  Meteor.subscribe('queueOptions');

  return {
   queues: QueueOptions.find().fetch(),
   scannedCode: Session.get("scannedCode"),
  };
}, Queue);
