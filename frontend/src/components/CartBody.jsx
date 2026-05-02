// CartBody.jsx — remove the duplicate hero image entirely
const CartBody = () => {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 bg-[#FAFAFA]">
      <div className="flex flex-col items-start gap-2.5">
        <p className="text-[#2D2D2D] font-clash-grotesk text-[48px] font-medium leading-[48px]">
          Your Cart
        </p>
        <p className="text-[#4A5565] font-dm-sans text-[16px] font-normal leading-6">
          Review your items before confirming your order on WhatsApp
        </p>
      </div>
    </div>
  );
};

export default CartBody;
