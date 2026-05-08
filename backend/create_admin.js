const bcrypt = require("bcryptjs");
const AdminModel = require("./src/models/Admin");
const sequelize = require("./src/config/db"); 

async function createAdmin(name, email, phone, password) {
  try {
    // Ensure table exists
    await AdminModel.sync();
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await AdminModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    console.log("Admin created successfully:", admin.email);
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    process.exit();
  }
}

// Usage: node create_admin.js "Admin Name" "admin@example.com" "1234567890" "password123"
const [name, email, phone, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.log("Usage: node create_admin.js <name> <email> <phone> <password>");
  process.exit();
}

createAdmin(name, email, phone, password);
