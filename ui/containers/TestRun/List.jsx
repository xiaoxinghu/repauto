import React, {Component, PropTypes} from 'react';

export default class List extends Component {
  render() {
    return (
      <div>
        <div className="row toolbar">
          <div className="col-md-3">
            <Toolbar params={this.props.params} types={this.props.types} diff={this.props.diff_url} />
          </div>
          <div className="col-md-9">
            <Info />
          </div>
        </div>
        <List url={this.props.url} params={this.props.params} />
      </div>
    );
  }
}
