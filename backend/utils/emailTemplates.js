// ── Brand colors & shared styles ─────────────────────────────────
const brandRed = "#E3494E";
const brandDark = "#032817";
const brandGold = "#E6D3AC";
const textDark = "#2D2D2D";
const textGray = "#6B6B6B";

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#FAFAFA;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAFA;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background-color:${brandDark};padding:30px 40px;text-align:center;">
              <table cellpadding="0" cellspacing="0" align="center">
                <tr>
                 <td style="width:40px;height:40px;">
  <img src="https://res.cloudinary.com/dqjtvdxgm/image/upload/v1777932541/Vector_mupdqf.png" alt="John's Enterprise" style="width:40px;height:40px;object-fit:contain;" />
</td>
<td style="padding-left:12px;text-align:left;">
  <p style="color:#FFF;font-size:14px;font-weight:600;margin:0;line-height:1.3;">John's<br/>Enterprise</p>
</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#F9F9F9;padding:24px 40px;text-align:center;border-top:1px solid #F0F0F0;">
              <p style="color:${textGray};font-size:12px;margin:0 0 8px 0;">
                John's Enterprise — Swift Logistics • John Stores • Easy Media
              </p>
              <p style="color:${textGray};font-size:11px;margin:0;">
                Lagos, Nigeria | +234 903 963 2833
              </p>
              <div style="margin-top:12px;">
                <a href="#" style="color:${brandRed};font-size:11px;text-decoration:underline;">Privacy Policy</a>
                <span style="color:#CCC;margin:0 8px;">|</span>
                <a href="#" style="color:${brandRed};font-size:11px;text-decoration:underline;">Terms of Service</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── Order Confirmation Email ─────────────────────────────────────
export const orderConfirmationTemplate = (order) => {
  const itemsHtml = order.items
    ?.map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #F0F0F0;">
          <p style="color:${textDark};font-size:14px;font-weight:500;margin:0;">${item.name} x${item.quantity}</p>
          ${item.size ? `<p style="color:${textGray};font-size:12px;margin:2px 0 0;">Size: ${item.size}</p>` : ""}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #F0F0F0;text-align:right;">
          <p style="color:${brandDark};font-size:14px;font-weight:600;margin:0;">₦${(item.price * item.quantity).toLocaleString()}</p>
        </td>
      </tr>
    `,
    )
    .join("");

  const content = `
    <h2 style="color:${textDark};font-size:22px;font-weight:700;margin:0 0 8px 0;">Order Confirmed! 🎉</h2>
    <p style="color:${textGray};font-size:15px;margin:0 0 24px 0;line-height:1.6;">
      Thank you, <strong>${order.sender}</strong>! Your order has been received and is being processed.
    </p>
    
    <!-- Order Info Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;border-radius:12px;padding:20px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="color:${textGray};font-size:13px;margin:0 0 4px 0;">Order Reference</p>
          <p style="color:${textDark};font-size:18px;font-weight:700;margin:0;">${order.orderId}</p>
        </td>
        <td style="text-align:right;">
          <span style="display:inline-block;background-color:${brandGold};color:${brandDark};padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;">Pending</span>
        </td>
      </tr>
    </table>
    
    <!-- Items Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td colspan="2">
          <p style="color:${textDark};font-size:14px;font-weight:600;margin:0 0 12px 0;">Order Items</p>
        </td>
      </tr>
      ${itemsHtml}
      <tr>
        <td style="padding:12px 0;">
          <p style="color:${textGray};font-size:14px;margin:0;">Subtotal</p>
        </td>
        <td style="padding:12px 0;text-align:right;">
          <p style="color:${textDark};font-size:14px;margin:0;">₦${order.subtotal?.toLocaleString() || 0}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 0;">
          <p style="color:${textGray};font-size:14px;margin:0;">Delivery Fee</p>
        </td>
        <td style="padding:4px 0;text-align:right;">
          <p style="color:${textDark};font-size:14px;margin:0;">To be confirmed</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-top:2px solid #F0F0F0;">
          <p style="color:${textDark};font-size:16px;font-weight:700;margin:0;">Total</p>
        </td>
        <td style="padding:12px 0;border-top:2px solid #F0F0F0;text-align:right;">
          <p style="color:${brandRed};font-size:18px;font-weight:700;margin:0;">₦${order.total?.toLocaleString() || 0}</p>
        </td>
      </tr>
    </table>
    
    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0FDF4;border:1px solid #DCFCE7;border-radius:12px;padding:16px 20px;margin-bottom:8px;">
      <tr>
        <td>
          <p style="color:#016630;font-size:13px;margin:0;text-align:center;">
            📦 We'll notify you once your order is on its way. Delivery fee will be confirmed shortly.
          </p>
        </td>
      </tr>
    </table>
  `;

  return baseTemplate(content);
};

// ── Payment Confirmation Email ───────────────────────────────────
export const paymentConfirmedTemplate = (order) => {
  const content = `
    <div style="text-align:center;">
      <div style="width:64px;height:64px;background-color:#DCFCE7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#008236" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      
      <h2 style="color:${textDark};font-size:22px;font-weight:700;margin:0 0 8px 0;">Payment Confirmed! ✅</h2>
      <p style="color:${textGray};font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Your payment for order <strong>${order.orderId}</strong> has been received.
      </p>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;border-radius:12px;padding:20px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="color:${textGray};font-size:13px;margin:0 0 4px 0;">Amount Paid</p>
            <p style="color:${brandDark};font-size:22px;font-weight:700;margin:0;">₦${order.total?.toLocaleString() || 0}</p>
          </td>
          <td style="text-align:right;">
            <span style="display:inline-block;background-color:${brandDark};color:#FFF;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;">Processing</span>
          </td>
        </tr>
      </table>
      
      <p style="color:${textGray};font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        We're now preparing your order for delivery. We'll notify you when it's on its way.
      </p>
    </div>
  `;

  return baseTemplate(content);
};

// ── Order Completed / Delivered Email ────────────────────────────
export const orderCompletedTemplate = (order) => {
  const content = `
    <div style="text-align:center;">
      <!-- Delivery Image -->
      <img src="https://res.cloudinary.com/dqjtvdxgm/image/upload/v1/je-admin/delivery-confirmed.jpg" 
           alt="Order Delivered" 
           style="max-width:100%;width:100%;border-radius:12px;margin-bottom:24px;" />
      
      <h2 style="color:${textDark};font-size:22px;font-weight:700;margin:0 0 8px 0;">Delivered! 🎉</h2>
      <p style="color:${textGray};font-size:15px;margin:0 0 8px 0;line-height:1.6;">
        Great news, <strong>${order.sender}</strong>!
      </p>
      <p style="color:${textGray};font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Your order <strong>${order.orderId}</strong> has been delivered successfully.
      </p>
      
      <!-- Rating Stars -->
      <div style="margin-bottom:24px;">
        <p style="color:${textDark};font-size:14px;font-weight:600;margin:0 0 12px 0;">How was your experience?</p>
        <div style="font-size:28px;letter-spacing:4px;">
          ⭐⭐⭐⭐⭐
        </div>
      </div>
      
      <p style="color:${textGray};font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        We hope you love your order! Thank you for choosing <strong>John's Enterprise</strong>.
      </p>
      
      <!-- CTA -->
      <a href="#" style="display:inline-block;background-color:${brandDark};color:#FFF;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">
        Order Again
      </a>
    </div>
  `;

  return baseTemplate(content);
};
