import React, { Component } from 'react';
import { DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';


export default class LinkWidget extends Component {
  constructor(props) {
    super(props);
    this.refPaths = [];
  }

  componentDidUpdate() {
    this.updateRenderedPaths();
  }

  componentDidMount() {
    this.updateRenderedPaths();
  }

  componentWillUnmount() {
    this.clearRenderedPaths();
  }

  updateRenderedPaths() {
    const { link } = this.props;

    link.setRenderedPaths(
      this.refPaths.map(ref => {
        return ref.current;
      }),
    );
  }

  clearRenderedPaths() {
    const { link } = this.props;
    link.setRenderedPaths([]);
  }

  generatePathPoints() {
    const { link } = this.props;

    const points = link.getPoints();

    return points
      .map((point, i) => ({ from: points[i], to: points[i + 1] }))
      .filter(tuple => tuple.to);
  }

  generateLinePath({ from, to }) {
    return `M${from.getX()},${from.getY()} L ${to.getX()},${to.getY()}`;
  }

  renderSegment(path, index) {
    const { diagramEngine, link, factory, options = {} } = this.props;

    const { selected } = options;

    const ref = React.createRef();
    this.refPaths.push(ref);

    return (
    <DefaultLinkSegmentWidget
        key={`link-${index}`}
        path={path}
        selected={selected}
        diagramEngine={diagramEngine}
        factory={factory}
        link={link}
        forwardRef={ref}
        onSelection={() => {}}
      />
    );
  }

 render() {
    this.refPaths = [];

    return (
        <g>
          {this.generatePathPoints().map((tuple, index) =>
            this.renderSegment(this.generateLinePath(tuple), index),
          )}
        </g>
    );
  }
}
