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

  const itemLines = cartList
    .map(
      (item, i) =>
        `  ${i + 1}. ${item.product.name}${
          item.variantKey !== "default" ? ` (${item.variantKey})` : ""
        }\n     Qty: ${item.quantity}  ×  ${currency}${item.product.price.toLocaleString()} = ${currency}${(item.product.price * item.quantity).toLocaleString()}`,
    )
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
- Delivery Date: ${deliveryDate}

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
