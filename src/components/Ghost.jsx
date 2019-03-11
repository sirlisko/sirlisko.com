import React, { Component } from "react";

import classNames from "classnames";
import debounce from "lodash.debounce";

import "./Ghost.scss";

class Ghost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      life: 3,
      mousePosition: { x: -100, y: -100 }
    };
    this.ghost = React.createRef();
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.ghostMove = this.ghostMove.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.handleMouseMove());
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.handleMouseMove());
  }

  handleMouseMove() {
    return debounce(this.ghostMove, 100);
  }

  handleMouseOver() {
    this.setState({ life: this.state.life - 1 });
  }

  ghostMove(e) {
    this.setState({ mousePosition: { x: e.screenX, y: e.screenY } });
  }

  render() {
    const {
      life,
      mousePosition: { x, y }
    } = this.state;
    const isGhostFlipped =
      this.ghost.current &&
      x <
        this.ghost.current.getBoundingClientRect().left +
          document.body.scrollLeft;
    const isGameOver = life === 0;
    const lives = Array.apply(null, { length: life }).map((e, i) => (
      <span className="life__heart" key={i} />
    ));
    return (
      <>
        {!isGameOver ? (
          <section className="life">{lives}</section>
        ) : (
          <p className="life__label">-Game Over-</p>
        )}
        <figure
          ref={this.ghost}
          className={classNames("ghost", isGhostFlipped && "ghost--flipped")}
          style={{ left: `${x - 55}px`, top: `${y - 55}px` }}
          onMouseOver={this.handleMouseOver}
        />
      </>
    );
  }
}

export default Ghost;
