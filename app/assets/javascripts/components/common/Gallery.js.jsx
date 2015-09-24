var Gallery = React.createClass({
  render: function() {
    var images = this.props.images.map(function(image) {
      return (
        <div key={_.uniqueId('gallery')} className="col-md-4">
          <a href={image.url} className="thumbnail">
            <img src={image.url}></img>
            <div className="caption hideOverflow">
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
