import React, {Component, PropTypes} from 'react';
export default class SearchBar extends Component {
  _handleChange(e) {
    this.props.onUserInput(
      this.refs.filterTextInput.value
    );
  }

  render() {
    return (
      <form>
        <div className="input-group">
          <div className="input-group-addon"><i className="fa fa-search"></i></div>
          <input type="text" className="form-control" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={(e) => this._handleChange(e)} />
        </div>
      </form>
    );
  }
}
