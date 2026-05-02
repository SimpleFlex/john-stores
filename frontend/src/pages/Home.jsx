import React from "react";
import HeroCarousel from "../components/HeroCarousel";
import About from "../components/About";
import Services from "../components/Services";
import FeaturedProducts from "../components/FeaturedProducts";
import Choose from "../components/Choose";
import Test from "../components/Test";
import Faqs from "../components/Faqs";
import Reliable from "../components/Reliable";

const Home = () => {
  return (
    <div>
      <HeroCarousel />
      <About />
      <Services />
      <FeaturedProducts />
      <Choose />
      <Test />
      <Faqs />
      <Reliable />
    </div>
  );
};

export default Home;
