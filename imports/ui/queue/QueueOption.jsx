import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import '../../api/queues.js';

export default class QueueOption extends Component {

  handleNextCode(event) {
    event.preventDefault();

    // let next = ReactDOM.findDOMNode(this.refs.next).value.trim();
    this.props.onSelected(this.props.queue);

    // Meteor.call('queues.nextCode',this.props.queue._id);

  }

  handleMinusCurrent(event) {
    event.preventDefault();

    Meteor.call('queues.currentMinus',this.props.queue._id);
  }

  handlePlusCurrent(event) {
    event.preventDefault();

    Meteor.call('queues.currentPlus',this.props.queue._id);
  }

  render() {
    let queue = this.props.queue;
    return (
      <tr>
        <td>{queue.description}</td>
        <td>{queue.letter}</td>
        <td>
          {this.props.isOwner ? <button className="ui small basic red button" type="text" onClick={this.handleMinusCurrent.bind(this)}>-</button>:''}
          {queue.current}
          {this.props.isOwner ? <button className="ui small basic green button" type="text" onClick={this.handlePlusCurrent.bind(this)}>+</button>:''}
        </td>
        <td><input className="ui small button" type="button" ref="next" value={queue.next} onClick={this.handleNextCode.bind(this)}/></td>
      </tr>
    )
  }
}

QueueOption.propTypes = {
  queue: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
};
