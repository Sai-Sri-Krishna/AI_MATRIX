/* ═══════════════════════════════════════════════════════════
   STAYBNB — auth.js
   Login, Signup, Profile, Settings — Full Auth Flow
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── Auth State ─────────────────────────────────────────────────────────────────
const AUTH = {
    user: null,          // current logged-in user object
    styleDNA: [],        // selected style vibes
    city: '',
};

// Try restore session from localStorage
try {
    const saved = localStorage.getItem('staybnb_user');
    if (saved) AUTH.user = JSON.parse(saved);
} catch (e) { /* ignore */ }

// ── Utility Helpers ────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const openOverlay = id => { $(id).classList.add('active'); document.body.style.overflow = 'hidden'; };
const closeOverlay = id => { $(id).classList.remove('active'); document.body.style.overflow = ''; };

function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function setInputState(el, state, msg = '') {
    el.classList.remove('error', 'success');
    if (state) el.classList.add(state);
    const errEl = el.parentElement.parentElement?.querySelector('.form-error')
        || el.parentElement.querySelector('.form-error');
    if (errEl) errEl.textContent = msg;
}

function showSpinner(btnId, show) {
    const btn = $(btnId);
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spin = btn.querySelector('.btn-spinner');
    if (text) text.hidden = show;
    if (spin) spin.hidden = !show;
    btn.disabled = show;
}

// ── Password Strength ─────────────────────────────────────────────────────────
function checkPasswordStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ff4466', '#ff9f43', '#ffd700', '#00f5a0'];
    const widths = ['0%', '25%', '50%', '75%', '100%'];
    $('pwBar').style.width = score ? widths[score] : '0%';
    $('pwBar').style.background = colors[score] || 'transparent';
    $('pwHint').textContent = score ? labels[score] : 'Enter password';
    $('pwHint').style.color = colors[score] || 'rgba(240,232,255,0.4)';
    return score;
}

// ── Eye (show/hide password) ───────────────────────────────────────────────────
document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        target.type = target.type === 'password' ? 'text' : 'password';
        btn.textContent = target.type === 'password' ? '👁' : '🙈';
    });
});

// ── Password strength live feedback ───────────────────────────────────────────
const signupPwInput = $('signupPassword');
if (signupPwInput) {
    signupPwInput.addEventListener('input', () => checkPasswordStrength(signupPwInput.value));
}

// ═══════════════════════════════════════════════════════════
// LOGIN FLOW
// ═══════════════════════════════════════════════════════════

function openLogin() {
    closeOverlay('signupOverlay');
    openOverlay('loginOverlay');
}

function openSignup() {
    closeOverlay('loginOverlay');
    openOverlay('signupOverlay');
    resetSignupSteps();
}

// Open triggers
$('navLogin')?.addEventListener('click', openLogin);
$('navSignup')?.addEventListener('click', openSignup);
$('navCta')?.addEventListener('click', e => {
    if (!AUTH.user) openSignup();
    else showProfilePanel();
});
$('footerLogin')?.addEventListener('click', e => { e.preventDefault(); openLogin(); });
$('footerSignup')?.addEventListener('click', e => { e.preventDefault(); openSignup(); });

// Close triggers
$('loginClose')?.addEventListener('click', () => closeOverlay('loginOverlay'));
$('signupClose')?.addEventListener('click', () => closeOverlay('signupOverlay'));
$('profileClose')?.addEventListener('click', () => closeOverlay('profileOverlay'));

// Click outside to close
['loginOverlay', 'signupOverlay', 'profileOverlay'].forEach(id => {
    $(id)?.addEventListener('click', e => {
        if (e.target === $(id)) closeOverlay(id);
    });
});

// Switch links
$('goToSignup')?.addEventListener('click', e => { e.preventDefault(); openSignup(); });
$('goToLogin')?.addEventListener('click', e => { e.preventDefault(); openLogin(); });

// ── Login Form Submit ──────────────────────────────────────────────────────────
$('loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    const emailEl = $('loginEmail');
    const passEl = $('loginPassword');
    const email = emailEl.value.trim();
    const pass = passEl.value;

    if (!validateEmail(email)) {
        setInputState(emailEl, 'error', 'Enter a valid email address');
        valid = false;
    } else { setInputState(emailEl, 'success'); }

    if (pass.length < 6) {
        setInputState(passEl, 'error', 'Password must be at least 6 characters');
        valid = false;
    } else { setInputState(passEl, 'success'); }

    if (!valid) return;

    showSpinner('loginSubmit', true);
    await fakeDelay(1400);

    // Simulate login — check localStorage for registered user or allow any valid creds
    let storedUser = null;
    try { storedUser = JSON.parse(localStorage.getItem('staybnb_user')); } catch (e) { }

    const user = storedUser && storedUser.email === email
        ? storedUser
        : { email, first: email.split('@')[0], last: '', styleDNA: ['Minimalist', 'Bold'], city: '' };

    loginUser(user);
    showSpinner('loginSubmit', false);
    closeOverlay('loginOverlay');
    showToastExternal(`Welcome back, ${user.first}! ✨`);
});

// ── Social Login ───────────────────────────────────────────────────────────────
$('googleLogin')?.addEventListener('click', () => {
    simulateSocialLogin('Google');
});
$('appleLogin')?.addEventListener('click', () => {
    simulateSocialLogin('Apple');
});

async function simulateSocialLogin(provider) {
    showToastExternal(`Connecting to ${provider}…`);
    await fakeDelay(1200);
    const names = ['Priya Sharma', 'Aanya Kapoor', 'Riya Mehta', 'Zara Khan'];
    const chosen = names[Math.floor(Math.random() * names.length)].split(' ');
    const user = {
        email: `user@${provider.toLowerCase()}.com`,
        first: chosen[0], last: chosen[1],
        styleDNA: ['Bold', 'Futuristic'],
        city: 'Mumbai',
        provider,
    };
    loginUser(user);
    closeOverlay('loginOverlay');
    closeOverlay('signupOverlay');
    showToastExternal(`Signed in with ${provider}! Welcome, ${user.first} ✦`);
}

// ═══════════════════════════════════════════════════════════
// SIGNUP FLOW
// ═══════════════════════════════════════════════════════════

let signupData = {};

function resetSignupSteps() {
    signupData = {};
    AUTH.styleDNA = [];
    showSignupStep(1);
    document.querySelectorAll('.dna-chip').forEach(c => c.classList.remove('selected'));
    [$('signupFirst'), $('signupLast'), $('signupEmail'), $('signupPassword')].forEach(el => {
        if (el) { el.value = ''; setInputState(el, null); }
    });
    updateStepIndicators(1);
}

function showSignupStep(n) {
    [$('signupStep1'), $('signupStep2'), $('signupStep3')].forEach((el, i) => {
        if (!el) return;
        el.classList.toggle('hidden', i + 1 !== n);
    });
    updateStepIndicators(n);
}

function updateStepIndicators(active) {
    for (let i = 1; i <= 3; i++) {
        const el = $(`sstep${i}`);
        if (!el) continue;
        el.classList.remove('active', 'done');
        if (i === active) el.classList.add('active');
        else if (i < active) el.classList.add('done');
    }
}

// Step 1 submit
$('signupForm1')?.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const first = $('signupFirst').value.trim();
    const email = $('signupEmail').value.trim();
    const pass = $('signupPassword').value;

    if (!first) {
        setInputState($('signupFirst'), 'error', 'First name is required');
        valid = false;
    } else { setInputState($('signupFirst'), 'success'); }

    if (!validateEmail(email)) {
        setInputState($('signupEmail'), 'error', 'Enter a valid email');
        valid = false;
    } else { setInputState($('signupEmail'), 'success'); }

    if (checkPasswordStrength(pass) < 2) {
        setInputState($('signupPassword'), 'error', 'Choose a stronger password');
        valid = false;
    } else { setInputState($('signupPassword'), 'success'); }

    if (!valid) return;

    signupData = {
        first,
        last: $('signupLast').value.trim(),
        email,
        password: pass,
    };

    showSignupStep(2);
});

// Style DNA chips
$('dnaGrid')?.addEventListener('click', e => {
    const chip = e.target.closest('.dna-chip');
    if (!chip) return;

    if (chip.classList.contains('selected')) {
        chip.classList.remove('selected');
        AUTH.styleDNA = AUTH.styleDNA.filter(v => v !== chip.dataset.val);
    } else {
        if (AUTH.styleDNA.length < 3) {
            chip.classList.add('selected');
            AUTH.styleDNA.push(chip.dataset.val);
        } else {
            showToastExternal('Pick up to 3 style vibes');
        }
    }
});

// Step 2 → Step 3
$('step2Next')?.addEventListener('click', async () => {
    if (AUTH.styleDNA.length === 0) {
        showToastExternal('Select at least 1 style vibe');
        return;
    }
    signupData.styleDNA = [...AUTH.styleDNA];
    signupData.city = $('signupCity')?.value.trim() || '';

    showSignupStep(3);

    // Show welcome chips
    const $ = id => document.getElementById(id);
    if ($('welcomeName')) $('welcomeName').textContent = signupData.first;
    const chipsEl = $('successChips');
    if (chipsEl) {
        chipsEl.innerHTML = AUTH.styleDNA.map(v =>
            `<span class="success-chip">${v}</span>`
        ).join('');
    }
});

$('step2Back')?.addEventListener('click', () => showSignupStep(1));

// Enter App button
$('enterAppBtn')?.addEventListener('click', () => {
    const user = {
        first: signupData.first,
        last: signupData.last,
        email: signupData.email,
        styleDNA: signupData.styleDNA || [],
        city: signupData.city,
        password: signupData.password,
        joinedAt: new Date().toISOString(),
    };
    localStorage.setItem('staybnb_user', JSON.stringify(user));
    loginUser(user);
    closeOverlay('signupOverlay');
    showToastExternal(`✦ Welcome to Staybnb, ${user.first}! Your style journey begins.`);
});

// ═══════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════

function showProfilePanel() {
    updateProfileUI();
    openOverlay('profileOverlay');
}

$('navProfileBtn')?.addEventListener('click', showProfilePanel);

function loginUser(user) {
    AUTH.user = user;
    try { localStorage.setItem('staybnb_user', JSON.stringify(user)); } catch (e) { }

    // Update nav
    const navGuest = $('navGuestBtns');
    const navUser = $('navUserArea');
    if (navGuest) navGuest.classList.add('hidden');
    if (navUser) navUser.classList.remove('hidden');

    const initials = `${user.first?.[0] || ''}${user.last?.[0] || ''}`.toUpperCase() || 'S';
    const navAv = $('navAvatar');
    if (navAv) navAv.textContent = initials;
    const navName = $('navUserName');
    if (navName) navName.textContent = user.first || 'Stylist';

    updateProfileUI();
}

function logoutUser() {
    AUTH.user = null;
    try { localStorage.removeItem('staybnb_user'); } catch (e) { }

    const navGuest = $('navGuestBtns');
    const navUser = $('navUserArea');
    if (navGuest) navGuest.classList.remove('hidden');
    if (navUser) navUser.classList.add('hidden');

    closeOverlay('profileOverlay');
    showToastExternal('You\'ve been signed out. See you soon! 👋');
}

$('logoutBtn')?.addEventListener('click', logoutUser);

function updateProfileUI() {
    const u = AUTH.user;
    if (!u) return;

    // Name & email
    const initials = `${u.first?.[0] || ''}${u.last?.[0] || ''}`.toUpperCase() || 'S';
    $('profileAvatarInitials').textContent = initials;
    $('profileName').textContent = `${u.first || ''} ${u.last || ''}`.trim();
    $('profileEmail').textContent = u.email || '';

    // Saved looks count (from app state)
    const savedCount = window.state?.savedOutfits?.size ?? 0;
    $('pSavedCount').textContent = savedCount;
    $('pMoodCount').textContent = window.state?.activeMood || 'Confident';
    $('pEcoScore').textContent = '84';

    // DNA
    const dnas = u.styleDNA || ['Minimalist'];
    const dnaTags = $('profileDnaTags');
    if (dnaTags) {
        dnaTags.innerHTML = dnas.map(d => `<span class="p-dna-tag">${d}</span>`).join('');
    }

    // Mood history bars
    const moodHistory = [
        { label: 'Confident', count: 12 },
        { label: 'Elegant', count: 8 },
        { label: 'Calm', count: 5 },
        { label: 'Playful', count: 4 },
    ];
    const histEl = $('moodHistoryBars');
    if (histEl) {
        histEl.innerHTML = moodHistory.map(m => `
      <div class="mood-hist-item">
        <span class="mood-hist-label">${m.label}</span>
        <div class="mood-hist-track"><div class="mood-hist-fill" style="width:${m.count / 12 * 100}%"></div></div>
        <span class="mood-hist-count">${m.count}</span>
      </div>
    `).join('');
    }

    // Tone pills
    const tonePillRow = $('tonePillRow');
    const toneColors = ['#f5deb3', '#deb887', '#cd853f', '#8b4513', '#3d1c02', '#1a0a00'];
    if (tonePillRow) {
        tonePillRow.innerHTML = toneColors.map((c, i) => `
      <div class="tone-pill ${i === 0 ? 'selected' : ''}" style="background:${c};" title="Tone ${i + 1}"></div>
    `).join('');
    }

    // Settings fields
    if ($('settingsName')) $('settingsName').value = `${u.first || ''} ${u.last || ''}`.trim();
    if ($('settingsCity')) $('settingsCity').value = u.city || '';

    // Saved looks thumbnails
    updateSavedLooksTab();
}

function updateSavedLooksTab() {
    const grid = $('savedLooksGrid');
    if (!grid) return;
    const saved = window.state?.savedOutfits;
    const outfits = window.OUTFITS_DATA;
    if (!saved || !outfits || saved.size === 0) {
        grid.innerHTML = `
      <div class="saved-empty">
        <span>♡</span>
        <p>No saved looks yet.<br/>Tap the heart on any outfit!</p>
      </div>
    `;
        return;
    }
    grid.innerHTML = '';
    saved.forEach(idx => {
        const o = outfits[idx];
        if (!o) return;
        const div = document.createElement('div');
        div.className = 'saved-look-thumb';
        div.innerHTML = `
      <img src="${o.photo}" alt="${o.name}" loading="lazy"/>
      <div class="saved-look-label">${o.name}</div>
    `;
        grid.appendChild(div);
    });
}

// Profile tabs
$('profile-tab-clicks: .profile-tabs')?.addEventListener('click', () => { });
document.querySelector('.profile-tabs')?.addEventListener('click', e => {
    const tab = e.target.closest('.p-tab');
    if (!tab) return;
    const target = tab.dataset.tab;
    document.querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.p-tab-content').forEach(c => {
        c.classList.toggle('hidden', c.id !== `tabContent${target.charAt(0).toUpperCase() + target.slice(1)}`);
        c.classList.toggle('active', c.id === `tabContent${target.charAt(0).toUpperCase() + target.slice(1)}`);
    });
    if (target === 'saved') updateSavedLooksTab();
});

// Save settings
$('saveSettingsBtn')?.addEventListener('click', () => {
    if (!AUTH.user) return;
    const newName = $('settingsName')?.value.trim().split(' ') || [];
    AUTH.user.first = newName[0] || AUTH.user.first;
    AUTH.user.last = newName.slice(1).join(' ') || AUTH.user.last;
    AUTH.user.city = $('settingsCity')?.value.trim() || '';
    AUTH.user.notifications = $('notifToggle')?.checked;
    AUTH.user.ecoMode = $('ecoToggle')?.checked;
    AUTH.user.aiScan = $('aiToggle')?.checked;
    try { localStorage.setItem('staybnb_user', JSON.stringify(AUTH.user)); } catch (e) { }
    loginUser(AUTH.user);
    showToastExternal('Settings saved! ✓');
});

// Avatar upload
$('avatarEditBtn')?.addEventListener('click', () => $('avatarInput')?.click());
$('profileAvatar')?.addEventListener('click', () => $('avatarInput')?.click());

$('avatarInput')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const src = ev.target.result;
        const avatar = $('profileAvatar');
        avatar.innerHTML = `<img src="${src}" alt="Avatar"/>`;
        const navAv = $('navAvatar');
        if (navAv) navAv.innerHTML = `<img src="${src}" alt="Avatar"/>`;
        if (AUTH.user) {
            AUTH.user.avatar = src;
            try { localStorage.setItem('staybnb_user', JSON.stringify(AUTH.user)); } catch (e) { }
        }
        showToastExternal('Profile photo updated! 📸');
    };
    reader.readAsDataURL(file);
});

// ═══════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════════════════════
$('forgotLink')?.addEventListener('click', async e => {
    e.preventDefault();
    const email = $('loginEmail')?.value.trim();
    if (!validateEmail(email)) {
        setInputState($('loginEmail'), 'error', 'Enter your email first');
        return;
    }
    showToastExternal(`Password reset link sent to ${email} ✓`);
});

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function fakeDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showToastExternal(msg) {
    if (typeof showToast === 'function') {
        showToast(msg);
    } else {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    }
}

// ── Restore session on load ────────────────────────────────────────────────────
(function restoreSession() {
    if (AUTH.user) {
        loginUser(AUTH.user);
    }
})();

// Expose for app.js
window.AUTH = AUTH;
window.openLogin = openLogin;
window.openSignup = openSignup;
window.showProfilePanel = showProfilePanel;
window.updateSavedLooksTab = updateSavedLooksTab;
