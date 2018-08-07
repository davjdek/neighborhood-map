import React, { Component } from "react";
import Loc from "./Loc";

class List extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      query: "",
      
    };

    this.filterPlaces = this.filterPlaces.bind(this);
  }

  //Filter Locations 
   


  componentWillMount() {
    this.setState({
      places: this.props.places
    });
  }

    filterPlaces(event) {
    this.props.infoClose();
    const { value } = event.target;
    var places = [];
    this.props.places.forEach(function(location) {
      if (location.completeName.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        places.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      places: places,
      query: value
    });
  }
  
  render() {
    var locationlist = this.state.places.map(function(listItem, index) {
      return (
        <Loc
          infoOpen={this.props.infoOpen.bind(this)}
          data={listItem}
        />
      );
    }, this);

    return (
      <div className="search-area">
        <input
          role="search"
          id="search-field"
          className="search-input"
          type="text"
          placeholder="Filter"
          value={this.state.query}
          onChange={this.filterPlaces}
        />
        <ul className="list">
          {locationlist}
        </ul>
      </div>
    );
  }
}

export default List;
