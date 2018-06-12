import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const style = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  listWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    position: 'absolute',
    boxSizing: 'border-box',
    border: '1px solid #eee'
  },
  list: height => ({
    height: height,
    position: 'relative'
  }),
  item: (index, height) => ({
    height,
    left: 0,
    right: 0,
    top: height * index,
    position: 'absolute'
  })
};

export default class List extends React.Component {

  constructor() {
    super();

    this.state = {
      scrollTop: 0,
      visibleHeight: 0
    };
  }

  componentDidMount() {
    this.getWrapper().addEventListener(
      'scroll',
      e => {
        this.setScrollPosition(e);
      },
      true
    );

    const visibleHeight = parseFloat(
      window
        .getComputedStyle(this.getWrapper(), null)
        .getPropertyValue('height')
    );

    this.setState({ visibleHeight });
  }

  getCount = () => this.props.source.length;

  getScrollPosition = () => this.state.scrollTop;

  getVisibleHeight = () => this.state.visibleHeight;

  getHeight = () => this.getCount() * this.props.rowHeight;

  getWrapper = () => ReactDOM.findDOMNode(this.listWrapper);

  setScrollPosition = event => {
    this.setState({
      scrollTop: event.target.scrollTop
    });
  };

  checkIfVisible = index => {
    const elemPosition = index * this.props.rowHeight;

    return (
      elemPosition > this.getScrollPosition() - this.props.overScanCount * this.props.rowHeight &&
      elemPosition + this.props.rowHeight <
        this.getScrollPosition() +
          this.state.visibleHeight +
          this.props.overScanCount * this.props.rowHeight
    );
  };

  renderList = () => (
    <div style={style.container} ref={c => (this.container = c)}>
      <div style={style.listWrapper} ref={c => (this.listWrapper = c)}>
        <div style={style.list(this.getHeight())} ref={c => (this.list = c)}>
          {this.props.source.map(
            (value, index) =>
              this.checkIfVisible(index) &&
              this.props.renderItem({
                index: index,
                style: style.item(index, this.props.rowHeight)
              })
          )}
        </div>
      </div>
    </div>
  );

  render = () => this.renderList();
}

List.defaultProps = {
  source: [],
  rowHeight: 24,
  overScanCount: 5,
};

List.propTypes = {
  renderItem: PropTypes.func,
  rowHeight: PropTypes.number,
  source: PropTypes.array.isRequired,
  overScanCount: PropTypes.number.isRequired,
};
