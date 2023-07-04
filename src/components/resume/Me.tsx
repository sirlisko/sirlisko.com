import React from "react";
import Image from "next/image";
import Link from "next/link";

const Education = () => (
  <section className="me">
    <div className="me__face">
      <Link href="/">
        <Image
          src="https://sirlisko.com/images/sirlisko.svg"
          alt="sirlisko face"
          height={184}
          width={128}
        />
      </Link>
    </div>
    <p className="me__intro">
      <span>Luca Lischetti</span>
      <span>a.k.a. sirLisko</span>
      <span>Senior Software Engineer</span>
    </p>
  </section>
);

export default Education;
