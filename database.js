const fs = require('fs');
const path = require('path');

// const DATA_DIR = path.join(__dirname, 'data');
// const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

// // Ensure data directory exists
// if (!fs.existsSync(DATA_DIR)) {
//     fs.mkdirSync(DATA_DIR, { recursive: true });
// }

// // Initialize enquiries file if it doesn't exist
// if (!fs.existsSync(ENQUIRIES_FILE)) {
//     fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf8');
// }

// ==================== SERVICES DATA ====================
const services = [
    { id: 1, title: 'Wedding Tent Decorations', description: 'Stunning wedding tent setups with elegant draping, flowers, and lighting to make your big day magical.', icon: '🎪' },
    { id: 2, title: 'Birthday & Party Decorations', description: 'Vibrant and fun party decorations with balloons, themes, banners, and custom setups for all ages.', icon: '🎂' },
    { id: 3, title: 'Function & Event Setup', description: 'Complete event setup for engagement, haldi, mehndi, reception, and all types of social gatherings.', icon: '🎉' },
    { id: 4, title: 'Mattress & Carpet Arrangements', description: 'Comfortable mattresses, colorful carpets, and floor seating arrangements for traditional events.', icon: '🛏️' },
    { id: 5, title: 'Stage & Lighting Setup', description: 'Professional stage setups with LED lighting, chandeliers, and spotlights to create the perfect ambiance.', icon: '💡' },
    { id: 6, title: 'Custom Decoration', description: 'Have a unique vision? We create custom decorations tailored exactly to your requirements and budget.', icon: '🎨' }
];

// ==================== GALLERY DATA ====================
const gallery = [
    { id: 1, title: 'Grand Wedding Tent', category: 'wedding', image_url: 'images/hero.png' },
    { id: 2, title: 'Stage Decoration', category: 'wedding', image_url: 'images/gallery-wedding.png' },
    { id: 3, title: 'Birthday Celebration', category: 'party', image_url: 'images/gallery-birthday.png' },
    { id: 4, title: 'Traditional Function', category: 'traditional', image_url: 'images/gallery-traditional.png' },
    { id: 5, title: 'Stage & Lighting', category: 'wedding', image_url: 'images/gallery-stage.png' },
    { id: 6, title: 'Carpet Arrangement', category: 'traditional', image_url: 'images/gallery-carpet.png' }
];

// ==================== HELPER FUNCTIONS ====================

function readEnquiries() {
    return [];
}

function writeEnquiries(enquiries) {
    return true;
}

/**
 * Save a new enquiry
 */
function saveEnquiry({ name, phone, email, eventType, eventDate, message }) {
    const enquiries = readEnquiries();
    const newEnquiry = {
        id: enquiries.length > 0 ? Math.max(...enquiries.map(e => e.id)) + 1 : 1,
        name,
        phone,
        email: email || '',
        event_type: eventType,
        event_date: eventDate || '',
        message: message || '',
        status: 'new',
        created_at: new Date().toISOString()
    };
    enquiries.unshift(newEnquiry);
    writeEnquiries(enquiries);
    return { id: newEnquiry.id, success: true };
}

/**
 * Get all enquiries, newest first
 */
function getAllEnquiries() {
    return readEnquiries();
}

/**
 * Get all services
 */
function getServices() {
    return services;
}

/**
 * Get gallery items, optionally filtered by category
 */
function getGallery(category) {
    if (category && category !== 'all') {
        return gallery.filter(g => g.category === category);
    }
    return gallery;
}

/**
 * Update enquiry status
 */
function updateEnquiryStatus(id, status) {
    const enquiries = readEnquiries();
    const idx = enquiries.findIndex(e => e.id === parseInt(id));
    if (idx !== -1) {
        enquiries[idx].status = status;
        writeEnquiries(enquiries);
        return true;
    }
    return false;
}

module.exports = {
    saveEnquiry,
    getAllEnquiries,
    getServices,
    getGallery,
    updateEnquiryStatus
};
