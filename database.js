const mongoose = require('mongoose');

// --- 1. ROBUST CONNECTION SETUP ---
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ FATAL ERROR: process.env.MONGO_URI is undefined.');
  console.error('   -> Please add MONGO_URI to your Render Environment Variables.');
} else {
  mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000, // Fail fast if connection is bad
  })
  .then(() => console.log('✅ MongoDB connection successful.'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   -> Check if your IP is whitelisted in MongoDB Atlas (0.0.0.0/0)');
  });
}

// --- 2. SCHEMAS ---

// User Schema (Added payoutWalletBalance for Agents)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 0, min: 0 },       // Main Wallet (for buying)
    payoutWalletBalance: { type: Number, default: 0, min: 0 }, // Profit Wallet (for agents)
    role: { type: String, enum: ['Client', 'Agent', 'Admin'], default: 'Client' },
    shopId: { type: String, unique: true, sparse: true }, 
    createdAt: { type: Date, default: Date.now }
});

// Order Schema (Added 'role' to track Guest vs Agent vs Client orders)
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reference: { type: String, required: true, unique: true }, 
    phoneNumber: { type: String },
    network: { type: String }, // e.g., MTN, AirtelTigo
    dataPlan: { type: String, required: true }, 
    amount: { type: Number, required: true },
    status: { type: String, required: true }, // e.g., data_sent, topup_successful, failed
    paymentMethod: { type: String }, // e.g., wallet, paystack
    role: { type: String }, // 'Client', 'Agent', 'ShopClient' (Guest)
    createdAt: { type: Date, default: Date.now }
});

// Agent Shop Schema (Stores shop settings)
const agentShopSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    shopId: { type: String, required: true, unique: true }, // The URL slug (e.g., 'kofidata')
    shopName: { type: String, required: true },
    customMarkups: { 
        type: Map, 
        of: String, // Stores prices as strings/numbers map: { "1GB": "10" }
        default: {} 
    },
    createdAt: { type: Date, default: Date.now }
});

// Support Ticket Schema (New Feature)
const supportTicketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    createdAt: { type: Date, default: Date.now }
});

// --- MODELS ---
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const AgentShop = mongoose.model('AgentShop', agentShopSchema);
const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = {
    User,
    Order,
    AgentShop,
    SupportTicket,
    mongoose
};