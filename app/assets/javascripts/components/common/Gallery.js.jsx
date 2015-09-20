var Gallery = React.createClass({
  render: function() {
    var images = this.props.images.map(function(image) {
      console.log(image);
      return (
        <div className="col-md-4">
          <a href={image.url} className="thumbnail">
            <img src={image.url}></img>
            <div className="caption">
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
