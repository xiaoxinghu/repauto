import React, {Component, PropTypes} from 'react';
import { RadioSet } from '../../components';
import Carousel from 'nuka-carousel';
import _ from 'lodash';

const VIEW = {
  GRID: 'GRID',
  SLIDER: 'SLIDER',
  TEXT: 'TEXT'
};

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEW.GRID
    };
  }

  _buildGrid(data) {
    var images = data.filter(d => d.type == 'screenshot').map(function(image) {
      var style = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      };
      return (
        <div key={_.uniqueId('gallery')} className="col-md-4">
          <a href="#" className="thumbnail">
            <img src={image.url}></img>
            <div className="caption" style={style}>
              {image.caption}
            </div>
          </a>
        </div>
      );
    });
    return (
      <div className="row">
        {images}
      </div>
    );
  }

  _buildSlider(data) {
    var images = data.filter(d => d.type == 'screenshot').map(function(image) {
      return (
        <img src={image.url}></img>
      );
    });
    return (
      <Carousel width="80%">
        {images}
      </Carousel>
    );
  }

  _buildTextView(data) {

    var content = data.filter(d => d.type == 'log').map(text => {
      console.info('text', text);
      const style = {
        width: "100%",
        height: "600px"
      };
      return (
        <div>
          <h4>{text.title}</h4>
          <iframe style={style} src={text.url}></iframe>
        </div>
      );
    });
    return (
      <div>
        {content}
      </div>
    );
  }

  render() {
    const radios = [
      {label: ('grid'), value: VIEW.GRID},
      {label: ('slider'), value: VIEW.SLIDER},
      {label: ('log'), value: VIEW.TEXT}
    ];
    let content;
    if (this.state.view == VIEW.GRID) {
      content = this._buildGrid(this.props.images);
    } else if (this.state.view == VIEW.SLIDER) {
      content = this._buildSlider(this.props.images);
    } else if (this.state.view == VIEW.TEXT) {
      content = this._buildTextView(this.props.images);
    }
    return (
      <div>
        <RadioSet group="view"
          onChange={view => this.setState({view: view})}
          radios={radios}
          selected={this.state.view} />
        {content}
      </div>
    );
  }
};
