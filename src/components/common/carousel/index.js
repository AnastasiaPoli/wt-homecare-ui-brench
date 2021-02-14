import React, { Component } from "react";
import Slider from "react-slick";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  carousel_container: {
    width: "100%",
    // border: "2px solid",
    padding: "1rem 0",
  },
}));
export const Carousel = ({ children, className }) => {
  const classes = useStyles();

  const settings = {
    autoPlay: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };
  return (
    <div className={`${classes.carousel_container} ${className}`}>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};
