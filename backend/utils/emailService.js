const axios = require("axios");

const sendEmail = async (toEmail, toName, subject, htmlContent) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "GlamourFind 💄", email: "glamourfind810@gmail.com" },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`✅ Email sent to ${toEmail}`);
  } catch (err) {
    console.error("❌ Email error:", err.response?.data || err.message);
  }
};

const sendBookingConfirmationToCustomer = async (customerEmail, customerName, bookingDetails) => {
  await sendEmail(
    customerEmail,
    customerName,
    "✅ Booking Confirmed — GlamourFind",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf2f8; padding: 32px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #db2777;">💄 GlamourFind</h1>
        <p style="color: #6b7280;">Beauty at your fingertips</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #1f2937;">Hi ${customerName}! 👋</h2>
        <p style="color: #6b7280;">Your appointment has been booked successfully!</p>
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
      <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 16px; text-align: center;">
        <p style="color: #16a34a; font-weight: 700; margin: 0;">⏳ Pending confirmation from salon</p>
      </div>
      <div style="text-align: center; color: #9ca3af; font-size: 13px; margin-top: 20px;">
        <p>© 2024 GlamourFind — Pakistan's #1 Beauty Platform 💄</p>
      </div>
    </div>
    `
  );
};

const sendNewBookingNotificationToOwner = async (ownerEmail, ownerName, bookingDetails) => {
  await sendEmail(
    ownerEmail,
    ownerName,
    "🔔 New Booking Request — GlamourFind",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf2f8; padding: 32px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #db2777;">💄 GlamourFind</h1>
      </div>
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #1f2937;">Hi ${ownerName}! 🎉</h2>
        <p style="color: #6b7280;">You have a new booking request for <strong>${bookingDetails.salonName}</strong>!</p>
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
        <a href="https://beauty-salon-platform.vercel.app/owner-dashboard"
           style="background: linear-gradient(135deg, #db2777, #9d174d); color: white; padding: 12px 32px; border-radius: 25px; text-decoration: none; font-weight: 700;">
          Go to Dashboard →
        </a>
      </div>
    </div>
    `
  );
};

const sendBookingStatusUpdateToCustomer = async (customerEmail, customerName, bookingDetails, newStatus) => {
  const isConfirmed = newStatus === "confirmed";
  await sendEmail(
    customerEmail,
    customerName,
    `${isConfirmed ? "✅ Booking Confirmed" : "❌ Booking Cancelled"} — GlamourFind`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdf2f8; padding: 32px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #db2777;">💄 GlamourFind</h1>
      </div>
      <div style="background: ${isConfirmed ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isConfirmed ? '#86efac' : '#fca5a5'}; border-radius: 12px; padding: 24px; margin-bottom: 20px; text-align: center;">
        <p style="font-size: 48px; margin: 0;">${isConfirmed ? '🎉' : '😔'}</p>
        <h2 style="color: ${isConfirmed ? '#16a34a' : '#dc2626'};">
          ${isConfirmed ? 'Booking Confirmed!' : 'Booking Cancelled'}
        </h2>
        <p style="color: #6b7280;">
          Hi ${customerName}, your booking at <strong>${bookingDetails.salonName}</strong> has been
          ${isConfirmed ? 'confirmed! See you soon 💅' : 'cancelled by the salon.'}
        </p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 24px;">
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
      <div style="text-align: center; color: #9ca3af; font-size: 13px; margin-top: 20px;">
        <p>© 2024 GlamourFind — Pakistan's #1 Beauty Platform 💄</p>
      </div>
    </div>
    `
  );
};

module.exports = {
  sendBookingConfirmationToCustomer,
  sendNewBookingNotificationToOwner,
  sendBookingStatusUpdateToCustomer,
};