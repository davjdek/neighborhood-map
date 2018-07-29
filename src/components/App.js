import React, { Component } from "react";
import List from "./List";

class App extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
		places: [
		  {
			"name": "Stadio Dall'Ara",
			"type": "Football Stadium",
			"latitude": 44.492322, 
			"longitude": 11.309896
		  },
		  {
			"name": "Arco del Meloncello",
			"type": "Place",
			"latitude": 44.490322,
			"longitude": 11.311012
		  },
		  {
			"name": "Teatro delle Celebrazioni",
			"type": "Theater",
			"latitude": 44.489687, 
			"longitude": 11.312525
		  },
		  {
			"name": "Villa delle Rose",
			"type": "Museum",
			"latitude": 44.489550,
			"longitude": 11.313984
		  },
		  {
			"name": "Villa Spada",
			"type": "Park",
			"latitude": 44.489000, 
			"longitude": 11.315239
		  },
		  {
			"name": "Scuola XXI Aprile",
			"type": "Primary School",
			"latitude": 44.492030,
			"longitude": 11.315261
		  }
		],

      info: "",
      
    };

    // bind "this" keyword to the component object inside the functions
    this.initMap = this.initMap.bind(this);
    this.infoOpen = this.infoOpen.bind(this);
    this.infoClose = this.infoClose.bind(this);
  }

  initMap() {
    var self = this;

    var mapElem = document.getElementById("map");
    mapElem.style.height = window.innerHeight + "px";
    var map = new window.google.maps.Map(mapElem, {
      center: { lat: 44.490900, lng: 11.313748 },
      zoom: 17,
      mapTypeControl: false
    });

    var InfoWindow = new window.google.maps.InfoWindow({});

    this.setState({
      info: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      map.getCenter();
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.infoClose();
    });

    var places = [];
    this.state.places.forEach(function(location) {
      var completeName = location.name + " - " + location.type;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        
        map: map,
		title: completeName
      });

      marker.addListener("click", function() {
        self.infoOpen(marker);
      });

      location.completeName = completeName;
      location.marker = marker;
      location.display = true;
      places.push(location);
    });
    this.setState({
      places: places
    });
  }
  
  componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    mapLoad(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEY3TVnw7DKAr4ERLbfzGbBdYF7vKTXSo&callback=initMap"
    );
  }

  
  

  
  infoOpen(marker) {
    this.infoClose();
    this.state.info.open(this.state.map, marker);
    this.state.info.setContent("Loading Data...");
    this.getMarkerInfo(marker);
  }

  
   // Get location data
  
  getMarkerInfo(marker) {
    var self = this;


    // load Foursquare infos
    var url =
      "https://api.foursquare.com/v2/venues/search?client_id=Q5MK2XFDK3FVTDQLOQKSFTKS1CI1XEWZSO2TIPP5DU2PWICK&client_secret=MQ3CZLR5KY1F04FUAX5YWXOLYRRJSYFWCHZANZZ23M4WI05L" +
      "&v=20130815&ll=" +
      marker.getPosition().lat() +
      "," +
      marker.getPosition().lng() +
      "&limit=1";
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          self.state.info.setContent("Sorry data can't be loaded");
          return;
        }

        // Get the text in the response
        response.json().then(function(data) {
        

          var location_data = data.response.venues[0];
          var place = `<h3>${marker.title}</h3>`;
		  console.dir(marker)
          var street = `<p>${location_data.location.formattedAddress[0]}</p>`;
          
          self.state.info.setContent(
            place + street
          );
        });
      })
      .catch(function(err) {
        self.state.info.setContent("Sorry data can't be loaded");
      });
  }

  
  infoClose() {
    
    this.state.info.close();
  }

  /**
   * Render for react
   */
  render() {
    return (
      <div>
        <List
          places={this.state.places}
          infoOpen={this.infoOpen}
          infoClose={this.infoClose}
        />
        <div id="map" />
      </div>
    );
  }
}

export default App;


function mapLoad(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}
