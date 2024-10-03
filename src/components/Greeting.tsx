import { useState, useEffect } from "react";

import styles from "./Greeting.module.scss";

interface GreetingProps {
  descriptions: string[];
}

const Greeting = ({ descriptions }: GreetingProps) => {
  const [selectedDescription, setSelectedDescription] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 200;
  const deletingSpeed = 10;
  const pauseTime = 2000;

  useEffect(() => {
    let typingInterval: ReturnType<typeof setTimeout>;

    if (!isDeleting && currentDescription.length < selectedDescription.length) {
      typingInterval = setTimeout(() => {
        setCurrentDescription(
          selectedDescription.slice(0, currentDescription.length + 1),
        );
      }, typingSpeed);
    } else if (isDeleting && currentDescription.length > 0) {
      typingInterval = setTimeout(() => {
        setCurrentDescription(
          selectedDescription.slice(0, currentDescription.length - 1),
        );
      }, deletingSpeed);
    } else if (
      !isDeleting &&
      currentDescription.length === selectedDescription.length
    ) {
      typingInterval = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && currentDescription.length === 0) {
      setIsDeleting(false);
      const nextIndex = Math.floor(Math.random() * descriptions.length);
      setSelectedDescription(descriptions[nextIndex]!);
    }

    return () => clearTimeout(typingInterval);
  }, [currentDescription, isDeleting, selectedDescription, descriptions]);

  useEffect(() => {
    setSelectedDescription(descriptions[0]!);
  }, [descriptions]);

  return (
    <div className={styles.container}>
      <div>
        <img
          className={styles.face}
          src="./images/sirlisko.svg"
          alt="sirlisko face"
        />
      </div>
      <div className={styles.intro}>
        <div>
          <h1>
            Ciao!
            <br />
            I&#39;m sirlisko,
          </h1>
          <p>another f@$#&amp;n&#39;</p>
          <p className={styles.desc}>
            <span>{currentDescription}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
