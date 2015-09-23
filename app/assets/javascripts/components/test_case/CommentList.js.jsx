var CommentList = React.createClass({
  render: function() {
    // var comments = this.props.data.map(function(d) {
    // });
    return (
      <div>
        <ul className="media-list">
        </ul>
        <form className="form-horizontal">
          <div className="form-group">
            <input type="text" class="form-control" id="id" placeholder="id" />
          </div>
          <div className="form-group">
            <textarea class="form-control" id="comment" placeholder="comment" row="3" />
          </div>
          <div className="form-group">
            <label class="checkbox-inline">
              <input type="radio" id="inlineCheckbox1" value="passed">passed</input>
              </label>
            <label class="checkbox-inline">
              <input type="radio" id="inlineCheckbox1" value="passed">passed</input>
              </label>
          </div>
          <button type='submit' className="btn btn-default">Submit</button>
        </form>
      </div>
    );
  }
});

module.exports = CommentList;
