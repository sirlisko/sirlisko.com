import React from "react";
import PropTypes from "prop-types";

import "./Greeting.scss";

class Greeting extends React.Component {
  constructor(props) {
    super(props);
    const { descriptions } = this.props;
    this.state = {
      selected: descriptions && descriptions[0]
    };
  }

  componentDidMount() {
    const { descriptions } = this.props;
    this.interval = setInterval(() => {
      const randomPosition = Math.floor(Math.random() * descriptions.length);
      this.setState({ selected: descriptions[randomPosition] });
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { selected } = this.state;
    const { descriptions } = this.props;
    return (
      <div className="greeting__intro">
        <p>Ciao!</p>
        <p>I'm sirLisko,</p>
        <p>another f@$#&amp;n'</p>
        <p className="greeting__intro__desc">
          {descriptions.map(d => (
            <span
              key={d}
              className={d === selected ? "greeting__intro--active" : ""}
            >
              {d}
            </span>
          ))}
        </p>
      </div>
    );
  }
}

export default Greeting;
