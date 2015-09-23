var View = require('../../constants/TestCase').View;
var Store = require('../../stores/TestCaseStore');
var Detail = require('./Detail');

var MainView = React.createClass({
  getInitialState: function() {
    return {
      showing: Store.getShowing()
    };
  },
  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({showing: Store.getShowing()});
  },

  render: function() {
    var content = {};
    var data = this.state.showing;
    content = (<Detail id={data[0]} />);
    // if (!_.isArray(data)) {
    //   content = (
    //     <Detail data={data} />
    //   );
    // } else {
    //   content = (
    //     <div className='row'>
    //       <div className='col-md-6'>
    //         <Detail data={data[0]} compact={true} />
    //       </div>
    //       <div className='col-md-6'>
    //         <Detail data={data[1]} compact={true} />
    //       </div>
    //     </div>
    //   );
    // }

    // switch (this.state.view) {
    //   case View.DETAIL:
    //     var id = this.state.id;
    //     content = (
    //       <Detail data={Store.getDetail(id)} />
    //     );
    //     break;
    //   case View.DIFF:
    //     // content = (
    //     //   <div className='row'>
    //     //     <div className='col-md-6'>
    //     //       <Detail id={this.state.ids[0]} />
    //     //     </div>
    //     //     <div className='col-md-6'>
    //     //       <Detail id={this.state.ids[1]} />
    //     //     </div>
    //     //   </div>
    //     // );
    //     break;
    //   default:
    // };

    return (
      <div>
        {content}
      </div>
    );
  }
});

module.exports = MainView;
