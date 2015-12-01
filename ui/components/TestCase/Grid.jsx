import React, {Component, PropTypes} from 'react';
import { Gallery } from '../../components';
import ClassNames from 'classnames';
import helper from '../../helper';
import { Tabs, Tab, Label } from 'react-bootstrap';
import _ from 'lodash';

export default class Grid extends Component {

  render() {
    const { data } = this.props;

    let grouped = {};
    data.forEach((d) => {
      _.sortBy(d.attachments, 'time').forEach((a, i) => {
        grouped[i] = grouped[i] || [];
        const tags = (d.tags || []).map((tag) => {
          return (
            <Label>{tag}</Label>
          );
        });
        grouped[i].push({
          url: a.url,
          type: a.type,
          title: a.title,
          caption: (<div>{tags}</div>)
        });
      });
    });
    const tabs = _.keys(grouped).map((k, i) => {
      const images = grouped[k];
      return (
        <Tab eventKey={i + 1} title={`image ${k}`}>
          <Gallery images={images}/>
        </Tab>
      );
    });
    var content = (
      <Tabs defaultActiveKey={1} position="right" tabWidth={3}>
        {tabs}
      </Tabs>
    );
    return (
      <div>
        {content}
      </div>
    );
  }
};
