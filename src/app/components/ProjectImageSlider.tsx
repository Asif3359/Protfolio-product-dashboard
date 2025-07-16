"use client"
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
// import { tr } from "date-fns/locale";

interface ProjectImageSliderProps {
  images: string[];
  title: string;
}

const ProjectImageSlider: React.FC<ProjectImageSliderProps> = ({ images, title }) => {


  return (
    <Box sx={{ mb: 3 }}>
      <Slider
        dots={images.length > 7 ? false : true}
        infinite={images.length > 1 ? true : false}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        arrows={true}
      >
        {images.map((img, idx) => (
          <CardMedia
            key={idx}
            component="img"
            image={img}
            alt={`${title} image ${idx + 1}`}
            sx={{
              width: '100%',
              height: { xs: 200, sm: 350 },
              objectFit: 'cover',
              borderRadius: 2,
              background: '#f5f5f5',
            }}
          />
        ))}
      </Slider>
    </Box>
  );
};

export default ProjectImageSlider; 