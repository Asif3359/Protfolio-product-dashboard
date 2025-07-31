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
  isMultiple: boolean;
}

const ProjectImageSlider: React.FC<ProjectImageSliderProps> = ({ images, title, isMultiple }) => {


  return (
    <Box sx={{ mb: 3 }}>
      <Slider
        dots={images.length > 7 ? false : true}
        infinite={true}
        speed={500}
        slidesToShow={isMultiple ? images.length > 1 ? 2 : 1 : 1}
        slidesToScroll={isMultiple ? images.length > 1 ? 2 : 1 : 1}
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
              height: { xs: 200, sm: 350, md: 400 },
              objectFit: 'cover',
              background: '#f5f5f5',
              cursor: 'pointer',
              "&:hover": {
                transform: 'scale(1.05)',
                transition: 'transform 0.5s ease-in-out',
              },
            }}
          />
        ))}
      </Slider>
    </Box>
  );
};

export default ProjectImageSlider; 