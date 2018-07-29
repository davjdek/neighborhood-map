import React from "react";

class Loc extends React.Component {
  
  render() {
    return (
      <li
        role="button"
        className="loc"
        tabIndex="0"
        onKeyPress={this.props.infoOpen.bind(
          this,
          this.props.data.marker
        )}
        onClick={this.props.infoOpen.bind(this, this.props.data.marker)}
      >
        {this.props.data.completeName}
      </li>
    );
  }
}

export default Loc;
