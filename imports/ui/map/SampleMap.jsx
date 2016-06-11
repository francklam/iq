import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import shallowCompare from 'react-addons-shallow-compare';
import GoogleMap from 'google-map-react';

import SearchBox from './SearchBox.jsx';
import Marker from './Marker.jsx';
import Places from './Places.jsx';

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
      myLocation : this.props.center,
      mapObject: null,
      mapLoaded : false
    };

  }

  onPlacesSelected(places) {
    let onePlace = places[0]; //First place returned
    newLat = onePlace.geometry.location.lat();
    newLng = onePlace.geometry.location.lng();

    this.setState({
      myLocation: {lat: newLat, lng: newLng},
    });
  }

  onClick({x, y, lat, lng, event}) {
    // this.setState({
    //   myLocation: {lat: lat, lng: lng},
    // });
  }

  handleSaveLocation(event) {
    event.preventDefault();

    console.log(this.state.myLocation);
  }

  render() {
    return (
      <div className="map">
        <SearchBox onPlacesChanged={this.onPlacesSelected.bind(this)}/>
        <button className="ui button" onClick={this.handleSaveLocation.bind(this)}>Save location</button>
        <GoogleMap
           onGoogleApiLoaded={
             ({map, maps}) => this.setState({
               mapObject: map,
               mapLoaded: true
             })}
           center={this.state.myLocation}
           zoom={this.props.zoom}
           options={createMapOptions}
           onClick={this.onClick.bind(this)}
           yesIWantToUseGoogleMapApiInternals={true}
         >
         <Marker {...this.state.myLocation} />
        </GoogleMap>
        <Places location={this.state.myLocation} map={this.state.mapObject} mapLoaded={this.state.mapLoaded} />
      </div>
    );
  }
}

SampleMap.defaultProps = {
  center: {lat: 22.2856221, lng: 114.22052150000002},
  zoom: 18,
}
