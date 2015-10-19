var React = require('react');
var _ = require('lodash');

var Gallery = React.createClass({
  render: function() {
    var images = this.props.images.map(function(image) {
    var style = {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
      return (
        <div key={_.uniqueId('gallery')} className="col-md-4">
          <a href={image.url} className="thumbnail">
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
});

module.exports = Gallery;
