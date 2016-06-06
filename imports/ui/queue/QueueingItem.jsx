import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import '../../api/notifications.js';

export default class QueueingItem extends Component {

  renderAlertMessage() {
    let howManyLeft = this.props.code.number - this.props.queue.current;
    let alertMessage = "";

    switch (howManyLeft) {
      case 0 : alertMessage = "My turn";
        if (!Session.equals('token','')) {
          Meteor.call('notification.token',this.props.code.queue,'it s my turn!', Session.get('token'));
        }
        break;
      case 1 : alertMessage = "Coming soon"; break;
      case 2 : alertMessage = "Coming"; break;
      default : break;
    }
    return (
      <span>
        { alertMessage != "" ? <a className="ui red right pointing basic label">{alertMessage}</a> : ''}
      </span>
    )

  }

  render() {
    return (
      <tr>
        <td>{this.props.code.queue}</td>
        <td>{this.props.code.letter} </td>
        <td>
          {this.props.code.number}
        </td>
        <td>
          {typeof this.props.queue != "undefined" ?
            <div>
              {this.renderAlertMessage()}
              {this.props.queue.current}
            </div>
          : ''}
        </td>
      </tr>
    )
  }
}
