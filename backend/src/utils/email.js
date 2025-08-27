import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const emailTemplates = {
  verifyEmail: (name, verificationLink) => `
     <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
    
    <h2 style="color: #3b82f6; margin-bottom: 20px;">Welcome to ShopSphere 🎉</h2>
    
    <p style="color: #1f2937; font-size: 16px;">Hello <b>${name}</b>,</p>
    <p style="color: #374151; font-size: 15px; line-height: 1.5;">
      Thanks for signing up! Please confirm your email address by clicking the button below.
    </p>
    
    <a href="${verificationLink}" 
       style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #ffffff; 
              padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
      Verify Email
    </a>
    
    <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">
      If the button doesn’t work, copy and paste this link into your browser:
    </p>
    <p style="color: #2563eb; word-break: break-all; font-size: 13px;">
      ${verificationLink}
    </p>
    
    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #1e40af; font-size: 14px; margin: 0;">
        This link will expire in <b>1 hour</b>. If you didn’t sign up, please ignore this email.
      </p>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px;">
      This email was sent by <b>ShopSphere</b>.
    </p>
  </div>
</div>

  `,
  updateEmail: (name, verifyLink) => `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
      
      <h2 style="color: #3b82f6; margin-bottom: 20px;">Confirm Your New Email 📧</h2>
      
      <p style="color: #1f2937; font-size: 16px;">Hello <b>${name}</b>,</p>
      <p style="color: #374151; font-size: 15px; line-height: 1.5;">
        You requested to change your email address for your ShopSphere account. Please confirm your new email by clicking the button below.
      </p>
      
      <a href="${verifyLink}" 
         style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #ffffff; 
                padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
        Confirm Email
      </a>
      
      <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>
      <p style="color: #2563eb; word-break: break-all; font-size: 13px;">
        ${verifyLink}
      </p>
      
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #1e40af; font-size: 14px; margin: 0;">
          This link will expire in <b>1 hour</b>. If you didn’t request this, please ignore this email.
        </p>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px;">
        This email was sent by <b>ShopSphere</b>. If you didn’t request an email change, please contact our support team immediately.
      </p>
    </div>
  </div>
  `,
  forgotPasswordEmail: (name, otp) => `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
    
    <h2 style="color: #3b82f6; margin-bottom: 20px;">Password Reset Request 🔒</h2>
    
    <p style="color: #1f2937; font-size: 16px;">Hello <b>${name}</b>,</p>
    <p style="color: #374151; font-size: 15px; line-height: 1.5;">
      We received a request to reset your password. Use the OTP code below to proceed:
    </p>
    
    <div style="display: inline-block; margin: 20px 0; background-color: #eff6ff; 
                padding: 16px 24px; border-radius: 8px; font-size: 24px; 
                font-weight: bold; letter-spacing: 4px; color: #1e40af;">
      ${otp}
    </div>
    
    <div style="background-color: #fef9c3; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #92400e; font-size: 14px; margin: 0;">
        This OTP will expire in <b>10 minutes</b>. Do not share this code with anyone.
      </p>
    </div>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px;">
      This email was sent by <b>ShopSphere Security Team</b>.
    </p>
  </div>
</div>`,
  resetPasswordEmail: (name) => `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
    
    <h2 style="color: #3b82f6; margin-bottom: 20px;">Password Updated Successfully ✅</h2>
    
    <p style="color: #1f2937; font-size: 16px;">Hello <b>${name}</b>,</p>
    <p style="color: #374151; font-size: 15px; line-height: 1.5;">
      Your ShopSphere account password has been successfully reset.
    </p>
    
    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; 
                padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #065f46; font-size: 14px; margin: 0;">
        Your password was changed on: ${new Date().toLocaleString()}
      </p>
    </div>
    
    <a href="${process.env.FRONTEND_URL}/login" 
       style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #ffffff; 
              padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
      Login to Your Account
    </a>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px;">
      This email was sent by <b>ShopSphere Security Team</b>. For your safety, do not forward this email.
    </p>
  </div>
</div>
`,
  contactUsEmail: (name, email, message) => `
<div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
  <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 30px;">
    
    <h2 style="color: #3b82f6; margin-bottom: 20px;">New Contact Message 📧</h2>
    
    <p style="color: #1f2937; font-size: 16px;">Hello <b>ShopSphere Team</b>,</p>
    <p style="color: #374151; font-size: 15px; line-height: 1.5;">
      You have received a new message from a customer through the contact form.
    </p>
    
    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
      <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">Message Details:</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #374151; display: inline-block; width: 80px;">From:</strong>
        <span style="color: #2563eb;">${name}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #374151; display: inline-block; width: 80px;">Email:</strong>
        <span style="color: #2563eb;">${email}</span>
      </div>
      
      <div style="margin-bottom: 0;">
        <strong style="color: #374151; display: block; margin-bottom: 8px;">Message:</strong>
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 6px; color: #374151; line-height: 1.5;">
          ${message}
        </div>
      </div>
    </div>
    
    <div style="background-color: #fef3c7; border: 1px solid #fcd34d; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #92400e; font-size: 14px; margin: 0;">
        <strong>⚠️ Action Required:</strong> Please respond to this inquiry within 24 hours.
      </p>
    </div>
    
    <a href="mailto:${email}" 
       style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #ffffff; 
              padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
      Reply to ${name}
    </a>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <div style="color: #6b7280; font-size: 13px;">
      <p>Message received on: <b>${new Date().toLocaleString()}</b></p>
      <p>This email was generated automatically by the ShopSphere contact form.</p>
    </div>
  </div>
</div>
`,
  generateOrderConfirmationEmail: (user, order, shippingAddress) => {
    const itemsHtml = order.items
      .map(
        (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left;">
        <img src="${process.env.BACKEND_URL}/${item.image}" "${
          item.image
        }" alt="${item.name}" width="60" style="border-radius: 4px;">
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left;">
        <div style="font-weight: 600;">${item.name}</div>
        <div style="color: #666; font-size: 14px;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
      )
      .join("");

    return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #DD7F1A, #FF9F43); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            Thank you for your purchase, ${user.name}!
          </p>
        </div>

        <!-- Order Details -->
        <div style="padding: 30px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #333; margin: 0 0 15px; font-size: 18px;">Order Summary</h2>
            <p style="margin: 5px 0; color: #666;">
              <strong>Order Number:</strong> ${order.orderNumber}
            </p>
            <p style="margin: 5px 0; color: #666;">
              <strong>Order Date:</strong> ${new Date().toLocaleDateString()}
            </p>
            <p style="margin: 5px 0; color: #666;">
              <strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">Confirmed</span>
            </p>
          </div>

          <!-- Order Items -->
          <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <thead>
              <tr>
                <th style="padding: 12px; border-bottom: 2px solid #eee; text-align: left; width: 80px;">Image</th>
                <th style="padding: 12px; border-bottom: 2px solid #eee; text-align: left;">Product</th>
                <th style="padding: 12px; border-bottom: 2px solid #eee; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Order Totals -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="color: #666;">Subtotal:</span>
              <span style="font-weight: 600;">$${order.subtotal.toFixed(
                2
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="color: #666;">Shipping:</span>
              <span style="font-weight: 600;">${
                order.shippingCost === 0
                  ? "Free"
                  : `$${order.shippingCost.toFixed(2)}`
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="color: #666;">Tax:</span>
              <span style="font-weight: 600;">$${order.tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; padding-top: 15px; border-top: 2px solid #ddd;">
              <span style="color: #333; font-weight: 700; font-size: 18px;">Total:</span>
              <span style="color: #DD7F1A; font-weight: 700; font-size: 18px;">$${order.total.toFixed(
                2
              )}</span>
            </div>
          </div>

          <!-- Shipping Information -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
            <div>
              <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Shipping Address</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <p style="margin: 5px 0; color: #666;">
                  <strong>${shippingAddress.firstName} ${
      shippingAddress.lastName
    }</strong>
                </p>
                <p style="margin: 5px 0; color: #666;">${
                  shippingAddress.address
                }</p>
                <p style="margin: 5px 0; color: #666;">
                  ${shippingAddress.city}, ${shippingAddress.state} ${
      shippingAddress.zipCode
    }
                </p>
                <p style="margin: 5px 0; color: #666;">${
                  shippingAddress.country
                }</p>
                <p style="margin: 5px 0; color: #666;">📞 ${
                  shippingAddress.phone
                }</p>
              </div>
            </div>

            <div>
              <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Shipping Method</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <p style="margin: 5px 0; color: #666;">
                  <strong>${order.shippingMethod.name}</strong>
                </p>
                <p style="margin: 5px 0; color: #666;">
                  Estimated Delivery: ${order.shippingMethod.delivery}
                </p>
                <p style="margin: 5px 0; color: #666;">
                  Shipping Cost: ${
                    order.shippingCost === 0
                      ? "Free"
                      : `$${order.shippingCost.toFixed(2)}`
                  }
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">Payment Information</h3>
            <p style="margin: 5px 0; color: #666;">
              <strong>Payment Method:</strong> ${order.paymentMethod}
            </p>
            <p style="margin: 5px 0; color: #666;">
              <strong>Payment Status:</strong> <span style="color: #10b981; font-weight: 600;">Completed</span>
            </p>
          </div>

          <!-- Next Steps -->
          <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid #eee;">
            <h3 style="color: #333; margin: 0 0 15px;">What's Next?</h3>
            <p style="color: #666; margin: 0 0 20px;">
              We'll send you another email when your order ships. You can also check your order status anytime in your account.
            </p>
            <a href="${process.env.FRONTEND_URL}/orders" 
               style="display: inline-block; background-color: #DD7F1A; color: white; 
                      padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Order Details
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: #999; margin: 0; font-size: 14px;">
            Thank you for shopping with ShopSphere!<br>
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  `;
  },
};

export async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

export async function receiveEmail({ from, to, subject, html }) {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}
