// --- 1. SETUP & IMPORTS ---
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');
const MongoStore = require('connect-mongo');
const cors = require('cors'); 
// Explicitly require mongoose
const mongoose = require('mongoose'); 
const { User, Order, AgentShop, Withdrawal } = require('./database.js'); 

const app = express();
const PORT = process.env.PORT || 10000;

// --- CONFIGURATION ---
const AGENT_FEE_GHS = 20.00;
const DATAPACKS_BASE_URL = 'https://datapacks.shop/api.php'; 

// ✅ NETWORK MAPPING
const NETWORK_MAP = { 
    'MTN': 'MTN', 
    'AirtelTigo': 'AT', 
    'Telecel': 'TELECEL' 
};

// PRICING (Hardcoded)
const PRICING = {
    RETAIL: { 
        "MTN": [
            { id: '1GB', name: '1GB', price: 6.00 }, { id: '2GB', name: '2GB', price: 11.00 },
            { id: '3GB', name: '3GB', price: 18.00 }, { id: '4GB', name: '4GB', price: 23.00 }, { id: '5GB', name: '5GB', price: 30.00 },
            { id: '6GB', name: '6GB', price: 36.00 }, { id: '7GB', name: '7GB', price: 39.00 }, { id: '8GB', name: '8GB', price: 43.00 },
            { id: '10GB', name: '10GB', price: 49.00 }, { id: '15GB', name: '15GB', price: 75.00 }, { id: '20GB', name: '20GB', price: 100.00 }, 
            { id: '25GB', name: '25GB', price: 128.00 }, { id: '30GB', name: '30GB', price: 150.00 }, { id: '40GB', name: '40GB', price: 195.00 },
            { id: '50GB', name: '50GB', price: 248.00 }
        ],
        "AirtelTigo": [
            { id: '1GB', name: '1GB', price: 6.00 }, { id: '2GB', name: '2GB', price: 10.00 }, { id: '3GB', name: '3GB', price: 14.00 },  
            { id: '4GB', name: '4GB', price: 22.00 }, { id: '5GB', name: '5GB', price: 26.00 }, { id: '6GB', name: '6GB', price: 30.00 },  
            { id: '7GB', name: '7GB', price: 34.00 }, { id: '8GB', name: '8GB', price: 38.00 }, { id: '9GB', name: '9GB', price: 40.00 },  
            { id: '10GB', name: '10GB', price: 49.00 }, { id: '12GB', name: '12GB', price: 53.00 }, { id: '15GB', name: '15GB', price: 61.00 },
            { id: '20GB', name: '20GB', price: 85.00 }
        ],
        "Telecel": [
            { id: '5GB', name: '5GB', price: 29.00 }, { id: '10GB', name: '10GB', price: 49.20 }, { id: '15GB', name: '15GB', price: 80.00 }, 
            { id: '20GB', name: '20GB', price: 100.00 }, { id: '25GB', name: '25GB', price: 120.00 }, { id: '30GB', name: '30GB', price: 123.00 },
            { id: '40GB', name: '40GB', price: 175.50 }, { id: '50GB', name: '50GB', price: 205.00 }, { id: '100GB', name: '100GB', price: 400.00}
        ]
    },
    WHOLESALE: { 
        "MTN": [
            { id: '1GB', name: '1GB', price: 4.90 }, { id: '2GB', name: '2GB', price: 9.90 }, { id: '3GB', name: '3GB', price: 14.70 }, 
            { id: '4GB', name: '4GB', price: 20.00 }, { id: '5GB', name: '5GB', price: 24.60 }, { id: '6GB', name: '6GB', price: 28.00 }, 
            { id: '8GB', name: '8GB', price: 36.00 }, { id: '10GB', name: '10GB', price: 43.80 }, { id: '15GB', name: '15GB', price: 64.00 },
            { id: '20GB', name: '20GB', price: 85.00 }, { id: '25GB', name: '25GB', price: 105.00 }, { id: '30GB', name: '30GB', price: 124.50 },
            { id: '40GB', name: '40GB', price: 165.00 }, { id: '50GB', name: '50GB', price: 198.00 }
        ],
        "AirtelTigo": [
            { id: '1GB', name: '1GB', price: 4.00 }, { id: '2GB', name: '2GB', price: 8.00 }, { id: '3GB', name: '3GB', price: 12.00 },  
            { id: '4GB', name: '4GB', price: 16.00 }, { id: '5GB', name: '5GB', price: 20.00 }, { id: '6GB', name: '6GB', price: 24.00 },  
            { id: '7GB', name: '7GB', price: 27.90 }, { id: '8GB', name: '8GB', price: 32.00 }, { id: '9GB', name: '9GB', price: 36.00 },  
            { id: '10GB', name: '10GB', price: 42.00 }, { id: '12GB', name: '12GB', price: 50.00 }, { id: '15GB', name: '15GB', price: 61.30 },
            { id: '20GB', name: '20GB', price: 82.10 }
        ],
        "Telecel": [
            { id: '5GB', name: '5GB', price: 23.00 }, { id: '10GB', name: '10GB', price: 43.00 }, { id: '15GB', name: '15GB', price: 62.20 }, 
            { id: '20GB', name: '20GB', price: 83.00 }, { id: '25GB', name: '25GB', price: 103.00 }, { id: '30GB', name: '30GB', price: 123.00 },
            { id: '40GB', name: '40GB', price: 155.00 }, { id: '50GB', name: '50GB', price: 195.00 }, { id: '100GB', name: '100GB', price: 400.00}
        ]
    }
};

// --- 2. MIDDLEWARE ---
app.set('trust proxy', 1); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI, 
        ttl: 24 * 60 * 60,
        autoRemove: 'native'
    }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 Days
    } 
}));

app.use(express.static(path.join(__dirname, 'client/dist')));

// --- 3. ROUTES ---

// AUTH
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
        const exists = await User.findOne({ $or: [{ username }, { email }] });
        if (exists) return res.status(409).json({ message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, walletBalance: 0, payoutWalletBalance: 0, role: 'Client' });
        req.session.user = { id: newUser._id, username, role: 'Client' };
        res.status(201).json({ message: 'Account created!', user: req.session.user });
    } catch (e) { res.status(500).json({ message: `Server Error: ${e.message}` }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' });
        req.session.user = { id: user._id, username: user.username, role: user.role };
        res.json({ message: 'Logged in', role: user.role, user: req.session.user });
    } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

app.get('/api/user-info', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'No session' });
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const shop = await AgentShop.findOne({ userId: user._id });
        if (req.session.user.role !== user.role) req.session.user.role = user.role;
        res.json({ 
            username: user.username, 
            email: user.email, 
            walletBalance: user.walletBalance, 
            payoutWalletBalance: user.payoutWalletBalance, 
            role: user.role,
            shopId: shop ? shop.shopId : null
        });
    } catch (e) { res.status(500).json({ error: 'Db error' }); }
});

// AGENT UPGRADE
app.post('/api/upgrade-agent', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Login required' });
    const { reference } = req.body;
    try {
        const paystackRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });
        const data = paystackRes.data.data;
        if (data.status === 'success' && data.amount >= (AGENT_FEE_GHS * 100)) {
            await User.findByIdAndUpdate(req.session.user.id, { role: 'Agent' });
            req.session.user.role = 'Agent'; 
            res.json({ success: true, message: 'Upgraded to Agent successfully!' });
        } else { res.status(400).json({ message: 'Payment verification failed.' }); }
    } catch (e) { res.status(500).json({ message: 'Verification error' }); }
});

// TOPUP
app.post('/api/wallet/fund', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Login required' });
    const { reference, amount } = req.body; 
    try {
        const paystackRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });
        const data = paystackRes.data.data;
        
        if (data.status === 'success' && (data.amount / 100) >= amount) {
            const exists = await Order.findOne({ reference });
            if (exists) return res.status(400).json({ message: 'Transaction already processed' });

            const user = await User.findById(req.session.user.id);
            user.walletBalance += (amount * 100); 
            await user.save();
            
            await Order.create({
                userId: user._id, reference: reference, phoneNumber: 'Wallet', network: 'WALLET',
                dataPlan: 'Wallet Funding', amount: amount, status: 'topup_successful', paymentMethod: 'paystack'
            });
            res.json({ success: true, message: 'Wallet funded!', newBalance: user.walletBalance });
        } else { res.status(400).json({ message: 'Payment verification failed.' }); }
    } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// ✅ HELPER: Send Data Logic
async function processDataSending(network, planId, phone, orderRef) {
    const apiNetwork = NETWORK_MAP[network]; 
    const cleanCapacity = parseInt(planId.replace(/[A-Za-z]/g, '')); 

    console.log(`Sending to Datapacks (${network} - ${cleanCapacity}GB) for ${phone}...`);

    try {
        const apiResponse = await axios.get(DATAPACKS_BASE_URL, {
            params: {
                action: 'order',
                network: apiNetwork,
                capacity: cleanCapacity,
                recipient: phone,
                client_ref: orderRef
            },
            headers: { 
                'Authorization': `Bearer ${process.env.DATAPACKS_TOKEN}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://datapacks.shop/',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive'
            }
        });

        const result = apiResponse.data;

        if (typeof result === 'string' && result.includes('<!DOCTYPE html>')) {
             console.error("Blocked by Anti-Bot Protection");
             return { success: false, error: 'Provider Blocked Connection (Anti-Bot). Contact Provider Support.' };
        }

        console.log("Datapacks Response:", result);
        
        if (result && Array.isArray(result.results) && result.results.length > 0) {
            return { success: true, apiReference: result.results[0].ref };
        } else {
            return { success: false, error: result.message || JSON.stringify(result) };
        }

    } catch (err) {
        console.error("Datapacks API Error Details:", err.response ? err.response.data : err.message);
        if (err.response && err.response.status === 403) return { success: false, error: 'Provider Access Denied (403). Contact Admin.' };
        if (err.response && err.response.status === 405) return { success: false, error: 'Provider Error: Method Not Allowed' };
        return { success: false, error: 'Provider Connection Failed' };
    }
}

// --- WALLET PURCHASE ---
app.post('/api/purchase', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Login required' });
    const { network, planId, phone, shopId } = req.body;
    const userId = req.session.user.id;

    try {
        const user = await User.findById(userId);
        const priceList = (user.role === 'Agent' || user.role === 'Admin') ? PRICING.WHOLESALE : PRICING.RETAIL;
        
        let finalPrice = 0;
        let planName = '';
        let commission = 0;
        let agentId = null;

        if (shopId && user.role === 'Client') {
             const shop = await AgentShop.findOne({ shopId });
             if (shop) {
                 const basePlan = PRICING.WHOLESALE[network]?.find(p => p.id === planId);
                 if (basePlan) {
                     const customPrice = shop.customPrices[planId];
                     finalPrice = customPrice ? parseFloat(customPrice) : basePlan.price;
                     planName = basePlan.name;
                     commission = finalPrice - basePlan.price;
                     agentId = shop.userId;
                 }
             }
        }

        if (finalPrice === 0) {
            const plan = priceList[network]?.find(p => p.id === planId);
            if (!plan) return res.status(400).json({ message: 'Invalid plan' });
            finalPrice = plan.price;
            planName = plan.name;
        }

        const costPesewas = Math.round(finalPrice * 100);
        if (user.walletBalance < costPesewas) return res.status(400).json({ message: 'Insufficient wallet balance' });

        const ref = `ORD-${Date.now()}`;
        const newOrder = await Order.create({
            userId: user._id, reference: ref, phoneNumber: phone, network: network, 
            dataPlan: planName, amount: finalPrice, status: 'PROCESSING', paymentMethod: 'wallet',
            shopId: shopId || 'AJEnterprise', profit: commission > 0 ? commission : 0
        });

        user.walletBalance -= costPesewas;
        await user.save();

        const result = await processDataSending(network, planId, phone, ref);

        if (result.success === true) { 
            newOrder.status = 'data_sent';
            if(result.apiReference) newOrder.reference = result.apiReference; 
            await newOrder.save();
            if (agentId && commission > 0) await User.findByIdAndUpdate(agentId, { $inc: { payoutWalletBalance: Math.floor(commission * 100) } });
            res.json({ status: 'success', message: 'Data sent successfully!' });
        } else {
            console.error("Purchase Failed:", result.error);
            user.walletBalance += costPesewas; 
            await user.save();
            newOrder.status = 'data_failed'; 
            await newOrder.save();
            res.status(500).json({ message: `Failed: ${result.error}. Wallet Refunded.` });
        }
    } catch (error) { 
        console.error("System Error:", error);
        res.status(500).json({ message: 'System error.' }); 
    }
});

// --- DIRECT/PUBLIC PURCHASE ---
app.post('/api/purchase-direct', async (req, res) => {
    const { network, planId, phone, reference, shopId } = req.body;
    try {
        const paystackRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });
        const data = paystackRes.data.data;
        if (data.status !== 'success') return res.status(400).json({ message: "Payment verification failed" });

        const paidAmount = data.amount / 100;
        let planCost = 0;
        let planName = '';
        let commission = 0;
        let agentId = null;

        if (shopId) {
            const shop = await AgentShop.findOne({ shopId });
            if (shop) {
                const wholesalePlan = PRICING.WHOLESALE[network]?.find(p => p.id === planId);
                if (!wholesalePlan) return res.status(400).json({ message: "Invalid Plan" });
                planCost = wholesalePlan.price;
                planName = wholesalePlan.name;
                agentId = shop.userId;
                commission = paidAmount - planCost; 
            }
        } else {
            const retailPlan = PRICING.RETAIL[network]?.find(p => p.id === planId);
            if (!retailPlan) return res.status(400).json({ message: "Invalid Plan" });
            planCost = retailPlan.price;
            planName = retailPlan.name;
        }

        const newOrder = await Order.create({
            reference: reference, phoneNumber: phone, network: network,
            dataPlan: planName, amount: paidAmount, status: 'PROCESSING',
            paymentMethod: 'paystack', shopId: shopId || 'AJEnterprise',
            profit: commission > 0 ? commission : 0
        });

        const result = await processDataSending(network, planId, phone, reference);

        if (result.success === true) {
            newOrder.status = 'data_sent';
            await newOrder.save();
            if (agentId && commission > 0) await User.findByIdAndUpdate(agentId, { $inc: { payoutWalletBalance: Math.floor(commission * 100) } });
            res.json({ status: 'success', message: 'Data sent!' });
        } else {
            newOrder.status = 'data_failed';
            await newOrder.save();
            res.status(500).json({ message: `Provider Error: ${result.error}. Contact Admin.` });
        }
    } catch (e) { 
        console.error(e);
        res.status(500).json({ message: e.message }); 
    }
});

// --- AGENT SHOP ---
app.get('/api/shop-details/:shopId', async (req, res) => {
    try {
        const shop = await AgentShop.findOne({ shopId: req.params.shopId });
        if(!shop) return res.status(404).json({ message: 'Shop not found' });
        res.json({ shopName: shop.shopName, customPrices: shop.customPrices, basePrices: PRICING.WHOLESALE });
    } catch(e) { res.status(500).json({ message: 'Error' }); }
});

app.post('/api/agent/setup-shop', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Agent') return res.status(403).json({ message: 'Agents only' });
    const { shopName, shopId, customPrices } = req.body;
    try {
        let shop = await AgentShop.findOne({ userId: req.session.user.id });
        if (shop) {
            shop.shopName = shopName;
            shop.customPrices = customPrices;
            if (shopId) shop.shopId = shopId; 
            await shop.save();
        } else {
            const existing = await AgentShop.findOne({ shopId });
            if (existing) return res.status(400).json({ message: 'Shop ID taken' });
            shop = await AgentShop.create({ userId: req.session.user.id, shopId, shopName, customPrices });
            await User.findByIdAndUpdate(req.session.user.id, { shopId });
        }
        res.json({ success: true, shop });
    } catch(e) { res.status(500).json({ message: e.message }); }
});

// --- WITHDRAWALS ---
app.post('/api/withdraw', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Login required' });
    const { amount, accountNumber, accountName, network } = req.body;
    try {
        const user = await User.findById(req.session.user.id);
        const amountPesewas = amount * 100;
        if (user.payoutWalletBalance < amountPesewas) return res.status(400).json({ message: 'Insufficient payout balance' });
        user.payoutWalletBalance -= amountPesewas;
        await user.save();
        await Withdrawal.create({ userId: user._id, amount, accountNumber, accountName, network, status: 'Pending' });
        res.json({ success: true, message: 'Withdrawal request submitted' });
    } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/admin/withdrawals', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Admin') return res.status(403).json({ message: 'Unauthorized' });
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 }).populate('userId', 'username');
    res.json({ withdrawals });
});

app.post('/api/admin/approve-withdrawal', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Admin') return res.status(403).json({ message: 'Unauthorized' });
    const { id } = req.body;
    await Withdrawal.findByIdAndUpdate(id, { status: 'Paid' });
    res.json({ success: true });
});

// ADMIN: USERS
app.get('/api/admin/users', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
    try {
        const users = await User.find({}, 'username email role walletBalance payoutWalletBalance').sort({ createdAt: -1 });
        res.json({ users });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/credit-wallet', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
    const { userId, amount } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.walletBalance += (amount * 100); 
        await user.save();
        await Order.create({
            userId: user._id, reference: `ADMIN-${Date.now()}`, phoneNumber: 'N/A', network: 'WALLET',
            dataPlan: 'Admin Credit', amount: amount, status: 'topup_successful', paymentMethod: 'admin'
        });
        res.json({ success: true, message: "Wallet Credited" });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/data-plans', async (req, res) => {
    let role = 'Client';
    if (req.session.user) { try { const user = await User.findById(req.session.user.id); if (user) role = user.role; } catch (e) {} }
    const prices = (role === 'Agent' || role === 'Admin') ? PRICING.WHOLESALE : PRICING.RETAIL;
    res.json({ plans: prices, role: role });
});

app.get('/api/my-orders', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const orders = await Order.find({ userId: req.session.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
});

app.get('/api/admin/metrics', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
    try {
        const totalOrders = await Order.countDocuments({});
        const userCount = await User.countDocuments({});
        const revenueResult = await Order.aggregate([ { $match: { status: 'data_sent' } }, { $group: { _id: null, total: { $sum: "$amount" } } } ]);
        const revenue = revenueResult[0]?.total || 0;
        res.json({ revenue, totalDeposits: 0, netProfit: revenue * 0.15, totalOrders, userCount });
    } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/all-orders', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50).populate('userId', 'username');
    res.json({ orders });
});

app.post('/api/admin/update-order', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
    const { id, status } = req.body;
    await Order.findByIdAndUpdate(id, { status });
    res.json({ success: true });
});

app.get('/api/logout', (req, res) => req.session.destroy(() => res.json({ message: 'Logged out' })));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/dist', 'index.html')));


// --- 5. START SERVER & LOG IP ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    axios.get('https://api.ipify.org?format=json')
        .then(response => {
            console.log("============================================");
            console.log("🔥🔥🔥 YOUR RENDER SERVER IP IS: " + response.data.ip + " 🔥🔥🔥");
            console.log("============================================");
        })
        .catch(err => { console.error("❌ Could not check IP address:", err.message); });
});