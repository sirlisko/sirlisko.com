import { useState, useEffect } from "react";

import styles from "./Greeting.module.scss";

interface GreetingProps {
  descriptions: string[];
}

const Greeting = ({ descriptions }: GreetingProps) => {
  const [selectedDescription, setSelectedDescription] = useState(
    descriptions[0],
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
      <img
        className={styles.face}
        src="./images/sirlisko.svg"
        alt="sirlisko face"
      />
      <div className={styles.intro}>
        <p>Ciao!</p>
        <p>I&#39;m sirLisko,</p>
        <p>another f@$#&amp;n&#39;</p>
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
