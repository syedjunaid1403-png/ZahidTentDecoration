const express = require('express');
const cors = require('cors');
const path = require('path');
const {
    saveEnquiry,
    getAllEnquiries,
    getServices,
    getGallery,
    updateEnquiryStatus
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// ==================== API ROUTES ====================

// ---------- Contact / Enquiry Form ----------
app.post('/api/contact', (req, res) => {
    try {
        const { name, phone, email, eventType, eventDate, message } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, error: 'Name is required.' });
        }
        if (!phone || !phone.trim()) {
            return res.status(400).json({ success: false, error: 'Phone number is required.' });
        }
        if (!/^[0-9]{10,15}$/.test(phone.replace(/[\s\-\+]/g, ''))) {
            return res.status(400).json({ success: false, error: 'Please enter a valid phone number.' });
        }
        if (!eventType || !eventType.trim()) {
            return res.status(400).json({ success: false, error: 'Please select an event type.' });
        }

        const result = saveEnquiry({
            name: name.trim(),
            phone: phone.trim(),
            email: email ? email.trim() : '',
            eventType: eventType.trim(),
            eventDate: eventDate || '',
            message: message ? message.trim() : ''
        });

        console.log(`📩 New enquiry from ${name} - ${phone} (${eventType})`);

        res.status(201).json({
            success: true,
            message: 'Thank you! Your enquiry has been submitted. We will call you shortly.',
            data: { id: result.id }
        });
    } catch (error) {
        console.error('❌ Error saving enquiry:', error);
        res.status(500).json({
            success: false,
            error: 'Something went wrong. Please try calling us directly.'
        });
    }
});

// ---------- Get All Enquiries (Admin) ----------
app.get('/api/enquiries', (req, res) => {
    try {
        const enquiries = getAllEnquiries();
        res.json({ success: true, data: enquiries, count: enquiries.length });
    } catch (error) {
        console.error('❌ Error fetching enquiries:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch enquiries.' });
    }
});

// ---------- Update Enquiry Status ----------
app.patch('/api/enquiries/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['new', 'contacted', 'confirmed', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status.' });
        }

        updateEnquiryStatus(id, status);
        res.json({ success: true, message: 'Status updated.' });
    } catch (error) {
        console.error('❌ Error updating enquiry:', error);
        res.status(500).json({ success: false, error: 'Failed to update.' });
    }
});

// ---------- Services API ----------
app.get('/api/services', (req, res) => {
    try {
        const services = getServices();
        res.json({ success: true, data: services });
    } catch (error) {
        console.error('❌ Error fetching services:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch services.' });
    }
});

// ---------- Gallery API ----------
app.get('/api/gallery', (req, res) => {
    try {
        const category = req.query.category || 'all';
        const gallery = getGallery(category);
        res.json({ success: true, data: gallery });
    } catch (error) {
        console.error('❌ Error fetching gallery:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch gallery.' });
    }
});

// ---------- Health Check ----------
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Zahid Tent Decorators API is running! 🎪',
        timestamp: new Date().toISOString()
    });
});

// ---------- Catch-all: Serve index.html ----------
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log('');
    console.log('  ✦ ═══════════════════════════════════════════ ✦');
    console.log('  ║                                             ║');
    console.log('  ║   🎪  Zahid Tent Decorators Server         ║');
    console.log('  ║       Managed by ZS Events & Productions   ║');
    console.log('  ║                                             ║');
    console.log(`  ║   🌐  http://localhost:${PORT}                 ║`);
    console.log('  ║   📡  API: /api/health                     ║');
    console.log('  ║                                             ║');
    console.log('  ✦ ═══════════════════════════════════════════ ✦');
    console.log('');
});
