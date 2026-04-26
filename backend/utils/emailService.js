const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Email to customer when booking is created
const sendBookingConfirmationToCustomer = async (customerEmail, customerName, bookingDetails) => {
  try {
    await transporter.sendMail({
      from: `"GlamourFind 💄" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: "✅ Booking Confirmed — GlamourFind",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf2f8; padding: 32px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #db2777; font-size: 28px;">💄 GlamourFind</h1>
            <p style="color: #6b7280; font-size: 14px;">Beauty at your fingertips</p>
          </div>
          
          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-bottom: 8px;">Hi ${customerName}! 👋</h2>
            <p style="color: #6b7280;">Your appointment has been booked successfully. Here are your details:</p>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #db2777; margin-bottom: 16px;">📋 Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">💄 Salon</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.salonName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">💅 Service</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.service}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">📅 Date</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">🕐 Time</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">📍 Location</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.salonLocation}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: center;">
            <p style="color: #16a34a; font-weight: 700; margin: 0;">⏳ Status: Pending Confirmation from Salon</p>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 13px;">
            <p>You'll receive another email once the salon confirms your booking.</p>
            <p style="margin-top: 8px;">© 2024 GlamourFind — Pakistan's #1 Beauty Platform 💄</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Booking confirmation email sent to customer");
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

// 2. Email to salon owner when new booking arrives
const sendNewBookingNotificationToOwner = async (ownerEmail, ownerName, bookingDetails) => {
  try {
    await transporter.sendMail({
      from: `"GlamourFind 💄" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: "🔔 New Booking Request — GlamourFind",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf2f8; padding: 32px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #db2777; font-size: 28px;">💄 GlamourFind</h1>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h2 style="color: #1f2937;">Hi ${ownerName}! 🎉</h2>
            <p style="color: #6b7280;">You have a new booking request for <strong>${bookingDetails.salonName}</strong>. Please confirm or cancel it from your dashboard.</p>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #db2777; margin-bottom: 16px;">📋 Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">👤 Customer</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.customerName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">📧 Email</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.customerEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">💅 Service</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.service}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">📅 Date</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">🕐 Time</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.timeSlot}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; background: white; border-radius: 12px; padding: 20px;">
            <p style="color: #6b7280; margin-bottom: 12px;">Login to your dashboard to manage this booking</p>
            <a href="https://beauty-salon-platform.vercel.app/owner-dashboard" 
               style="background: linear-gradient(135deg, #db2777, #9d174d); color: white; padding: 12px 32px; border-radius: 25px; text-decoration: none; font-weight: 700;">
              Go to Dashboard →
            </a>
          </div>
        </div>
      `,
    });
    console.log("✅ New booking notification sent to owner");
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

// 3. Email to customer when booking status changes (confirmed or cancelled)
const sendBookingStatusUpdateToCustomer = async (customerEmail, customerName, bookingDetails, newStatus) => {
  const isConfirmed = newStatus === "confirmed";
  try {
    await transporter.sendMail({
      from: `"GlamourFind 💄" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `${isConfirmed ? "✅ Booking Confirmed" : "❌ Booking Cancelled"} — GlamourFind`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf2f8; padding: 32px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #db2777; font-size: 28px;">💄 GlamourFind</h1>
          </div>

          <div style="background: ${isConfirmed ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isConfirmed ? '#86efac' : '#fca5a5'}; border-radius: 12px; padding: 24px; margin-bottom: 20px; text-align: center;">
            <p style="font-size: 48px; margin: 0;">${isConfirmed ? '🎉' : '😔'}</p>
            <h2 style="color: ${isConfirmed ? '#16a34a' : '#dc2626'}; margin-top: 12px;">
              ${isConfirmed ? 'Booking Confirmed!' : 'Booking Cancelled'}
            </h2>
            <p style="color: #6b7280;">
              Hi ${customerName}, your booking at <strong>${bookingDetails.salonName}</strong> has been 
              ${isConfirmed ? 'confirmed! We look forward to seeing you 💅' : 'cancelled by the salon. We apologize for the inconvenience.'}
            </p>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #db2777; margin-bottom: 16px;">📋 Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">💅 Service</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.service}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fce7f3;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">📅 Date</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">🕐 Time</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: 700;">${bookingDetails.timeSlot}</td>
              </tr>
            </table>
          </div>

          ${isConfirmed ? `
          <div style="background: white; border-radius: 12px; padding: 20px; text-align: center;">
            <p style="color: #6b7280; margin-bottom: 12px;">View your bookings anytime</p>
            <a href="https://beauty-salon-platform.vercel.app/my-bookings" 
               style="background: linear-gradient(135deg, #db2777, #9d174d); color: white; padding: 12px 32px; border-radius: 25px; text-decoration: none; font-weight: 700;">
              My Bookings →
            </a>
          </div>` : ''}

          <div style="text-align: center; color: #9ca3af; font-size: 13px; margin-top: 20px;">
            <p>© 2024 GlamourFind — Pakistan's #1 Beauty Platform 💄</p>
          </div>
        </div>
      `,
    });
    console.log(`✅ Status update email sent to customer (${newStatus})`);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

module.exports = {
  sendBookingConfirmationToCustomer,
  sendNewBookingNotificationToOwner,
  sendBookingStatusUpdateToCustomer,
};