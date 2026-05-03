const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services or SMTP
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_app_password',
  },
});

class EmailService {
  async sendOrderConfirmation(order, items) {
    const itemList = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || 'Saree'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Banaras Heritage" <${process.env.EMAIL_USER}>`,
      to: order.customer_email,
      subject: `Order Confirmed - #${order.id} | Banaras Heritage`,
      html: `
        <div style="font-family: 'Playfair Display', serif; color: #3D2817; max-width: 600px; margin: auto; border: 1px solid #D4AF37; padding: 40px; background-color: #FDFCFB;">
          <h1 style="color: #800020; text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px;">Banaras Heritage</h1>
          <p>Dear ${order.customer_name},</p>
          <p>Thank you for choosing Banaras Heritage. Your order for our handcrafted masterpiece has been confirmed.</p>
          
          <h3 style="color: #800020; margin-top: 30px;">Order Summary (#${order.id})</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead style="background-color: #FAF8F6;">
              <tr>
                <th style="text-align: left; padding: 10px;">Item</th>
                <th style="text-align: left; padding: 10px;">Qty</th>
                <th style="text-align: left; padding: 10px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 20px 10px 10px; font-weight: bold; text-align: right;">Total Amount:</td>
                <td style="padding: 20px 10px 10px; font-weight: bold; color: #800020;">₹${order.total_amount}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 40px; padding: 20px; background-color: #FAF8F6; border-radius: 8px;">
            <h4 style="margin: 0; color: #800020;">Shipping Address:</h4>
            <p style="margin: 5px 0; font-size: 14px;">
              ${order.address}, ${order.city} - ${order.pincode}<br/>
              Phone: ${order.phone}
            </p>
          </div>
          
          <p style="margin-top: 40px; font-style: italic; text-align: center; color: #D4AF37;">A new heritage begins with you.</p>
          <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">&copy; 2024 Banaras Heritage. All rights reserved.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${order.customer_email}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

module.exports = new EmailService();
