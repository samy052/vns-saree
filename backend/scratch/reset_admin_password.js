const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function resetPassword() {
  const client = new Client({
    connectionString: "postgresql://postgres:vns-saree-database@db.ttqnklqescycrlemermb.supabase.co:5432/postgres"
  });

  try {
    await client.connect();
    
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = 'UPDATE vns_saree.customers SET password = $1, role = \'admin\' WHERE phone = $2';
    const values = [hashedPassword, '7985125755'];

    const res = await client.query(query, values);
    console.log('Password reset successfully for phone 7985125755. New password is: admin123');
    
  } catch (err) {
    console.error('Error resetting password:', err);
  } finally {
    await client.end();
  }
}

resetPassword();
