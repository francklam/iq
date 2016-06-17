import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import QRCode from 'qrcode.react';
import QueueOption from './QueueOption.jsx';
import Queueing from './Queueing.jsx';
import { Queues } from '../../api/queues.js';
import { Stores } from '../../api/stores.js';

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
      Meteor.call('queues.add',this.props.store,letter,description);

      ReactDOM.findDOMNode(this.refs.letter).value = 0;
      ReactDOM.findDOMNode(this.refs.description).value = 0;
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

  codeAlreadyAdded(queue) {
    let array = Session.get("myCodes");
    for (let i=0; i < array.length; i++) {
      if (array[i].queue == queue._id && array[i].letter == queue.letter ) return true;
    }
    return false;
  }

  handleNextCode(queue) {
    event.preventDefault();

    if (!this.codeAlreadyAdded(queue)) {
      Meteor.call('queues.getTicket',queue._id, (err, res) => {
        if (err) {
          alert("Could not get ticket");
        }
        else {
          let array = res.split('|');
          let currentCodes = this.props.myCodes;
          currentCodes.push({queue:array[0],letter:array[1],number:array[2]});
          Session.setPersistent("myCodes", currentCodes);
        }
      });
    }


    // let randomKey = Math.floor(Math.random() * 1000000);
    //
    // this.setState({
    //   scanCode: this.props.queues[0].store + '|' + letter + '|' + number + '|' + randomKey
    // })
  }

  handleReset(event) {
    event.preventDefault();

    Meteor.call('queues.reset', this.props.queues[0].queue);
  }

  renderQueues() {
    return (
      <div>
        {this.props.isOwner ? <button className="ui button" type="text" onClick={this.handleReset.bind(this)}>Reset numbers</button> : ''}
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
                  <QueueOption key={queue._id} queue={queue} isOwner={this.props.isOwner} onSelected={this.handleNextCode.bind(this)}/>
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
        <h3>{this.props.store}</h3>
        { this.props.isOwner ?
          <div>
            <h4>You are the owner of the store</h4>
            {this.renderInputQueue()}
          </div>
          :''
        }
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
  currentUser: PropTypes.object,
  queues: PropTypes.array.isRequired,
  isOwner: PropTypes.bool,
  store: PropTypes.string.isRequired,
  myCodes: PropTypes.array.isRequired,
};

export default createContainer((props) => {

  Meteor.subscribe('queueList');
  Meteor.subscribe('storeList', true)

  return {
    currentUser: Meteor.user(),
    queues: Queues.find({store:props.store}).fetch(),
    isOwner: Stores.find({_id:props.store}).fetch().length > 0,
    store: props.store,
    myCodes: Session.get("myCodes"),
  };
}, Queue);
