import { useState, useEffect } from "react";

interface GreetingProps {
  descriptions: string[];
}

const Greeting = ({ descriptions }: GreetingProps) => {
  const [selectedDescription, setSelectedDescription] = useState("");
  const [currentDescription, setCurrentDescription] = useState("developer");
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
      setSelectedDescription(descriptions[nextIndex] as string);
    }

    return () => clearTimeout(typingInterval);
  }, [currentDescription, isDeleting, selectedDescription, descriptions]);

  useEffect(() => {
    setSelectedDescription(descriptions[0] as string);
  }, [descriptions]);

  return currentDescription;
};

export default Greeting;
