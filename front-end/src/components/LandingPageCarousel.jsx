import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

import carouselImage1 from '../resources/assets/Images/togather-image-2.webp'
import carouselImage2 from '../resources/assets/Images/togather-image-4.jpg'
import carouselImage3 from '../resources/assets/Images/togather-image-18.jpg'
import carouselImage4 from '../resources/assets/Images/togather-image-21.jpg'
import carouselImage5 from '../resources/assets/Images/togather-image-24.jpeg'

function DarkVariantExample() {
  return (
    <div className="container-carousel-landing"> 
       <Carousel data-bs-theme="dark" fade>
      <Carousel.Item interval={1500}>
        <img
          className="d-block w-100 carousel-img"
          src={carouselImage1}
          alt="First slide"
        />
       
      </Carousel.Item>
      <Carousel.Item interval={1500}>
        <img
          className="d-block w-100"
          src={carouselImage2}
          alt="Second slide"
        />
       
      </Carousel.Item>
      <Carousel.Item interval={1500}>
        <img
          className="d-block w-100"
          src={carouselImage3}
          alt="Third slide"
        />
      
      </Carousel.Item>
      <Carousel.Item interval={1500}>
        <img
          className="d-block w-100"
          src={carouselImage4}
          alt="Second slide"
        />
       
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          className="d-block w-100"
          src={carouselImage5}
          alt="Second slide"
        />
       
      </Carousel.Item>
    </Carousel>
    </div>
  );
}

export default DarkVariantExample;