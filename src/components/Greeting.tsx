import React, { useState, useEffect } from "react";
import Image from "next/image";

import { Me } from "../types";

import styles from "./Greeting.module.scss";

interface GreetingProps {
  descriptions: Me["descriptions"];
}

const Greeting = ({ descriptions }: GreetingProps) => {
  const [selectedDescription, setSelectedDescription] = useState(
    descriptions[0]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPosition = Math.floor(Math.random() * descriptions.length);
      setSelectedDescription(descriptions[randomPosition]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <Image
        className={styles.face}
        src="./images/sirlisko.svg"
        alt="sirlisko face"
        height={714}
        width={496}
        priority
      />
      <div className={styles.intro}>
        <p>Ciao!</p>
        <p>I’m sirLisko,</p>
        <p>another f@$#&amp;n’</p>
        <p className={styles.desc}>
          {descriptions.map((d) => (
            <span
              key={d}
              className={
                d === selectedDescription ? styles.descActive : undefined
              }
            >
              {d}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default Greeting;
