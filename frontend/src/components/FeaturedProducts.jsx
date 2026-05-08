import React, { useEffect, useState } from "react";
import JohnProductItem from "./JohnProductItem";
import { Link } from "react-router-dom";
import { fetchFeaturedProducts } from "../services/product.service.js";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const products = await fetchFeaturedProducts();
        setFeaturedProducts(products.slice(0, 4));
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center self-stretch bg-[#FAFAFA] px-4 sm:px-6 md:px-8 py-10 sm:py-20">
        <div className="flex justify-center items-center rounded-xl bg-[rgba(230,211,172,0.45)] px-2 sm:px-3 py-1.5 sm:py-2">
          <p className="font-dm-sans text-[rgba(51,51,51,0.7)] text-xs sm:text-base font-normal leading-5 tracking-[-0.5px]">
            Featured Products
          </p>
        </div>
        <div className="py-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#E3494E] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) return null;

  return (
    <div className="flex flex-col justify-center items-center self-stretch bg-[#FAFAFA] px-4 sm:px-6 md:px-8 py-10 sm:py-20 ">
      <div className="flex justify-center items-center rounded-xl bg-[rgba(230,211,172,0.45)] px-2 sm:px-3 py-1.5 sm:py-2   ">
        <p className="font-dm-sans text-[rgba(51,51,51,0.7)] text-xs sm:text-base font-normal leading-5 tracking-[-0.5px]">
          Featured Products
        </p>
      </div>

      <div>
        <p className="flex text-[#2D2D2D] text-center font-clash-grotesk text-xl sm:text-4xl font-medium leading-12">
          Our Popular Products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto py-8 sm:py-17.5">
        {featuredProducts.map((item, index) => (
          <JohnProductItem
            key={index}
            id={item._id}
            image={item.images || item.image}
            name={item.productName || item.name}
            price={item.price}
            description={item.description}
            reviews={item.reviews}
          />
        ))}
      </div>

      <div>
        <Link
          to="/john-stores"
          className=" inline-flex px-6.5  sm:px-7.75 py-4    justify-center items-center rounded-[14px] border border-[rgba(227,73,78,0.25)] bg-[#E3494E] shadow-md"
        >
          <p className="font-clash-grotesk text-[#FFF] text-xs font-medium leading-6 text-center">
            View All Products
          </p>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;
