import { assets } from "../assets/assets";

const CartHero = () => {
  return (
    <div className="w-full">
      {" "}
      {/* ← no py padding, no extra bg wrapper */}
      <div className="relative w-full">
        <img
          src={assets.cartfam}
          alt=""
          className="w-full h-50 sm:h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default CartHero;
