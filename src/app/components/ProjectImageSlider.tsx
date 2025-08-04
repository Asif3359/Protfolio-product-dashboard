"use client"
import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageModal from "@/app/components/ImageModal";
// import { tr } from "date-fns/locale";

interface ProjectImageSliderProps {
  images: string[];
  title: string;
  isMultiple: boolean;
}

const ProjectImageSlider: React.FC<ProjectImageSliderProps> = ({ images, title, isMultiple }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sliderRef = useRef<any>(null);

  const goToPrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <Box sx={{ mb: 3, position: 'relative' }}>
      <Slider
        ref={sliderRef}
        dots={images.length > 7 ? false : true}
        infinite={true}
        speed={500}
        slidesToShow={isMultiple ? 1 : 1}
        slidesToScroll={1}
        arrows={false}
        autoplay={true}
        autoplaySpeed={2500}
      >
        {images.map((img, idx) => (
          <CardMedia
            onClick={() => {
              setImageModalOpen(true);
            }}
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
                transform: 'scale(1.01)',
                transition: 'transform 0.5s ease-in-out',
              },
            }}
          />
        ))}
      </Slider>
      
      {/* Custom Arrow Navigation */}
      <IconButton
        onClick={goToPrevious}
        sx={{
          position: 'absolute',
          left: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: '#333',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          zIndex: 1,
        }}
        aria-label="Previous image"
      >
        <ChevronLeftIcon />
      </IconButton>
      
      <IconButton
        onClick={goToNext}
        sx={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: '#333',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          zIndex: 1,
        }}
        aria-label="Next image"
      >
        <ChevronRightIcon />
      </IconButton>
      
      <ImageModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={images[0]}
        imageAlt={`${title} image ${0 + 1}`}
      />
    </Box>
  );
};

export default ProjectImageSlider; 