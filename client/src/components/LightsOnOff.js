import React, { Component } from 'react';
import Button from '@material-ui/core/Button';


class LightsOnOff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stringsOn: false,
      grillOn: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (e.currentTarget.name === 'strings') {
      this.setState({
        stringsOn: true,
        grillOn: false
      });

    } else if (e.currentTarget.name === 'grill') {
      this.setState({
        stringsOn: false,
        grillOn: true
      });

    } else if (e.currentTarget.name === 'bothOn' ) {
      this.setState({
        stringsOn: true,
        grillOn: true
      });

    } else if (e.currentTarget.name === 'bothOff') {
      this.setState({
        stringsOn: false,
        grillOn: false
      });

    } else {
      console.log('Unexpected event...', e)
      // TODO show error
    }
  }

  render() { 
    console.log('current state: ', this.state);
    return (
      <div>
        <h2>Lights On/Off</h2>
        <br />
        <Button
          name="strings"
          variant="contained"
          color={this.state.stringsOn && !this.state.grillOn ? 'primary' : 'default'}
          onClick={this.handleClick}
        >
          Strings Only
        </Button>
        <Button
          name="grill"
          variant="contained"
          color={!this.state.stringsOn && this.state.grillOn ? 'primary' : 'default'}
          onClick={this.handleClick}
        >
          Grill Only
        </Button>
        <Button
          name="bothOn"
          variant="contained"
          color={this.state.stringsOn && this.state.grillOn ? 'primary' : 'default'}
          onClick={this.handleClick}
        >
          Both On
        </Button>
        <Button
          name="bothOff"
          variant="contained"
          color={!this.state.stringsOn && !this.state.grillOn ? 'primary' : 'default'}
          onClick={this.handleClick}
        >
          Both Off
        </Button>
      </div>
    )
  }
}

export default LightsOnOff; 
