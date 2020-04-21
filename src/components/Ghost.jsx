import React, { useState, useEffect, useRef } from "react";

import classNames from "classnames";
import debounce from "lodash.debounce";

import "./Ghost.scss";

const getLives = (life) =>
  Array.apply(null, { length: life }).map((e, i) => (
    <span className="life__heart" key={i} />
  ));

const Ghost = () => {
  const [life, setLife] = useState(3);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const ghost = useRef(null);

  const handleMouseOver = () => setLife(life - 1);

  useEffect(() => {
    const ghostMove = (e) => setMousePosition({ x: e.screenX, y: e.screenY });
    const handleMouseMove = () => debounce(ghostMove, 100);
    document.addEventListener("mousemove", handleMouseMove());
    return () => document.removeEventListener("mousemove", handleMouseMove());
  }, []);

  const { x, y } = mousePosition;
  const isGhostFlipped =
    ghost.current &&
    x < ghost.current.getBoundingClientRect().left + document.body.scrollLeft;
  return (
    <>
      {!(life === 0) ? (
        <section className="life">{getLives(life)}</section>
      ) : (
        <p className="life__label">-Game Over-</p>
      )}
      <figure
        ref={ghost}
        className={classNames("ghost", isGhostFlipped && "ghost--flipped")}
        style={{ left: `${x - 55}px`, top: `${y - 55}px` }}
        onMouseOver={handleMouseOver}
        onFocus={handleMouseOver}
      />
    </>
  );
};

export default Ghost;
