import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class SearchBox extends Component {

  onPlacesSelected() {
    this.searchBox.getPlaces().forEach((places) => {
      console.log(places.geometry.location);
    });
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }

  componentDidMount() {
    let input = ReactDOM.findDOMNode(this.refs.input);
    this.searchBox = new google.maps.places.SearchBox(input);
    this.listener = this.searchBox.addListener('places_changed', this.onPlacesSelected.bind(this));
  }

  componentWillUnmount() {
    google.maps.event.removeListener(this.listener);
    // this.searchBox.removeListener('places_changed', this.onPlacesSelected.bind(this));
  }

  render() {
    return <input id="pac-input" ref="input" {...this.props} type="text"/>;
  }
}

SearchBox.propTypes = {
  placeholder: React.PropTypes.string,
  onPlacesChanged: React.PropTypes.func
}
