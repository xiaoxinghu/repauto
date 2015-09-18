var Gallery = React.createClass({
  render: function() {
    var images = this.props.images.map(function(image) {
      console.log(image);
      return (
        <div className="col-md-4">
          <a href={image.url}>{image.title}</a>
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
