import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import shallowCompare from 'react-addons-shallow-compare';
import GoogleMap from 'google-map-react';

export default class Places extends Component {

  constructor(props) {
    super(props);
  }

  createMarker(place) {
    let icon = {
        url: place.icon,
        size: new google.maps.Size(15, 15),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 30),
        scaledSize: new google.maps.Size(15, 15)
      };
    let placeLoc = place.geometry.location;
    let marker = new google.maps.Marker({
      icon: icon,
      title: place.name,
      map: this.props.map,
      position: place.geometry.location
    });
  }

  handleResults (results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }
  }

  renderPlaces() {
    let whereSearch = new google.maps.LatLng(this.props.location.lat,this.props.location.lng);
    let request = {
      location: whereSearch,
      radius: '500',
      type: 'store'
    };

    this.service = new google.maps.places.PlacesService(this.props.map);
    this.service.nearbySearch(request, this.handleResults.bind(this));
  }

  render() {
    return(
      <div>
        { this.props.mapLoaded ? this.renderPlaces() : '' }
      </div>
    )
  }
}

Places.defaultProps = {
  location: {lat: 22.2856221, lng: 114.22052150000002},
}
