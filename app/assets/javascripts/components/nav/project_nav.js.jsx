var ProjectNav = React.createClass({

  render: function() {
    console.log(this.props.links);
    var links = this.props.links.map(function (link) {
      return (
        <li><a href={link}></a></li>
      )
    });
    return (
      <div></div>
    );
  }
});
