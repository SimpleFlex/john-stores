export const buildWhatsAppMessage = ({
  senderName,
  senderPhone,
  senderEmail,
  recipientName,
  recipientPhone,
  country,
  city,
  deliveryAddress,
  deliveryDate,
  giftMessage,
  specialInstructions,
  cartList,
  subtotal,
  currency,
}) => {
  const orderRef = `JE-${Date.now().toString().slice(-6)}`;
  const orderDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const orderTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getProductName = (product) =>
    product.productName || product.name || "Unknown Item";
  const getPrice = (product) => {
    if (typeof product.price === "object") return product.price.current;
    return product.price;
  };
  const getDescription = (product) => product.description || "";

  const itemLines = cartList
    .map((item, i) => {
      const name = getProductName(item.product);
      const price = getPrice(item.product);
      const desc = getDescription(item.product);
      const variantParts = [];
      if (item.variantKey && item.variantKey !== "default") {
        if (item.variantKey.includes("-")) {
          const [size, color] = item.variantKey.split("-");
          if (size) variantParts.push(`Size: ${size}`);
          if (color) variantParts.push(`Color: ${color}`);
        } else {
          variantParts.push(`Variant: ${item.variantKey}`);
        }
      }
      const variantStr =
        variantParts.length > 0 ? ` (${variantParts.join(", ")})` : "";
      const descStr = desc ? `\n     📝 ${desc}` : "";
      return `  ${i + 1}. ${name}${variantStr}\n     Qty: ${item.quantity}  ×  ${currency}${price?.toLocaleString() || 0} = ${currency}${((price || 0) * item.quantity).toLocaleString()}${descStr}`;
    })
    .join("\n\n");

  const message = `
🔔 *NEW ORDER NOTIFICATION*
━━━━━━━━━━━━━━━━━━━━━━━

📋 *Ref:* #${orderRef}
📅 *Date:* ${orderDate} at ${orderTime}

━━━━━━━━━━━━━━━━━━━━━━━
👤 *SENDER*
━━━━━━━━━━━━━━━━━━━━━━━
- Name:  ${senderName}
- Phone: ${senderPhone}${senderEmail ? `\n• Email: ${senderEmail}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━
📦 *RECIPIENT & DELIVERY*
━━━━━━━━━━━━━━━━━━━━━━━
- Name:    ${recipientName}
- Phone:   ${recipientPhone}
- Country: ${country}
- City:    ${city}
- Address: ${deliveryAddress}
- Delivery Date: ${deliveryDate || "Not specified"}

━━━━━━━━━━━━━━━━━━━━━━━
🛍️ *ORDER ITEMS*
━━━━━━━━━━━━━━━━━━━━━━━

${itemLines}

━━━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY*
━━━━━━━━━━━━━━━━━━━━━━━
- Subtotal:     ${currency}${subtotal.toLocaleString()}
- Delivery Fee: ⏳ Pending confirmation
- *Est. Total:  ${currency}${subtotal.toLocaleString()}*
${giftMessage ? `\n━━━━━━━━━━━━━━━━━━━━━━━\n💌 *GIFT MESSAGE*\n━━━━━━━━━━━━━━━━━━━━━━━\n"${giftMessage}"` : ""}${specialInstructions ? `\n\n📝 *SPECIAL INSTRUCTIONS*\n${specialInstructions}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━
✅ *ACTION REQUIRED*
━━━━━━━━━━━━━━━━━━━━━━━
1. Confirm delivery fee for ${city}, ${country}
2. Reply to customer on: ${senderPhone}
3. Share payment details to complete order

━━━━━━━━━━━━━━━━━━━━━━━
_John's Enterprise Order System_
━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  return message;
};
