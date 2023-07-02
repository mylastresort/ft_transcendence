import React, { useState } from 'react';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import Styles from './style.module.css';
import { Spacer, Text } from '@nextui-org/react';

export function ImageSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className={Styles.slider}>
      <FaArrowAltCircleLeft className={Styles.left_arrow} onClick={prevSlide} />
      <FaArrowAltCircleRight
        className={Styles.right_arrow}
        onClick={nextSlide}
      />
      {slides.map((slide, index) => {
        return (
          <div
            className={
              index === current
                ? `${Styles.slide} ${Styles.active}`
                : Styles.slide
            }
            key={index}
          >
            {index === current && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={slide.image}
                  alt="travel image"
                  className={Styles.image}
                />
                <Spacer y={1} />
                <Text
                  h2
                  css={{
                    fontSize: '1.2rem',
                    fontFamily: 'poppins',
                    fontWeight: '400',
                    color: '#fff',
                  }}
                >
                  {slide.title}
                </Text>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
