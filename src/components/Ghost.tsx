import React, { useState, useEffect, useRef } from "react";

import classNames from "classnames";
import debounce from "lodash.debounce";

import styles from "./Ghost.module.scss";

const getLives = (life: number) =>
  [...Array(life)].map((e, i) => <span className={styles.heart} key={i} />);

const Ghost = () => {
  const [life, setLife] = useState(3);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const ghost = useRef<HTMLElement | null>(null);

  const handleMouseOver = () => setLife(life - 1);

  useEffect(() => {
    if (window.ontouchstart) {
      return;
    }
    const ghostMove = (e: MouseEvent) =>
      setMousePosition({ x: e.screenX, y: e.screenY });
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
        <section className={styles.life}>{getLives(life)}</section>
      ) : (
        <p className={styles.lifeLabel}>-Game Over-</p>
      )}
      <figure
        ref={ghost}
        className={classNames(
          styles.ghost,
          isGhostFlipped && styles.ghostFlipped
        )}
        style={{ left: `${x - 100}px`, top: `${y - 200}px` }}
        onMouseOver={life > 0 ? handleMouseOver : undefined}
        onFocus={life > 0 ? handleMouseOver : undefined}
      />
    </>
  );
};

export default Ghost;
