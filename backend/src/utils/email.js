import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import { dirname, join, basename } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const emailTemplates = {
  verifyEmail: (name, verificationLink) => `
  <div style="font-family: system-ui, sans-serif; background-color: #0a0a0a; padding: 40px 20px; text-align: center; color: #e5e5e5;">
    <div style="max-width: 500px; margin: auto; background: #111; border: 1px solid #222; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); padding: 30px;">
      
      <h2 style="color: #3b82f6; margin-bottom: 20px;">Welcome to ShopSphere 🎉</h2>
      
      <p style="font-size: 16px;">Hello <b>${name}</b>,</p>
      <p style="font-size: 15px; line-height: 1.5; color: #a1a1aa;">
        Thanks for signing up! Please confirm your email address by clicking the button below.
      </p>
      
      <a href="${verificationLink}" 
         style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #fff; 
                padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
        Verify Email
      </a>
      
      <p style="font-size: 13px; margin-top: 30px; color: #71717a;">
        If the button doesn’t work, copy and paste this link into your browser:
      </p>
      <p style="color: #3b82f6; word-break: break-all; font-size: 13px;">
        ${verificationLink}
      </p>
      
      <div style="background-color: #1a1a1a; border: 1px solid #27272a; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; margin: 0; color: #a1a1aa;">
          This link will expire in <b>1 hour</b>. If you didn’t sign up, please ignore this email.
        </p>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #27272a;">
      <p style="color: #52525b; font-size: 12px;">
        This email was sent by <b>ShopSphere</b>.
      </p>
    </div>
  </div>
  `,

  updateEmail: (name, updateLink) => `
  <div style="font-family: system-ui, sans-serif; background-color: #0a0a0a; padding: 40px 20px; text-align: center; color: #e5e5e5;">
    <div style="max-width: 500px; margin: auto; background: #111; border: 1px solid #222; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); padding: 30px;">
      
      <h2 style="color: #3b82f6; margin-bottom: 20px;">Confirm Email Update</h2>
      
      <p style="font-size: 16px;">Hi <b>${name}</b>,</p>
      <p style="font-size: 15px; line-height: 1.5; color: #a1a1aa;">
        You requested to update your email. Please confirm by clicking the button below.
      </p>
      
      <a href="${updateLink}" 
         style="display: inline-block; margin-top: 20px; background-color: #3b82f6; color: #fff; 
                padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
        Confirm Update
      </a>
      
      <div style="background-color: #1a1a1a; border: 1px solid #27272a; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; margin: 0; color: #a1a1aa;">
          If you didn’t request this change, please ignore this email.
        </p>
      </div>
    </div>
  </div>
  `,

  forgotPasswordEmail: (name, otp) => `
  <div style="font-family: system-ui, sans-serif; background-color: #0a0a0a; padding: 40px 20px; text-align: center; color: #e5e5e5;">
    <div style="max-width: 500px; margin: auto; background: #111; border: 1px solid #222; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); padding: 30px;">
      
      <h2 style="color: #3b82f6; margin-bottom: 20px;">Reset Your Password</h2>
      
      <p style="font-size: 16px;">Hello <b>${name}</b>,</p>
      <p style="font-size: 15px; line-height: 1.5; color: #a1a1aa;">
        We received a request to reset your password. Use the OTP code below to proceed.
      </p>
      
      <!-- OTP Display Box -->
      <div style="background: #1a1a1a; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="font-size: 13px; margin: 0 0 10px; color: #a1a1aa;">Your OTP Code:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #3b82f6;">
          ${otp}
        </div>
      </div>
      
      <p style="font-size: 14px; color: #a1a1aa;">
        Enter this code in the password reset form to verify your identity.
      </p>
      
      <div style="background-color: #1a1a1a; border: 1px solid #27272a; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; margin: 0; color: #a1a1aa;">
          This OTP will expire in <b>10 minutes</b>. If you didn't request this, please ignore this email.
        </p>
      </div>
    </div>
  </div>
  `,

  resetPasswordEmail: (name) => `
  <div style="font-family: system-ui, sans-serif; background-color: #0a0a0a; padding: 40px 20px; text-align: center; color: #e5e5e5;">
    <div style="max-width: 500px; margin: auto; background: #111; border: 1px solid #222; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); padding: 30px;">
      
      <h2 style="color: #3b82f6; margin-bottom: 20px;">Password Changed</h2>
      
      <p style="font-size: 16px;">Hi <b>${name}</b>,</p>
      <p style="font-size: 15px; line-height: 1.5; color: #a1a1aa;">
        Your password has been successfully updated. If this wasn’t you, please contact support immediately.
      </p>
    </div>
  </div>
  `,

  contactUsEmail: (name, email, message) => `
  <div style="font-family: system-ui, sans-serif; background-color: #0a0a0a; padding: 40px 20px; text-align: center; color: #e5e5e5;">
    <div style="max-width: 500px; margin: auto; background: #111; border: 1px solid #222; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); padding: 30px;">
      
      <h2 style="color: #3b82f6; margin-bottom: 20px;">New Contact Message</h2>
      
      <p style="font-size: 15px; line-height: 1.5; color: #a1a1aa;">
        <b>Name:</b> ${name}<br>
        <b>Email:</b> ${email}
      </p>
      
      <div style="background-color: #1a1a1a; border: 1px solid #27272a; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: left;">
        <p style="font-size: 14px; margin: 0; color: #a1a1aa; white-space: pre-line;">
          ${message}
        </p>
      </div>
    </div>
  </div>
  `,

  generateOrderConfirmationEmail: (user, order, shippingAddress) => {
    let attachments = [];

    const itemsHtml = order.items
      .map((item, index) => {
        let imgSrc;

        // Use Cloudinary URL directly if it's already a Cloudinary URL
        if (item.image.startsWith("http") && item.image.includes("cloudinary.com")) {
          imgSrc = item.image;
        } else if (item.image.startsWith("http")) {
          // Other external URLs
          imgSrc = item.image;
        } else {
          // Fallback for local development or legacy URLs
          if (process.env.NODE_ENV === "production") {
            imgSrc = `${process.env.BACKEND_URL}/uploads/${encodeURIComponent(basename(item.image))}`;
          } else {
            // local dev: try to attach image from uploads
            const cid = `product${index}@shop`;
            imgSrc = `cid:${cid}`;
            const filePath = join(
              __dirname,
              "..",
              "uploads",
              basename(item.image)
            );

            if (fs.existsSync(filePath)) {
              attachments.push({
                filename: basename(item.image),
                path: filePath,
                cid,
              });
            } else {
              // Fallback to URL if file doesn't exist locally
              imgSrc = `${process.env.BACKEND_URL}/uploads/${encodeURIComponent(basename(item.image))}`;
            }
          }
        }

        return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #27272a; text-align: left;">
          <img src="${imgSrc}" alt="${
          item.name
        }" width="60" style="border-radius: 6px;">
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #27272a; text-align: left; color: #e5e5e5;">
          <div style="font-weight: 600;">${item.name}</div>
          <div style="color: #a1a1aa; font-size: 14px;">Qty: ${
            item.quantity
          }</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #27272a; text-align: right; color: #e5e5e5;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `;
      })
      .join("");

    // Optional notes
    const notesHtml = order.orderNotes
      ? `
      <div style="background: #1a1a1a; border: 1px solid #27272a; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h3 style="color: #e5e5e5; margin: 0 0 10px; font-size: 16px;">Order Notes</h3>
        <p style="color: #a1a1aa; margin: 0;">${order.orderNotes}</p>
      </div>
    `
      : "";

    const html = `
    <div style="font-family: system-ui, sans-serif; background-color: #0a0a0a; padding: 40px 20px; color: #e5e5e5;">
      <div style="max-width: 600px; margin: auto; background: #111; border: 1px solid #222; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        
        <!-- Header -->
        <div style="background: #111; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; border-bottom: 1px solid #222;">
          <h2 style="color: #3b82f6; margin: 0 0 10px; font-size: 24px;">Order Confirmed! 🎉</h2>
          <p style="color: #a1a1aa; margin: 0; font-size: 16px;">
            Thank you for your purchase, ${user.name}!
          </p>
        </div>

        <!-- Order Details -->
        <div style="padding: 30px;">
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #27272a;">
            <h2 style="color: #e5e5e5; margin: 0 0 15px; font-size: 18px;">Order Summary</h2>
            <p style="margin: 5px 0; color: #a1a1aa;">
              <strong>Order Number:</strong> ${order.orderNumber}
            </p>
            <p style="margin: 5px 0; color: #a1a1aa;">
              <strong>Order Date:</strong> ${new Date().toLocaleDateString()}
            </p>
            <p style="margin: 5px 0; color: #a1a1aa;">
              <strong>Status:</strong> <span style="color: #22c55e; font-weight: 600;">Confirmed</span>
            </p>
          </div>

          <!-- Items -->
          <h3 style="color: #e5e5e5; margin: 0 0 15px; font-size: 16px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <thead>
              <tr>
                <th style="padding: 12px; border-bottom: 2px solid #27272a; text-align: left; width: 80px; color: #a1a1aa;">Image</th>
                <th style="padding: 12px; border-bottom: 2px solid #27272a; text-align: left; color: #a1a1aa;">Product</th>
                <th style="padding: 12px; border-bottom: 2px solid #27272a; text-align: right; color: #a1a1aa;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #27272a;">
            <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #a1a1aa;">
              <span>Subtotal:</span>
              <span style="font-weight: 600; color: #e5e5e5;">$${order.subtotal.toFixed(
                2
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #a1a1aa;">
              <span>Shipping:</span>
              <span style="font-weight: 600; color: #e5e5e5;">${
                order.shippingCost === 0
                  ? "Free"
                  : `$${order.shippingCost.toFixed(2)}`
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #a1a1aa;">
              <span>Tax:</span>
              <span style="font-weight: 600; color: #e5e5e5;">$${order.tax.toFixed(
                2
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; padding-top: 15px; border-top: 2px solid #27272a;">
              <span style="font-weight: 700; font-size: 18px; color: #e5e5e5;">Total:</span>
              <span style="color: #3b82f6; font-weight: 700; font-size: 18px;">$${order.total.toFixed(
                2
              )}</span>
            </div>
          </div>

          ${notesHtml}

          <!-- Shipping -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
            <div>
              <h3 style="color: #e5e5e5; margin: 0 0 15px; font-size: 16px;">Shipping Address</h3>
              <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #27272a;">
                <p style="margin: 5px 0; color: #a1a1aa;"><strong>${
                  shippingAddress.firstName
                } ${shippingAddress.lastName}</strong></p>
                <p style="margin: 5px 0; color: #a1a1aa;">${
                  shippingAddress.address
                }</p>
                <p style="margin: 5px 0; color: #a1a1aa;">${
                  shippingAddress.city
                }, ${shippingAddress.state} ${shippingAddress.zipCode}</p>
                <p style="margin: 5px 0; color: #a1a1aa;">${
                  shippingAddress.country
                }</p>
                <p style="margin: 5px 0; color: #a1a1aa;">📞 ${
                  shippingAddress.phone
                }</p>
              </div>
            </div>

            <div>
              <h3 style="color: #e5e5e5; margin: 0 0 15px; font-size: 16px;">Shipping Method</h3>
              <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #27272a;">
                <p style="margin: 5px 0; color: #a1a1aa;"><strong>${
                  order.shippingMethod.name
                }</strong></p>
                <p style="margin: 5px 0; color: #a1a1aa;">Estimated Delivery: ${
                  order.shippingMethod.delivery
                }</p>
                <p style="margin: 5px 0; color: #a1a1aa;">Shipping Cost: ${
                  order.shippingCost === 0
                    ? "Free"
                    : `$${order.shippingCost.toFixed(2)}`
                }</p>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #27272a;">
            <h3 style="color: #e5e5e5; margin: 0 0 15px; font-size: 16px;">Payment Information</h3>
            <p style="margin: 5px 0; color: #a1a1aa;"><strong>Payment Method:</strong> ${
              order.paymentMethod
            }</p>
            <p style="margin: 5px 0; color: #a1a1aa;"><strong>Payment Status:</strong> <span style="color: #22c55e; font-weight: 600;">Completed</span></p>
          </div>

          <!-- Next Steps -->
          <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid #27272a;">
            <h3 style="color: #e5e5e5; margin: 0 0 15px;">What's Next?</h3>
            <p style="color: #a1a1aa; margin: 0 0 20px;">
              We'll send you another email when your order ships. You can also check your order status anytime in your account.
            </p>
            <a href="${process.env.FRONTEND_URL}/orders" 
               style="display: inline-block; background-color: #3b82f6; color: #fff; 
                      padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Order Details
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #111; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #222;">
          <p style="color: #71717a; margin: 0; font-size: 14px;">
            Thank you for shopping with ShopSphere!<br>
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
    `;

    return { html, attachments };
  },
};

export async function sendEmail(to, subject, html, attachments = []) {
  try {
    await transporter.sendMail({
      from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
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
