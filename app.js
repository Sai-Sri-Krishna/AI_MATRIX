/* ═══════════════════════════════════════════════════════════
   STAYBNB AI FASHION PLATFORM — app.js  (v2)
   Physics-based animations, AI interactions, real images
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── State ──────────────────────────────────────────────────────────────────────
const state = {
    activeMood: 'Confident',
    activeTone: 'fair',
    savedOutfits: new Set(),
    wardrobeCanvas: [],
    boutiqueIndex: 0,
    ecoAnimated: false,
    activeFilter: 'All',
};

// ── Mood Data ──────────────────────────────────────────────────────────────────
const MOODS = {
    Confident: {
        color: '#b47bff',
        analysis: 'Your confident energy calls for structured silhouettes, bold monochromatics, and statement accessories. Power dressing with an edge.',
        tags: ['Blazer', 'Wide-leg Trousers', 'Structured Bag', 'Block Heels'],
        radar: [0.9, 0.5, 0.6, 0.4, 0.85, 0.3, 0.7],
    },
    Calm: {
        color: '#00d4ff',
        analysis: 'Calm energy resonates with fluid fabrics, muted palettes, and minimalist silhouettes. Less is more — serene, breathable, effortless.',
        tags: ['Linen Trousers', 'Oversized Shirt', 'Canvas Tote', 'Slip-Ons'],
        radar: [0.4, 0.9, 0.5, 0.8, 0.2, 0.7, 0.6],
    },
    Playful: {
        color: '#ff6b9d',
        analysis: 'Playful spirit shines through bright patterns, mixed textures, and whimsical details. Colour-blocking and statement prints are your playground.',
        tags: ['Crop Top', 'Mini Skirt', 'Colourful Sneakers', 'Fun Earrings'],
        radar: [0.5, 0.4, 0.95, 0.3, 0.5, 0.9, 0.4],
    },
    Elegant: {
        color: '#ffd700',
        analysis: 'Sophisticated and timeless — wrap dresses, pearl accents, and monochromatic suiting. Clean lines, luxurious fabrics, quiet confidence.',
        tags: ['Wrap Dress', 'Pearl Jewellery', 'Pointed Heels', 'Silk Clutch'],
        radar: [0.6, 0.7, 0.2, 0.95, 0.4, 0.5, 0.85],
    },
    Fierce: {
        color: '#ff4466',
        analysis: 'Fierce is unapologetic — leather elements, bold cutouts, strong shoulders, and daring silhouettes. You walk in and the room changes.',
        tags: ['Leather Jacket', 'Combat Boots', 'Cutout Dress', 'Chain Belt'],
        radar: [0.95, 0.2, 0.7, 0.5, 0.9, 0.4, 0.6],
    },
    Dreamy: {
        color: '#a78bfa',
        analysis: 'Float through the day in sheer layers, pastels, and romantic ruffles. Cottagecore meets celestial — ethereal and otherworldly.',
        tags: ['Floral Midi Dress', 'Lace Overlay', 'Wedge Sandals', 'Dainty Rings'],
        radar: [0.3, 0.65, 0.75, 0.7, 0.25, 0.95, 0.5],
    },
};

// ── Skin Tone Data ─────────────────────────────────────────────────────────────
const TONES = {
    fair: {
        palettes: ['#f5e6c8', '#ffd8b5', '#f9c784', '#ffe4e1', '#d4e4bc'],
        recommendation: 'Champagne, Butter Yellow, Ivory & Dusty Rose flatter your fair undertones beautifully.',
        css1: '#f9c784', css2: '#ffe4e1', washColor: '#f9c784',
    },
    light: {
        palettes: ['#f4a460', '#deb887', '#cd853f', '#e8b86d', '#c9956c'],
        recommendation: 'Terracotta, Warm Peach, Rust & Camel enhance your light golden complexion.',
        css1: '#e8b86d', css2: '#cd853f', washColor: '#e8a87c',
    },
    medium: {
        palettes: ['#8b4513', '#a0522d', '#cd853f', '#d2691e', '#b8860b'],
        recommendation: 'Deep Cobalt, Forest Green, Burnt Sienna & Mustard elevate your warm medium skin.',
        css1: '#3b6fa0', css2: '#27ae60', washColor: '#4a7abf',
    },
    tan: {
        palettes: ['#5c2d0e', '#8b3a3a', '#2d6a4f', '#e9c46a', '#264653'],
        recommendation: 'Emerald, Coral, Deep Teal & Saffron make your tan skin absolutely luminous.',
        css1: '#27ae60', css2: '#e9c46a', washColor: '#2ecc71',
    },
    deep: {
        palettes: ['#9b59b6', '#16213e', '#f39c12', '#c0392b', '#27ae60'],
        recommendation: 'Electric Purple, Gold, Ivory & Fuchsia create stunning contrast on your deep skin.',
        css1: '#9b59b6', css2: '#f39c12', washColor: '#8e44ad',
    },
    rich: {
        palettes: ['#00d4ff', '#ffffff', '#ffd700', '#ff6b9d', '#a8edea'],
        recommendation: 'Ice Blue, Brilliant White, Gold & Coral make your rich skin absolutely radiant.',
        css1: '#00d4ff', css2: '#ffd700', washColor: '#00b8e6',
    },
};

// ── Outfit Data with Real Unsplash Photos ─────────────────────────────────────
const OUTFITS = [
    {
        name: 'Power Suit Set',
        category: 'Office / Event',
        price: '₹8,400',
        mood: 'Confident',
        eco: true,
        match: 97,
        tags: ['Tailored', 'Monochrome', 'Structured'],
        photo: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=420&q=80&fit=crop&crop=faces,upper',
        gradient: 'linear-gradient(135deg, rgba(180,123,255,0.3), rgba(0,212,255,0.2))',
    },
    {
        name: 'Celestial Midi Dress',
        category: 'Date Night',
        price: '₹5,200',
        mood: 'Dreamy',
        eco: true,
        match: 94,
        tags: ['Flowy', 'Romantic', 'Sheer'],
        photo: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=420&q=80&fit=crop&crop=faces,upper',
        gradient: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(255,107,157,0.2))',
    },
    {
        name: 'Urban Edge Look',
        category: 'Street Style',
        price: '₹6,800',
        mood: 'Fierce',
        eco: false,
        match: 89,
        tags: ['Edgy', 'Leather', 'Bold'],
        photo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=420&q=80&fit=crop&crop=faces,upper',
        gradient: 'linear-gradient(135deg, rgba(255,68,102,0.3), rgba(0,0,0,0.4))',
    },
    {
        name: 'Zen Linen Set',
        category: 'Casual / Brunch',
        price: '₹3,600',
        mood: 'Calm',
        eco: true,
        match: 92,
        tags: ['Breathable', 'Natural', 'Minimal'],
        photo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=420&q=80&fit=crop&crop=faces,upper',
        gradient: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,245,160,0.15))',
    },
    {
        name: 'Gold Gala Gown',
        category: 'Formal / Gala',
        price: '₹14,200',
        mood: 'Elegant',
        eco: false,
        match: 91,
        tags: ['Luxe', 'Flowing', 'Statement'],
        photo: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=420&q=80&fit=crop&crop=faces,upper',
        gradient: 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(180,123,255,0.2))',
    },
    {
        name: 'Neon Play Set',
        category: 'Festival / Party',
        price: '₹4,100',
        mood: 'Playful',
        eco: true,
        match: 88,
        tags: ['Vibrant', 'Crop', 'Fun'],
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=420&q=80&fit=crop&crop=faces,upper',
        gradient: 'linear-gradient(135deg, rgba(255,107,157,0.3), rgba(255,215,0,0.2))',
    },
    {
        name: 'Boho Layered Look',
        category: 'Weekend / Casual',
        price: '₹4,800',
        mood: 'Dreamy',
        eco: true,
        match: 90,
        tags: ['Boho', 'Layered', 'Earthy'],
        photo: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=420&q=80&fit=crop&crop=faces,upper',
        gradient: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(255,215,0,0.15))',
    },
    {
        name: 'Sharp Monochrome',
        category: 'Power Dressing',
        price: '₹9,600',
        mood: 'Confident',
        eco: false,
        match: 96,
        tags: ['Monochrome', 'Sharp', 'Boss'],
        photo: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=420&q=80&fit=crop&crop=faces,upper',
        gradient: 'linear-gradient(135deg, rgba(100,100,100,0.3), rgba(30,30,50,0.4))',
    },
];

// Expose for auth.js saved looks
window.OUTFITS_DATA = OUTFITS;

// ── Wardrobe Pieces ────────────────────────────────────────────────────────────
const WARDROBE_PIECES = [
    { id: 'wp1', name: 'Silk Blazer', category: 'Tops', icon: '🧥', color: '#b47bff', harmony: 3, bold: 2, occ: 4 },
    { id: 'wp2', name: 'Wide-leg Trousers', category: 'Bottoms', icon: '👖', color: '#00d4ff', harmony: 4, bold: 2, occ: 4 },
    { id: 'wp3', name: 'Floral Midi', category: 'Dresses', icon: '👗', color: '#ff6b9d', harmony: 4, bold: 3, occ: 3 },
    { id: 'wp4', name: 'Leather Jacket', category: 'Outerwear', icon: '🥻', color: '#ff4466', harmony: 2, bold: 5, occ: 2 },
    { id: 'wp5', name: 'Linen Shirt', category: 'Tops', icon: '👕', color: '#00f5a0', harmony: 5, bold: 1, occ: 3 },
    { id: 'wp6', name: 'Stiletto Heels', category: 'Footwear', icon: '👠', color: '#ffd700', harmony: 3, bold: 4, occ: 4 },
    { id: 'wp7', name: 'Canvas Sneakers', category: 'Footwear', icon: '👟', color: '#a78bfa', harmony: 3, bold: 2, occ: 2 },
    { id: 'wp8', name: 'Silk Scarf', category: 'Accessories', icon: '🧣', color: '#00d4ff', harmony: 4, bold: 3, occ: 3 },
    { id: 'wp9', name: 'Pearl Necklace', category: 'Jewellery', icon: '📿', color: '#ffd700', harmony: 4, bold: 2, occ: 5 },
    { id: 'wp10', name: 'Structured Tote', category: 'Bags', icon: '👜', color: '#b47bff', harmony: 3, bold: 2, occ: 4 },
];

// ── Boutique Data with Real Unsplash Photos ────────────────────────────────────
const BOUTIQUES = [
    {
        name: 'Aura & Thread',
        location: '📍 Bandra West, Mumbai',
        tags: ['Contemporary', 'Sustainable', 'Women'],
        rating: 4.9,
        match: 97,
        photo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=520&q=80&fit=crop',
        accentColor: '#b47bff',
        desc: 'Curated slow-fashion collections with handcrafted detailing.',
        mapUrl: 'https://www.google.com/maps/search/boutique+bandra+west+mumbai',
    },
    {
        name: 'The Gilded Edit',
        location: '📍 Khan Market, Delhi',
        tags: ['Luxury', 'Occasion Wear', 'Heritage'],
        rating: 4.8,
        match: 92,
        photo: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=520&q=80&fit=crop',
        accentColor: '#ffd700',
        desc: 'Opulent fabrics & heirloom-worthy pieces for every milestone.',
        mapUrl: 'https://www.google.com/maps/search/fashion+boutique+khan+market+delhi',
    },
    {
        name: 'Neon District',
        location: '📍 Koramangala, Bangalore',
        tags: ['Streetwear', 'Playful', 'Unisex'],
        rating: 4.7,
        match: 85,
        photo: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=520&q=80&fit=crop',
        accentColor: '#ff6b9d',
        desc: 'Bold street aesthetics for the unapologetically expressive.',
        mapUrl: 'https://www.google.com/maps/search/streetwear+boutique+koramangala+bangalore',
    },
    {
        name: 'Terra & Loom',
        location: '📍 Auroville, Pondicherry',
        tags: ['Handwoven', 'Eco-Certified', 'Artisanal'],
        rating: 5.0,
        match: 98,
        photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=520&q=80&fit=crop',
        accentColor: '#00f5a0',
        desc: 'Zero-waste studio using organic dyes & traditional loom techniques.',
        mapUrl: 'https://www.google.com/maps/search/handloom+boutique+auroville+pondicherry',
    },
    {
        name: 'Chrome & Silk',
        location: '📍 Cyber City, Gurgaon',
        tags: ['Futuristic', 'Tech-Fashion', 'Avant-garde'],
        rating: 4.6,
        match: 88,
        photo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=520&q=80&fit=crop',
        accentColor: '#00d4ff',
        desc: 'Where technology meets couture — 3D-knit and smart fabrics.',
        mapUrl: 'https://www.google.com/maps/search/fashion+boutique+cyber+city+gurgaon',
    },
];

// ── Eco Metrics ────────────────────────────────────────────────────────────────
const ECO_METRICS = [
    { icon: '💧', label: 'Water Saved', value: '12.4K', unit: 'Litres vs fast fashion', bar: 82 },
    { icon: '🌿', label: 'CO₂ Offset', value: '38', unit: 'Kg annually', bar: 76 },
    { icon: '♻️', label: 'Recycled Fibre', value: '61', unit: '% of your wardrobe', bar: 61 },
    { icon: '🌍', label: 'Ethical Score', value: '9.2', unit: 'out of 10', bar: 92 },
];

// ══════════════════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    init() {
        for (let i = 0; i < 80; i++) this.particles.push(this.createParticle());
    }
    createParticle() {
        const colors = ['rgba(180,123,255,', 'rgba(0,212,255,', 'rgba(255,107,157,', 'rgba(0,245,160,'];
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            color: colors[Math.floor(Math.random() * colors.length)],
            pulse: Math.random() * Math.PI * 2,
        };
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.pulse += 0.02;
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            const o = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${p.color}${o})`;
            this.ctx.fill();
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// MOOD RADAR CHART
// ══════════════════════════════════════════════════════════════════════════════
class MoodRadar {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cx = canvas.width / 2;
        this.cy = canvas.height / 2;
        this.radius = 130;
        this.points = 7;
        this.currentData = [...MOODS['Confident'].radar];
        this.targetData = [...this.currentData];
        this.animating = false;
        this.drawLoop();
    }
    setData(moodKey) {
        this.targetData = [...MOODS[moodKey].radar];
        if (!this.animating) this.drawLoop();
    }
    drawLoop() {
        this.animating = true;
        let changed = false;
        for (let i = 0; i < this.points; i++) {
            const diff = this.targetData[i] - this.currentData[i];
            if (Math.abs(diff) > 0.002) { this.currentData[i] += diff * 0.1; changed = true; }
            else { this.currentData[i] = this.targetData[i]; }
        }
        this.draw();
        if (changed) requestAnimationFrame(() => this.drawLoop());
        else this.animating = false;
    }
    draw() {
        const { ctx, cx, cy, radius, points } = this;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let ring = 1; ring <= 4; ring++) {
            const r = (radius / 4) * ring;
            ctx.beginPath();
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
                i === 0 ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
                    : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
            }
            ctx.closePath();
            ctx.strokeStyle = ring === 4 ? 'rgba(180,123,255,0.2)' : 'rgba(180,123,255,0.07)';
            ctx.lineWidth = 1; ctx.stroke();
        }
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
            ctx.strokeStyle = 'rgba(180,123,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const idx = i % points;
            const angle = (idx / points) * Math.PI * 2 - Math.PI / 2;
            const r = radius * this.currentData[idx];
            i === 0 ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
                : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        }
        ctx.closePath();
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, 'rgba(180,123,255,0.45)');
        grad.addColorStop(1, 'rgba(0,212,255,0.08)');
        ctx.fillStyle = grad; ctx.fill();
        ctx.strokeStyle = '#b47bff'; ctx.lineWidth = 2; ctx.stroke();
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
            const r = radius * this.currentData[i];
            ctx.beginPath();
            ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), 4, 0, Math.PI * 2);
            ctx.fillStyle = '#b47bff'; ctx.fill();
            ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1.5; ctx.stroke();
        }
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// ECO RING CHART
// ══════════════════════════════════════════════════════════════════════════════
class EcoRing {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.progress = 0;
        this.target = 0.84;
        this.draw();
        this.observe();
    }
    observe() {
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !state.ecoAnimated) {
                state.ecoAnimated = true;
                this.animateTo(0.84);
            }
        }, { threshold: 0.3 });
        obs.observe(this.canvas);
    }
    animateTo(target) {
        this.target = target;
        const step = () => {
            this.progress += (this.target - this.progress) * 0.05;
            this.draw();
            if (Math.abs(this.target - this.progress) > 0.001) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
    draw() {
        const { ctx, canvas, progress } = this;
        const cx = canvas.width / 2, cy = canvas.height / 2, R = 120;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const segs = [
            { v: 0.82, color: '#00d4ff' },
            { v: 0.76, color: '#00f5a0' },
            { v: 0.61, color: '#b47bff' },
            { v: 0.92, color: '#ffd700' },
        ];
        const gap = 0.06, total = segs.length;
        const arcPer = (1 - total * gap) / total;
        segs.forEach((seg, i) => {
            const start = i * (arcPer + gap) * Math.PI * 2 - Math.PI / 2;
            const end = start + arcPer * Math.PI * 2;
            const filled = start + (end - start) * Math.min(progress / this.target, 1) * seg.v;
            ctx.beginPath(); ctx.arc(cx, cy, R, start, end);
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, R, start, filled);
            ctx.strokeStyle = seg.color; ctx.lineWidth = 14; ctx.lineCap = 'round';
            ctx.shadowColor = seg.color; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0;
        });
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// COUNTER ANIMATION
// ══════════════════════════════════════════════════════════════════════════════
function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isFloat = String(target).includes('.');
        const start = performance.now();
        const update = now => {
            const t = Math.min((now - start) / 2000, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = isFloat ? (target * eased).toFixed(1) : Math.floor(target * eased);
            if (t < 1) requestAnimationFrame(update);
            else el.textContent = isFloat ? target.toFixed(1) : target;
        };
        requestAnimationFrame(update);
    });
}
const heroStatObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); heroStatObs.disconnect(); }
}, { threshold: 0.5 });

// ══════════════════════════════════════════════════════════════════════════════
// CURSOR GLOW
// ══════════════════════════════════════════════════════════════════════════════
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = -100, mouseY = -100, curX = -100, curY = -100;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
(function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    if (cursorGlow) { cursorGlow.style.left = curX + 'px'; cursorGlow.style.top = curY + 'px'; }
    requestAnimationFrame(animateCursor);
})();

// ══════════════════════════════════════════════════════════════════════════════
// NAV SCROLL
// ══════════════════════════════════════════════════════════════════════════════
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 50);
    const sections = ['mood', 'outfits', 'wardrobe', 'sustainability', 'boutiques'];
    let current = '';
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) current = id;
    });
    document.querySelectorAll('.nav-link').forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`)
    );
});

// ══════════════════════════════════════════════════════════════════════════════
// MOOD CHIPS
// ══════════════════════════════════════════════════════════════════════════════
let moodRadarChart;

const moodGrid = document.getElementById('moodGrid');
moodGrid?.addEventListener('click', e => {
    const chip = e.target.closest('.mood-chip');
    if (!chip) return;
    document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.activeMood = chip.dataset.mood;
    updateMoodUI(chip.dataset.mood);
});

function updateMoodUI(mood) {
    const data = MOODS[mood];
    const analysisText = document.getElementById('analysisText');
    const analysisTags = document.getElementById('analysisTags');
    const currentMoodEl = document.getElementById('currentMood');
    if (analysisText) {
        analysisText.style.opacity = '0'; analysisText.style.transform = 'translateY(8px)';
        setTimeout(() => {
            analysisText.textContent = data.analysis;
            if (analysisTags) analysisTags.innerHTML = data.tags.map(t => `<span class="a-tag">${t}</span>`).join('');
            analysisText.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            analysisText.style.opacity = '1'; analysisText.style.transform = 'translateY(0)';
        }, 220);
    }
    if (currentMoodEl) currentMoodEl.textContent = mood;
    const moodTag = document.getElementById('moodTag');
    if (moodTag) moodTag.style.borderColor = data.color;
    if (moodRadarChart) moodRadarChart.setData(mood);
    // Refilter cards if active filter is "All"
    if (state.activeFilter === 'All') renderOutfitCards('All');
}

// ══════════════════════════════════════════════════════════════════════════════
// SKIN TONE
// ══════════════════════════════════════════════════════════════════════════════
document.getElementById('toneSwatches')?.addEventListener('click', e => {
    const sw = e.target.closest('.swatch');
    if (!sw) return;
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    state.activeTone = sw.dataset.tone;
    updateToneUI(sw.dataset.tone);
});

function updateToneUI(tone) {
    const data = TONES[tone];
    data.palettes.forEach((c, i) => {
        const el = document.getElementById(`palette-${i}`);
        if (el) el.style.background = c;
    });
    const rec = document.getElementById('toneRec');
    if (rec) {
        rec.style.opacity = '0';
        setTimeout(() => { rec.textContent = data.recommendation; rec.style.opacity = '1'; rec.style.transition = 'opacity 0.4s'; }, 180);
    }
    // Color wash on photo
    const wash = document.getElementById('toneColorWash');
    if (wash) wash.style.background = data.washColor;
    // Glow
    const glow = document.getElementById('mannequinGlow');
    if (glow) glow.style.background = `radial-gradient(circle, ${data.washColor}50 0%, transparent 70%)`;
}

function initTonePalette() {
    TONES.fair.palettes.forEach((c, i) => {
        const el = document.getElementById(`palette-${i}`);
        if (el) el.style.background = c;
    });
}

// ══════════════════════════════════════════════════════════════════════════════
// OUTFIT CARDS
// ══════════════════════════════════════════════════════════════════════════════
function renderOutfitCards(filter) {
    state.activeFilter = filter || 'All';
    const grid = document.getElementById('outfitGrid');
    if (!grid) return;

    let outfits = OUTFITS;
    if (filter === 'Eco') outfits = OUTFITS.filter(o => o.eco);
    else if (filter && filter !== 'All') outfits = OUTFITS.filter(o => o.mood === filter);

    grid.innerHTML = '';

    if (outfits.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(240,232,255,0.3);padding:60px 20px;">
      <div style="font-size:32px;margin-bottom:12px">♡</div>
      No outfits match this filter yet.
    </div>`;
        return;
    }

    outfits.forEach((outfit, idx) => {
        const globalIdx = OUTFITS.indexOf(outfit);
        const isSaved = state.savedOutfits.has(globalIdx);

        const card = document.createElement('div');
        card.className = 'outfit-card';
        card.id = `outfit-card-${globalIdx}`;
        card.innerHTML = `
      <div class="outfit-card-visual" style="background:${outfit.gradient}">
        <img class="outfit-img" 
          src="${outfit.photo}" 
          alt="${outfit.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        />
        ${outfit.eco ? '<div class="outfit-eco-badge" title="Eco-Friendly">🌱</div>' : ''}
        <div class="outfit-match-badge">${outfit.match}% Match</div>
      </div>
      <div class="outfit-card-body">
        <div class="outfit-card-name">${outfit.name}</div>
        <div class="outfit-card-meta">${outfit.category} · ${outfit.mood}</div>
        <div class="outfit-card-tags">
          ${outfit.tags.map(t => `<span class="outfit-tag">${t}</span>`).join('')}
        </div>
        <div class="outfit-card-footer">
          <span class="outfit-price">${outfit.price}</span>
          <button class="outfit-save-btn ${isSaved ? 'saved' : ''}" data-idx="${globalIdx}" aria-label="Save outfit">
            ${isSaved ? '♥' : '♡'}
          </button>
        </div>
      </div>
    `;

        // 3D tilt
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(800px) rotateX(${-(y / rect.height) * 12}deg) rotateY(${(x / rect.width) * 12}deg) translateY(-12px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
            card.style.transform = '';
        });
        card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.15s ease'; });

        // Save button
        card.querySelector('.outfit-save-btn').addEventListener('click', e => {
            e.stopPropagation();
            const btn = e.currentTarget;
            const i = parseInt(btn.dataset.idx);
            if (state.savedOutfits.has(i)) {
                state.savedOutfits.delete(i);
                btn.textContent = '♡'; btn.classList.remove('saved');
                showToast('💔 Removed from wardrobe');
            } else {
                state.savedOutfits.add(i);
                btn.textContent = '♥'; btn.classList.add('saved');
                showToast(`✨ "${OUTFITS[i].name}" saved!`);
            }
            // Update profile saved count if open
            const pCount = document.getElementById('pSavedCount');
            if (pCount) pCount.textContent = state.savedOutfits.size;
        });

        grid.appendChild(card);
    });

    // Trigger scroll reveal
    setTimeout(initScrollReveal, 80);
}

// ── Outfit filter bar ──────────────────────────────────────────────────────────
document.getElementById('outfitFilterBar')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderOutfitCards(btn.dataset.filter);
});

// ══════════════════════════════════════════════════════════════════════════════
// WARDROBE MIXING BOARD
// ══════════════════════════════════════════════════════════════════════════════
const MIX_FEEDBACK = {
    0: 'Add pieces to get your AI style score',
    1: 'Good start! Add more to increase harmony.',
    2: 'Nice pairing! Your look is taking shape.',
    3: 'Great combination! Strong mood alignment.',
    4: 'Almost perfect — one more could elevate this.',
    5: 'Iconic. This is a complete, styled look! ✦',
};

function renderWardrobePieces() {
    const container = document.getElementById('wardrobePieces');
    if (!container) return;
    container.innerHTML = WARDROBE_PIECES.map(p => `
    <div class="wardrobe-piece" draggable="true" data-id="${p.id}" id="wp-${p.id}">
      <div class="piece-icon" style="border:1px solid ${p.color}30;color:${p.color}">${p.icon}</div>
      <div>
        <div class="piece-name">${p.name}</div>
        <div class="piece-category">${p.category}</div>
      </div>
    </div>
  `).join('');

    container.querySelectorAll('.wardrobe-piece').forEach(el => {
        el.addEventListener('dragstart', e => {
            e.dataTransfer.setData('pieceId', el.dataset.id);
            el.style.opacity = '0.5';
        });
        el.addEventListener('dragend', () => { el.style.opacity = ''; });
    });
}

function initWardrobeCanvas() {
    const canvas = document.getElementById('wardrobeCanvas');
    const placeholder = document.getElementById('canvasPlaceholder');
    if (!canvas) return;

    canvas.addEventListener('dragover', e => { e.preventDefault(); canvas.classList.add('drag-over'); });
    canvas.addEventListener('dragleave', () => canvas.classList.remove('drag-over'));
    canvas.addEventListener('drop', e => {
        e.preventDefault();
        canvas.classList.remove('drag-over');
        const id = e.dataTransfer.getData('pieceId');
        if (!id) return;
        const piece = WARDROBE_PIECES.find(p => p.id === id);
        if (!piece) return;
        if (state.wardrobeCanvas.find(p => p.id === id)) { showToast('Already in your mix!'); return; }
        state.wardrobeCanvas.push(piece);
        if (placeholder) placeholder.style.display = 'none';
        addPieceToCanvas(piece, canvas, placeholder);
        updateMixScore();
    });
}

function addPieceToCanvas(piece, canvas, placeholder) {
    const el = document.createElement('div');
    el.className = 'canvas-dropped-piece';
    el.dataset.id = piece.id;
    el.style.setProperty('--p-color', piece.color);
    el.innerHTML = `
    <div class="piece-icon" style="font-size:20px;border:1px solid ${piece.color}40;">${piece.icon}</div>
    <span>${piece.name}</span>
    <button class="remove-piece" title="Remove">×</button>
  `;
    el.querySelector('.remove-piece').addEventListener('click', () => {
        state.wardrobeCanvas = state.wardrobeCanvas.filter(p => p.id !== piece.id);
        el.style.transform = 'scale(0)'; el.style.opacity = '0';
        el.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            el.remove();
            if (state.wardrobeCanvas.length === 0 && placeholder) placeholder.style.display = 'flex';
            updateMixScore();
        }, 300);
    });
    canvas.appendChild(el);
}

function updateMixScore() {
    const pieces = state.wardrobeCanvas;
    const count = pieces.length;
    if (count === 0) {
        setBar('harmonyBar', 0); setBar('boldBar', 0); setBar('occasionBar', 0);
        setVal('harmonyVal', 0); setVal('boldVal', 0); setVal('occasionVal', 0);
        setScoreRing(0);
        setVal('mixScoreNum', 0);
        const fb = document.getElementById('mixAiFeedback');
        if (fb) fb.textContent = MIX_FEEDBACK[0];
        return;
    }
    const sum = (key) => pieces.reduce((acc, p) => acc + (p[key] || 0), 0);
    const avg = (key) => Math.round((sum(key) / count) * (count > 1 ? 1.2 : 1) * 20);
    const harmony = Math.min(avg('harmony'), 95);
    const bold = Math.min(avg('bold'), 95);
    const occasion = Math.min(avg('occ'), 95);
    const overall = Math.round((harmony + bold + occasion) / 3);

    setBar('harmonyBar', harmony); setVal('harmonyVal', harmony);
    setBar('boldBar', bold); setVal('boldVal', bold);
    setBar('occasionBar', occasion); setVal('occasionVal', occasion);
    setScoreRing(overall); setVal('mixScoreNum', overall);

    const fb = document.getElementById('mixAiFeedback');
    if (fb) fb.textContent = MIX_FEEDBACK[Math.min(count, 5)] || `${overall}/100 — Stunning combo.`;
}

function setBar(id, val) { const el = document.getElementById(id); if (el) el.style.width = val + '%'; }
function setVal(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setScoreRing(score) {
    const circle = document.getElementById('scoreCircle');
    if (circle) circle.setAttribute('stroke-dashoffset', 201 - (201 * score / 100));
}

// ══════════════════════════════════════════════════════════════════════════════
// ECO METRICS
// ══════════════════════════════════════════════════════════════════════════════
function renderEcoMetrics() {
    const grid = document.getElementById('ecoMetrics');
    if (!grid) return;
    grid.innerHTML = ECO_METRICS.map((m, i) => `
    <div class="eco-metric-card">
      <div class="eco-metric-icon">${m.icon}</div>
      <div class="eco-metric-label">${m.label}</div>
      <div class="eco-metric-value">${m.value}</div>
      <div class="eco-metric-unit">${m.unit}</div>
      <div class="eco-metric-bar-track">
        <div class="eco-metric-bar" style="width:0%" data-target="${m.bar}%"></div>
      </div>
    </div>
  `).join('');
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            grid.querySelectorAll('.eco-metric-bar').forEach(bar => {
                bar.style.transition = 'width 1.4s cubic-bezier(0.25,0.46,0.45,0.94)';
                bar.style.width = bar.dataset.target;
            });
            obs.disconnect();
        }
    }, { threshold: 0.4 });
    obs.observe(grid);
}

// ══════════════════════════════════════════════════════════════════════════════
// BOUTIQUE CAROUSEL
// ══════════════════════════════════════════════════════════════════════════════
function renderBoutiqueCarousel() {
    const carousel = document.getElementById('boutiqueCarousel');
    const dots = document.getElementById('carouselDots');
    if (!carousel) return;

    carousel.innerHTML = BOUTIQUES.map((b, i) => `
    <div class="boutique-card" id="boutique-${i}">
      <div class="boutique-visual">
        <img src="${b.photo}" alt="${b.name}" loading="lazy"
          style="width:100%;height:180px;object-fit:cover;display:block;"
          onerror="this.parentElement.style.background='${b.accentColor}20'"
        />
        <div class="boutique-name-overlay">
          <div class="boutique-card-name-inner" style="font-weight:700;color:white;font-size:15px;text-shadow:0 1px 8px rgba(0,0,0,0.7)">${b.name}</div>
        </div>
      </div>
      <div class="boutique-body">
        <div class="boutique-header">
          <div class="boutique-name">${b.name}</div>
          <div class="boutique-rating">★ ${b.rating}</div>
        </div>
        <div class="boutique-location">${b.location}</div>
        <div class="boutique-tags">${b.tags.map(t => `<span class="boutique-tag">${t}</span>`).join('')}</div>
        <p style="font-size:12px;color:rgba(240,232,255,0.5);margin:8px 0 12px;line-height:1.5">${b.desc}</p>
        <div class="boutique-match">
          <span>${b.match}% Style Match</span>
          <div class="boutique-match-bar">
            <div class="boutique-match-fill" style="width:0%;background:linear-gradient(90deg,${b.accentColor},#00d4ff);" data-target="${b.match}%"></div>
          </div>
        </div>
        <button class="btn-primary" style="width:100%;margin-top:14px;font-size:13px;padding:10px" onclick="window.open('${b.mapUrl}','_blank')">📍 View on Map →</button>
      </div>
    </div>
  `).join('');

    if (dots) {
        dots.innerHTML = BOUTIQUES.map((_, i) =>
            `<div class="carousel-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></div>`
        ).join('');
        dots.addEventListener('click', e => {
            const dot = e.target.closest('.carousel-dot');
            if (dot) slideTo(parseInt(dot.dataset.idx));
        });
    }

    // Animate match bars on visible
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            carousel.querySelectorAll('.boutique-match-fill').forEach(bar => {
                bar.style.transition = 'width 1.2s cubic-bezier(0.25,0.46,0.45,0.94)';
                bar.style.width = bar.dataset.target;
            });
            obs.disconnect();
        }
    }, { threshold: 0.3 });
    obs.observe(carousel);
}

function slideTo(idx) {
    const carousel = document.getElementById('boutiqueCarousel');
    const total = BOUTIQUES.length;
    state.boutiqueIndex = ((idx % total) + total) % total;
    if (!carousel) return;
    const cardWidth = (carousel.querySelector('.boutique-card')?.offsetWidth || 320) + 24;
    carousel.style.transform = `translateX(-${state.boutiqueIndex * cardWidth}px)`;
    carousel.style.transition = 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
    document.querySelectorAll('.carousel-dot').forEach((d, i) =>
        d.classList.toggle('active', i === state.boutiqueIndex)
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// HERO BUTTONS
// ══════════════════════════════════════════════════════════════════════════════
function initHeroButtons() {
    const scanBtn = document.getElementById('heroScan');
    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            if (scanBtn.disabled) return;
            scanBtn.disabled = true;
            scanBtn.innerHTML = '⌛ Scanning Aura…';
            const moods = Object.keys(MOODS);
            let i = 0;
            const interval = setInterval(() => {
                const el = document.getElementById('currentMood');
                if (el) el.textContent = moods[i++ % moods.length];
            }, 180);
            setTimeout(() => {
                clearInterval(interval);
                const detected = moods[Math.floor(Math.random() * moods.length)];
                const el = document.getElementById('currentMood');
                if (el) el.textContent = detected;
                scanBtn.innerHTML = `✓ Detected: ${detected}`;
                scanBtn.disabled = false;
                // Update mood chips
                document.querySelectorAll('.mood-chip').forEach(c =>
                    c.classList.toggle('active', c.dataset.mood === detected)
                );
                updateMoodUI(detected);
                showToast(`✨ Mood: ${detected}! Curating your style feed…`);
                setTimeout(() => { scanBtn.innerHTML = '<span class="btn-icon">⟳</span> Scan My Aura'; }, 3500);
            }, 2600);
        });
    }

    document.getElementById('heroExplore')?.addEventListener('click', () =>
        document.getElementById('outfits')?.scrollIntoView({ behavior: 'smooth' })
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════════════════
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transform = 'translateY(16px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.showToast = showToast;

// ══════════════════════════════════════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════════════════════════════════════
function initScrollReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.outfit-card, .eco-metric-card, .boutique-card, .mood-chip').forEach(el => {
        if (el.style.opacity === '1') return; // skip already revealed
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px) scale(0.98)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';
        obs.observe(el);
    });
}

// ══════════════════════════════════════════════════════════════════════════════
// CLEAR CANVAS BUTTON
// ══════════════════════════════════════════════════════════════════════════════
function initClearCanvas() {
    document.getElementById('clearLookBtn')?.addEventListener('click', () => {
        state.wardrobeCanvas = [];
        const canvas = document.getElementById('wardrobeCanvas');
        const placeholder = document.getElementById('canvasPlaceholder');
        if (canvas) {
            canvas.querySelectorAll('.canvas-dropped-piece').forEach(el => el.remove());
            if (placeholder) placeholder.style.display = 'flex';
        }
        updateMixScore();
        showToast('Canvas cleared — start fresh!');
    });

    document.getElementById('saveLookBtn')?.addEventListener('click', () => {
        if (state.wardrobeCanvas.length === 0) {
            showToast('➕ Add some pieces first!');
            return;
        }
        const score = parseInt(document.getElementById('mixScoreNum')?.textContent || '0');
        showToast(`✦ Look saved! Score: ${score}/100`);
    });
}

// ══════════════════════════════════════════════════════════════════════════════
// DOMContentLoaded — INIT
// ══════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const canvas = document.getElementById('particleCanvas');
    if (canvas) new ParticleSystem(canvas);

    // Mood radar
    const radarCvs = document.getElementById('moodRadar');
    if (radarCvs) moodRadarChart = new MoodRadar(radarCvs);

    // Eco ring
    const ecoCvs = document.getElementById('ecoRingCanvas');
    if (ecoCvs) new EcoRing(ecoCvs);

    // Render components
    renderOutfitCards('All');
    renderWardrobePieces();
    initWardrobeCanvas();
    renderEcoMetrics();
    renderBoutiqueCarousel();
    initTonePalette();

    // Carousel nav
    document.getElementById('carouselPrev')?.addEventListener('click', () => slideTo(state.boutiqueIndex - 1));
    document.getElementById('carouselNext')?.addEventListener('click', () => slideTo(state.boutiqueIndex + 1));

    // Buttons
    initHeroButtons();
    initClearCanvas();

    // Stat counters
    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) heroStatObs.observe(statsEl);

    // Scroll reveal
    setTimeout(initScrollReveal, 150);

    // Expose state for auth.js
    window.state = state;

    // Theme toggle
    initThemeToggle();

    // Photo Analyzer
    initPhotoAnalyzer();

    // Update nav with analyzer link
    addAnalyzerNavLink();

    console.log('%c✦ Staybnb v2 — Loaded ✦', 'background:linear-gradient(135deg,#b47bff,#00d4ff);color:white;padding:8px 20px;border-radius:8px;font-size:14px;font-weight:700');
});

// ══════════════════════════════════════════════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════════════════════════════════════════════
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    // Restore saved theme
    const saved = localStorage.getItem('staybnb_theme') || 'dark';
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

    btn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('staybnb_theme', 'dark');
            showToast('🌙 Dark mode on');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('staybnb_theme', 'light');
            showToast('☀️ Light mode on');
        }
    });
}

// ══════════════════════════════════════════════════════════════════════════════
// ADD ANALYZER NAV LINK
// ══════════════════════════════════════════════════════════════════════════════
function addAnalyzerNavLink() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    // Check if already added
    if (navLinks.querySelector('a[href="#analyzer"]')) return;
    const li = document.createElement('li');
    li.innerHTML = '<a href="#analyzer" class="nav-link">Analyze</a>';
    navLinks.appendChild(li);
}

// ══════════════════════════════════════════════════════════════════════════════
// AI PHOTO ANALYZER
// ══════════════════════════════════════════════════════════════════════════════
const ANALYZER_MOODS = ['Confident', 'Elegant', 'Dreamy', 'Fierce', 'Calm', 'Playful'];
const ANALYZER_TONES = ['Fair Warm', 'Light Beige', 'Medium Tan', 'Deep Brown', 'Rich Ebony', 'Warm Olive'];
const ANALYZER_GARMENTS = ['Blazer', 'Midi Dress', 'Denim Jacket', 'Crop Top', 'Wide-leg Trousers', 'Silk Blouse', 'Leather Jacket', 'Floral Skirt', 'Oversized Shirt', 'Stiletto Heels', 'Sneakers', 'Structured Tote', 'Statement Earrings', 'Silk Scarf'];
const ANALYZER_SUGGESTIONS = [
    { icon: '✦', text: 'Try a monochromatic palette to elongate your silhouette.' },
    { icon: '🌿', text: 'Swap fast-fashion pieces for certified organic alternatives.' },
    { icon: '💎', text: 'Adding a statement necklace would elevate this look by 40%.' },
    { icon: '🎨', text: 'Introduce a bold accent colour in your accessories.' },
    { icon: '📐', text: 'A wider belt would define your waist and add structure.' },
    { icon: '🪡', text: 'Textured fabrics like boucle or velvet suit your mood perfectly.' },
    { icon: '👟', text: 'Chunky footwear balances the flowy elements in this outfit.' },
    { icon: '🌸', text: 'Soft draping in the shoulder area enhances your frame.' },
];

function initPhotoAnalyzer() {
    const fileInput = document.getElementById('analyzerFileInput');
    const browseBtn = document.getElementById('analyzerBrowseBtn');
    const retakeBtn = document.getElementById('analyzerRetakeBtn');
    const dropzone = document.getElementById('analyzerDropzone');
    const progress = document.getElementById('analyzerProgress');
    const preview = document.getElementById('analyzerPreview');
    const previewImg = document.getElementById('analyzerPreviewImg');
    const dropInner = document.getElementById('dropzoneInner');
    const placeholder = document.getElementById('analyzerPlaceholder');
    const resultContent = document.getElementById('analyzerResultContent');
    const applyBtn = document.getElementById('applyAnalysisBtn');
    if (!fileInput) return;

    // Click to browse
    browseBtn?.addEventListener('click', () => fileInput.click());
    dropzone?.addEventListener('click', e => { if (e.target === dropzone) fileInput.click(); });

    // Drag & drop
    dropzone?.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone?.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleAnalyzerFile(file);
    });

    fileInput?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) handleAnalyzerFile(file);
    });

    retakeBtn?.addEventListener('click', resetAnalyzer);

    applyBtn?.addEventListener('click', () => {
        const detectedMood = document.getElementById('rMood')?.textContent;
        if (detectedMood && MOODS[detectedMood]) {
            // Activate that mood chip
            document.querySelectorAll('.mood-chip').forEach(c =>
                c.classList.toggle('active', c.dataset.mood === detectedMood)
            );
            state.activeMood = detectedMood;
            updateMoodUI(detectedMood);
            renderOutfitCards(detectedMood);
            document.getElementById('outfits')?.scrollIntoView({ behavior: 'smooth' });
            showToast(`✦ Style feed updated for ${detectedMood} mood!`);
        } else {
            document.getElementById('outfits')?.scrollIntoView({ behavior: 'smooth' });
            showToast('✦ Style feed refreshed with your analysis!');
        }
    });
}

function handleAnalyzerFile(file) {
    const reader = new FileReader();
    reader.onload = ev => {
        const src = ev.target.result;
        const previewImg = document.getElementById('analyzerPreviewImg');
        const preview = document.getElementById('analyzerPreview');
        const dropInner = document.getElementById('dropzoneInner');
        const progress = document.getElementById('analyzerProgress');
        const placeholder = document.getElementById('analyzerPlaceholder');
        const resultContent = document.getElementById('analyzerResultContent');

        if (previewImg) previewImg.src = src;
        if (preview) preview.classList.remove('hidden');
        if (dropInner) dropInner.classList.add('hidden');
        if (progress) progress.classList.remove('hidden');
        if (placeholder) placeholder.classList.add('hidden');
        if (resultContent) resultContent.classList.add('hidden');

        // Simulate AI analysis pipeline with step reveals
        runAnalysisPipeline().then(() => showAnalyzerResults());
    };
    reader.readAsDataURL(file);
}

async function runAnalysisPipeline() {
    const steps = ['progStep1', 'progStep2', 'progStep3', 'progStep4'];
    for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 750));
        const el = document.getElementById(steps[i]);
        if (!el) continue;
        el.querySelector('.step-dot')?.classList.add('active');
        el.style.color = 'var(--accent-purple)';
        el.style.fontWeight = '600';
    }
    await new Promise(r => setTimeout(r, 500));
}

function showAnalyzerResults() {
    const progress = document.getElementById('analyzerProgress');
    const resultContent = document.getElementById('analyzerResultContent');
    if (progress) progress.classList.add('hidden');
    if (resultContent) resultContent.classList.remove('hidden');

    // Randomize detected elements
    const numGarments = 3 + Math.floor(Math.random() * 4);
    const garments = shuffle([...ANALYZER_GARMENTS]).slice(0, numGarments);
    const mood = ANALYZER_MOODS[Math.floor(Math.random() * ANALYZER_MOODS.length)];
    const tone = ANALYZER_TONES[Math.floor(Math.random() * ANALYZER_TONES.length)];
    const eco = 55 + Math.floor(Math.random() * 40);
    const suggestions = shuffle([...ANALYZER_SUGGESTIONS]).slice(0, 3);

    const tagsEl = document.getElementById('analyzedTags');
    if (tagsEl) tagsEl.innerHTML = garments.map(g => `<span class="a-tag">${g}</span>`).join('');

    const rMood = document.getElementById('rMood'); if (rMood) rMood.textContent = mood;
    const rTone = document.getElementById('rTone'); if (rTone) rTone.textContent = tone;
    const rEco = document.getElementById('rEco'); if (rEco) rEco.textContent = eco + '/100';

    const suggEl = document.getElementById('suggestionList');
    if (suggEl) {
        suggEl.innerHTML = suggestions.map(s => `
      <div class="suggestion-item">
        <div class="sug-icon">${s.icon}</div>
        <div class="sug-text">${s.text}</div>
      </div>
    `).join('');
    }

    // Matching outfit thumbnails
    const matchRow = document.getElementById('matchOutfitRow');
    if (matchRow) {
        const matched = OUTFITS.filter(o => o.mood === mood || shuffle([true, false])[0]).slice(0, 3);
        matchRow.innerHTML = matched.map(o => `
      <div class="match-thumb" title="${o.name}">
        <img src="${o.photo}" alt="${o.name}" loading="lazy"/>
        <div class="match-thumb-label">${o.name}</div>
      </div>
    `).join('');
    }

    showToast(`✦ Analysis complete! ${mood} mood detected.`);
}

function resetAnalyzer() {
    const preview = document.getElementById('analyzerPreview');
    const dropInner = document.getElementById('dropzoneInner');
    const progress = document.getElementById('analyzerProgress');
    const placeholder = document.getElementById('analyzerPlaceholder');
    const resultContent = document.getElementById('analyzerResultContent');
    const fileInput = document.getElementById('analyzerFileInput');

    if (preview) preview.classList.add('hidden');
    if (dropInner) dropInner.classList.remove('hidden');
    if (progress) {
        progress.classList.add('hidden');
        progress.querySelectorAll('.prog-step').forEach(s => {
            s.style.color = ''; s.style.fontWeight = '';
            s.querySelector('.step-dot')?.classList.remove('active');
        });
        document.getElementById('progStep1')?.querySelector('.step-dot')?.classList.add('active');
    }
    if (placeholder) placeholder.classList.remove('hidden');
    if (resultContent) resultContent.classList.add('hidden');
    if (fileInput) fileInput.value = '';
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
