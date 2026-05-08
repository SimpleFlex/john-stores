import { useState } from "react";

const buildWhatsAppMessage = (
  orderData,
  customerName,
  customerPhone,
  recipientName,
  recipientPhone,
) => {
  const itemLines = orderData.items
    ?.map(
      (item) =>
        `* ${item.name} x${item.quantity} - ₦${item.price.toLocaleString()}`,
    )
    .join("\n");
  return `🎁 Gift Order from ${orderData.brand || "John's Stores"}

Sender: ${customerName}
Phone: ${customerPhone}

Recipient: ${recipientName}
Phone: ${recipientPhone}

Items:
${itemLines}

Subtotal: ₦${orderData.subtotal?.toLocaleString() || 0}
Delivery: ₦${orderData.deliveryFee?.toLocaleString() || 0}
Total: ₦${orderData.total?.toLocaleString() || 0}`;
};

const OrderDetails = ({
  onClose,
  orderData,
  onUpdateStatus,
  onUpdatePayment,
  isLoading = false,
}) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(orderData?.orderStatus || "Pending");
  const [finalPrice, setFinalPrice] = useState(orderData?.finalPrice || "");
  const [profit, setProfit] = useState(orderData?.profit || "");

  const handleSelect = (value) => {
    setStatus(value);
    setOpen(false);
    onUpdateStatus?.(value);
  };
  const handlePaymentStatus = (value) => {
    onUpdatePayment?.(value);
  };

  const handleSaveProfit = () => {
    onUpdatePayment?.("Paid", {
      finalPrice: Number(finalPrice),
      profit: Number(profit),
    });
  };

  if (!orderData) return null;

  const customerName = orderData.customer?.name || orderData.sender || "N/A";
  const customerPhone = orderData.customer?.phone || "N/A";
  const recipientName = orderData.recipient?.name || "N/A";
  const recipientPhone = orderData.recipient?.phone || "N/A";
  const whatsappMessage = buildWhatsAppMessage(
    orderData,
    customerName,
    customerPhone,
    recipientName,
    recipientPhone,
  );

  return (
    <div className="flex flex-col w-[572px] max-h-[90vh] overflow-y-auto rounded-[16px] bg-white">
      <div className="sticky top-0 bg-white flex items-center h-[56px] px-[25px] border-b border-[rgba(113,113,130,0.35)] z-10">
        <div className="flex items-center justify-between w-full">
          <p className="text-[#2D2D2D] font-medium text-base leading-[14px] font-clash-grotesk">
            Order Details - {orderData.orderId}
          </p>
          <img
            src="/cancel.svg"
            alt="Close"
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="px-[25px] pb-[20px] flex flex-col items-start gap-[20px] mt-[16px]">
        {/* WhatsApp Message */}
        <div className="flex flex-col w-full gap-[8px]">
          <p className="text-[#2D2D2D] font-semibold text-[16px] leading-[16px] tracking-[-0.3px] font-dm-sans-700">
            Whatsapp Order Message
          </p>
          <div className="w-full rounded-[12px] bg-[#F7F7F8] p-[16px]">
            <pre className="text-[#2D2D2D] font-normal text-[13px] leading-[22px] font-dm-sans-500 whitespace-pre-wrap">
              {whatsappMessage}
            </pre>
          </div>
        </div>

        {/* Customer & Recipient */}
        <div className="flex justify-between w-full items-start">
          <div className="flex flex-col items-start gap-1">
            <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
              Customer
            </p>
            <p className="text-[#2D2D2D] font-semibold text-sm leading-[16px] tracking-[-0.3px] font-dm-sans-700">
              {customerName}
            </p>
            <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
              {customerPhone}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
              Recipient
            </p>
            <p className="text-[#2D2D2D] font-semibold text-sm leading-[16px] tracking-[-0.3px] font-dm-sans-700">
              {recipientName}
            </p>
            <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
              {recipientPhone}
            </p>
          </div>
        </div>

        {/* Items Purchased */}
        <div className="flex flex-col w-full gap-[10px]">
          <p className="text-[#2D2D2D] font-semibold text-[16px] leading-[16px] tracking-[-0.3px] font-dm-sans-700">
            Items Purchased
          </p>
          <div className="flex flex-col w-full gap-[8px]">
            {orderData.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full px-[16px] py-[14px] rounded-[12px] border border-[rgba(107,107,107,0.15)] bg-white"
              >
                <div className="flex flex-col items-start gap-1">
                  <p className="text-[#2D2D2D] font-semibold text-sm leading-[16px] tracking-[-0.3px] font-dm-sans-700">
                    {item.name}
                  </p>
                  <p className="text-[#717182] font-medium text-xs leading-[14px] font-clash-grotesk">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-[#E3494E] font-medium text-[22px] leading-[25px] font-clash-grotesk">
                  ₦{item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="flex items-center w-full justify-between">
          <div className="flex flex-col gap-[6px]">
            <p className="text-[rgba(113,113,130,0.70)] font-medium text-xs leading-[14px] font-clash-grotesk">
              Subtotal
            </p>
            <p className="text-[rgba(113,113,130,0.70)] font-medium text-xs leading-[14px] font-clash-grotesk">
              Delivery Fee
            </p>
            <p className="text-[#2D2D2D] font-semibold text-base leading-[18px] tracking-[-0.3px] font-dm-sans-700">
              Total
            </p>
          </div>
          <div className="flex flex-col gap-[6px] items-end">
            <p className="text-[#2D2D2D] font-medium text-xs leading-[14px] font-clash-grotesk">
              ₦{orderData.subtotal?.toLocaleString() || 0}
            </p>
            <p className="text-[#2D2D2D] font-medium text-xs leading-[14px] font-clash-grotesk">
              ₦{orderData.deliveryFee?.toLocaleString() || 0}
            </p>
            <p className="text-[#2D2D2D] font-semibold text-base leading-[18px] tracking-[-0.3px] font-dm-sans-700">
              ₦{orderData.total?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#D1D5DC]" />

        {/* Final Price & Profit */}
        <div className="flex flex-col items-start gap-[10px] w-full">
          <p className="text-[#2D2D2D] font-semibold text-[16px] leading-[16px] tracking-[-0.3px] font-dm-sans-700">
            Final Price & Profit
          </p>
          <div className="flex gap-3 w-full">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[#717182] font-medium text-xs font-clash-grotesk">
                Final Price (₦)
              </label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                placeholder="Agreed price"
                disabled={isLoading}
                className="w-full h-[45px] px-4 rounded-[12px] border-[1.5px] border-[#D1D5DC] bg-white outline-none text-sm font-dm-sans disabled:opacity-50"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[#717182] font-medium text-xs font-clash-grotesk">
                Profit (₦)
              </label>
              <input
                type="number"
                value={profit}
                onChange={(e) => setProfit(e.target.value)}
                placeholder="Your profit"
                disabled={isLoading}
                className="w-full h-[45px] px-4 rounded-[12px] border-[1.5px] border-[#D1D5DC] bg-white outline-none text-sm font-dm-sans disabled:opacity-50"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfit}
            disabled={isLoading || !finalPrice || !profit}
            className="flex justify-center items-center w-full h-[45px] rounded-[12px] bg-[#032817] text-white font-medium text-sm font-clash-grotesk disabled:opacity-50 cursor-pointer hover:bg-[#042e1e] transition-colors"
          >
            {isLoading ? "Saving..." : "Save & Mark as Paid"}
          </button>
        </div>

        <div className="w-full h-[1px] bg-[#D1D5DC]" />

        {/* Payment Confirmation */}
        <div className="flex flex-col items-start gap-[10px] w-full">
          <p className="text-[#2D2D2D] font-semibold text-[16px] leading-[16px] tracking-[-0.3px] font-dm-sans-700">
            Payment Confirmation
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePaymentStatus("Paid")}
              disabled={isLoading}
              className={`flex justify-center items-center w-[85px] h-[45px] rounded-[14px] transition-colors disabled:opacity-50 ${orderData.paymentStatus === "Paid" ? "bg-[#16CB5E]" : "bg-[#ECECF0]"}`}
            >
              <p
                className={`font-medium text-base leading-[18px] font-clash-grotesk ${orderData.paymentStatus === "Paid" ? "text-white" : "text-black"}`}
              >
                Paid
              </p>
            </button>
            <button
              onClick={() => handlePaymentStatus("Pending")}
              disabled={isLoading}
              className={`flex justify-center items-center w-[100px] h-[45px] rounded-[12px] transition-colors disabled:opacity-50 ${orderData.paymentStatus === "Pending" ? "bg-[#16CB5E]" : "bg-[#ECECF0]"}`}
            >
              <p
                className={`font-medium text-base leading-[18px] font-clash-grotesk ${orderData.paymentStatus === "Pending" ? "text-white" : "text-black"}`}
              >
                Pending
              </p>
            </button>
          </div>
        </div>

        {/* Update Order Status */}
        <div className="flex flex-col items-start gap-[10px] w-full">
          <p className="text-[#2D2D2D] font-semibold text-[16px] leading-[16px] tracking-[-0.3px] font-dm-sans-700">
            Update Order Status
          </p>
          <div className="relative w-full">
            <div
              className="flex justify-between items-center p-[16px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <p className="text-black font-medium text-base leading-[18px] font-dm-sans-500">
                {status}
              </p>
              <img
                src="/keyboard-arrow.svg"
                alt="Dropdown"
                className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </div>
            {open && (
              <div className="absolute top-full mt-2 w-full rounded-[10px] bg-white shadow-md border z-10">
                {["Pending", "Processing", "Completed", "Cancelled"].map(
                  (option) => (
                    <div
                      key={option}
                      onClick={() => handleSelect(option)}
                      className="p-3 cursor-pointer hover:bg-gray-100 rounded-[10px] transition-colors"
                    >
                      <p className="text-[#2D2D2D] font-medium text-sm">
                        {option}
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
