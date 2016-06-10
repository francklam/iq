import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import shallowCompare from 'react-addons-shallow-compare';
import GoogleMap from 'google-map-react';

import SearchBox from './SearchBox.jsx';

function createMapOptions(maps) {
  // next props are exposed at maps
  // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
  // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
  // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
  // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
  // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
  return {
    zoomControlOptions: {
      position: maps.ControlPosition.RIGHT_CENTER,
      style: maps.ZoomControlStyle.SMALL
    },
    mapTypeControlOptions: {
      position: maps.ControlPosition.TOP_RIGHT
    },
    mapTypeControl: true
  };
}

export default class SampleMap extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  constructor(props) {
    super(props);

    this.state = {
      myLocation : this.props.center
    };
  }

  onPlacesChanged(places) {
    let onePlace = places[0]; //First place returned
    newLat = onePlace.geometry.location.lat();
    newLng = onePlace.geometry.location.lng();

    this.setState({
      myLocation: {lat: newLat, lng: newLng},
    });
  }

  render() {
    return (
      <div className="map">
        <SearchBox onPlacesChanged={this.onPlacesChanged.bind(this)}/>
        <GoogleMap
         defaultCenter={this.props.center}
         defaultZoom={this.props.zoom}
         options={createMapOptions}>
         <div {...this.state.myLocation}><i className="setting big icon"></i></div>
        </GoogleMap>
      </div>
    );
  }
}

SampleMap.defaultProps = {
  center: {lat: 22.2856221, lng: 114.22052150000002},
  zoom: 18,
}
