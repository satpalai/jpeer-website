/* =============================================================
   J.PEER Health — script.js
   ============================================================= */

// === COOKIE CONSENT BANNER (JS-injected — not in HTML body) ===
(function () {
    if (localStorage.getItem('jpeer_cookie_consent')) return;

    const banner = document.createElement('div');
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.style.cssText = [
        'position:fixed',
        'bottom:0',
        'left:0',
        'right:0',
        'z-index:9999',
        'background:#1e293b',
        'color:#f1f5f9',
        'padding:1rem 1.5rem',
        'display:flex',
        'align-items:center',
        'justify-content:space-between',
        'gap:1rem',
        'flex-wrap:wrap',
        'font-family:inherit',
        'font-size:0.85rem',
        'line-height:1.5',
        'box-shadow:0 -2px 12px rgba(0,0,0,0.15)'
    ].join(';');

    const text = document.createElement('p');
    text.style.cssText = 'margin:0;flex:1;min-width:200px;';
    text.innerHTML = 'We use cookies to improve your experience. By continuing to use this site, you agree to our <a href="/privacy-policy.html" style="color:#93c5fd;text-decoration:underline;">Privacy Policy</a>.';

    const btn = document.createElement('button');
    btn.textContent = 'Got it';
    btn.style.cssText = [
        'background:#3b82f6',
        'color:#fff',
        'border:none',
        'border-radius:6px',
        'padding:0.5rem 1.25rem',
        'font-size:0.85rem',
        'font-weight:600',
        'cursor:pointer',
        'white-space:nowrap',
        'flex-shrink:0'
    ].join(';');

    btn.addEventListener('click', function () {
        localStorage.setItem('jpeer_cookie_consent', '1');
        banner.remove();
    });

    banner.appendChild(text);
    banner.appendChild(btn);
    document.body.appendChild(banner);
}());

// === MOBILE NAV TOGGLE ===
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('open');
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// === SCROLL ANIMATIONS (IntersectionObserver) ===
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    fadeObserver.observe(el);
});

// =============================================================
// === SECURITY: INPUT LENGTH LIMITS ===
// Enforce maxlength on all text inputs and textareas that lack one.
// Prevents oversized payload attacks.
// =============================================================

document.querySelectorAll('input[type="text"], input[type="tel"]').forEach(input => {
    if (!input.hasAttribute('maxlength')) input.setAttribute('maxlength', '200');
});
document.querySelectorAll('input[type="email"]').forEach(input => {
    if (!input.hasAttribute('maxlength')) input.setAttribute('maxlength', '254');
});
document.querySelectorAll('textarea').forEach(ta => {
    if (!ta.hasAttribute('maxlength')) ta.setAttribute('maxlength', '2000');
});

// =============================================================
// === SECURITY: RATE LIMITING ===
// Client-side guard against form flooding.
// Uses localStorage to track submission timestamps.
//
// Rules:
//   - Max 5 submissions per hour per browser
//   - 30-second cooldown between any two submissions
//   - Form must have been on screen for at least 1.5s (bot filter)
// =============================================================

const PAGE_LOAD_TIME = Date.now();

const RATE_LIMIT = {
    maxPerHour:      5,
    cooldownMs:      30_000,   // 30 seconds between submissions
    minTimeOnPageMs: 1_500,    // must spend 1.5s on page before submitting
    storageKey:      'jpeer_sub_log',
    windowMs:        60 * 60 * 1000, // 1 hour rolling window
};

function getRateLimitState() {
    try {
        const now = Date.now();
        const raw = localStorage.getItem(RATE_LIMIT.storageKey);
        const log = raw ? JSON.parse(raw) : [];
        // Keep only entries within the rolling window
        return log.filter(ts => typeof ts === 'number' && now - ts < RATE_LIMIT.windowMs);
    } catch {
        return [];
    }
}

function recordSubmission() {
    try {
        const log = getRateLimitState();
        log.push(Date.now());
        localStorage.setItem(RATE_LIMIT.storageKey, JSON.stringify(log));
    } catch { /* localStorage unavailable — graceful degradation */ }
}

/**
 * Returns null if allowed, or an error string if blocked.
 */
function checkRateLimit() {
    const now = Date.now();

    // Bot filter: submitted too fast after page load
    if (now - PAGE_LOAD_TIME < RATE_LIMIT.minTimeOnPageMs) {
        return 'Please wait a moment before submitting.';
    }

    const log = getRateLimitState();

    // Cooldown: too soon after last submission
    if (log.length > 0 && now - log[log.length - 1] < RATE_LIMIT.cooldownMs) {
        const secsLeft = Math.ceil((RATE_LIMIT.cooldownMs - (now - log[log.length - 1])) / 1000);
        return `Please wait ${secsLeft} seconds before submitting again.`;
    }

    // Hourly cap
    if (log.length >= RATE_LIMIT.maxPerHour) {
        return 'Too many submissions. Please call us on 0469 371 121.';
    }

    return null; // Allowed
}

// =============================================================
// === SECURITY: INPUT VALIDATION ===
// Validates email format and phone length before sending to
// Web3Forms. Prevents garbage data and reduces spam value.
// =============================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s\+\-\(\)]{6,20}$/;

function validateFormInputs(form) {
    const name  = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[type="email"]');
    const phone = form.querySelector('input[type="tel"]');

    if (name && name.value.trim().length < 2) {
        return 'Please enter your full name.';
    }
    if (email && email.value.trim() && !EMAIL_RE.test(email.value.trim())) {
        return 'Please enter a valid email address.';
    }
    if (phone && phone.value.trim() && !PHONE_RE.test(phone.value.trim())) {
        return 'Please enter a valid phone number (digits, spaces, + or - only).';
    }
    return null; // Valid
}

// =============================================================
// === FORM SUBMISSIONS VIA WEB3FORMS ===
// =============================================================

const WEB3FORMS_KEY = '77006307-dbcf-4b2c-b606-cbc303a742ea';

const FORM_SUBJECTS = {
    contactForm:        'New Care Enquiry — jpeerhealth.com',
    callbackForm:       'Callback Request — jpeerhealth.com',
    enquiryForm:        'New Care Enquiry — jpeerhealth.com',
    guideForm:          'Home Care Guide Download Request',
    pricingEnquiryForm: 'Pricing Enquiry — jpeerhealth.com',
};

function showFormError(btn, message, originalText) {
    btn.textContent = message;
    btn.style.background = '#dc2626';
    btn.disabled = false;
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 6000);
}

async function submitForm(form) {
    const btn = form.querySelector('button[type="submit"], .btn-submit');
    if (!btn) return;

    const originalText = btn.textContent.trim();

    // --- Security checks before touching the network ---
    const rateLimitError = checkRateLimit();
    if (rateLimitError) {
        showFormError(btn, rateLimitError, originalText);
        return;
    }

    const validationError = validateFormInputs(form);
    if (validationError) {
        showFormError(btn, validationError, originalText);
        return;
    }

    // --- Proceed with submission ---
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = new FormData(form);
    data.set('access_key', WEB3FORMS_KEY);

    const formId = form.id;
    if (FORM_SUBJECTS[formId]) {
        data.set('subject', FORM_SUBJECTS[formId]);
    }

    // Honeypot (must remain empty — bots fill it, humans don't)
    if (!data.has('botcheck')) {
        data.set('botcheck', '');
    }

    // Timestamp helps Web3Forms detect rapid-fire bot submissions
    data.set('from_page', window.location.href);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (result.success) {
            recordSubmission(); // Log only after confirmed success

            btn.textContent = 'Sent — we\'ll be in touch shortly';
            btn.style.background = '#16a34a';
            form.reset();

            const reassurance = form.querySelector('.form-reassurance');
            if (reassurance) {
                reassurance.style.color = '#16a34a';
                reassurance.style.fontWeight = '600';
            }

            // Keep button locked for 30s to prevent double-submits
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                if (reassurance) {
                    reassurance.style.color = '';
                    reassurance.style.fontWeight = '';
                }
            }, 30_000);

        } else {
            throw new Error('Submission failed');
        }

    } catch {
        showFormError(btn, 'Something went wrong — call us on 0469 371 121', originalText);
    }
}

// Attach handler to all named forms
['contactForm', 'callbackForm', 'enquiryForm', 'guideForm', 'pricingEnquiryForm'].forEach(id => {
    const form = document.getElementById(id);
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            submitForm(form);
        });
    }
});

// =============================================================
// === CONSULTATION MODAL ===
// =============================================================

const consultModal = document.getElementById('consultModal');
const consultBtn   = document.getElementById('consultBtn');
const modalClose   = document.getElementById('modalClose');
const consultForm  = document.getElementById('consultForm');

function openModal() {
    if (!consultModal) return;
    consultModal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        const first = consultModal.querySelector('input:not([type="hidden"]):not([name="botcheck"])');
        if (first) first.focus();
    }, 280);
}

function closeModal() {
    if (!consultModal) return;
    consultModal.hidden = true;
    document.body.style.overflow = '';
    if (consultBtn) consultBtn.focus();
}

if (consultBtn)  consultBtn.addEventListener('click', openModal);
if (modalClose)  modalClose.addEventListener('click', closeModal);

if (consultModal) {
    consultModal.addEventListener('click', e => {
        if (e.target === consultModal) closeModal();
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && consultModal && !consultModal.hidden) closeModal();
});

// Consult form submission (inline modal — uses same rate limiting)
if (consultForm) {
    consultForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = document.getElementById('consultSubmitBtn');
        if (!btn) return;

        const originalText = btn.textContent.trim();

        // Security checks
        const rateLimitError = checkRateLimit();
        if (rateLimitError) {
            showFormError(btn, rateLimitError, originalText);
            return;
        }

        const validationError = validateFormInputs(consultForm);
        if (validationError) {
            showFormError(btn, validationError, originalText);
            return;
        }

        btn.textContent = 'Sending…';
        btn.disabled = true;

        const data = new FormData(consultForm);
        data.set('access_key', WEB3FORMS_KEY);
        data.set('subject', 'Free Consultation Request — jpeerhealth.com');
        data.set('from_page', window.location.href);
        if (!data.has('botcheck')) data.set('botcheck', '');

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: data
            });
            const result = await res.json();

            if (result.success) {
                recordSubmission();

                // Replace form with success state (hardcoded strings — no user data rendered)
                consultForm.innerHTML = `
                    <div style="text-align:center;padding:2rem 1rem;">
                        <div style="width:56px;height:56px;background:#dcfce7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h3 style="font-size:1.2rem;font-weight:700;color:var(--navy);margin-bottom:0.5rem;letter-spacing:-0.01em;">We'll call you shortly</h3>
                        <p style="font-size:0.92rem;color:var(--text-sub);line-height:1.6;margin-bottom:1.5rem;">Thank you — a member of our care team will be in touch within 2 hours. We're available 24/7.</p>
                        <a href="tel:0469371121" style="display:inline-flex;align-items:center;gap:0.5rem;font-size:0.92rem;font-weight:600;color:var(--blue);text-decoration:none;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                            Or call us now: 0469 371 121
                        </a>
                    </div>`;
            } else {
                throw new Error('Submission failed');
            }
        } catch {
            showFormError(btn, 'Something went wrong — please call 0469 371 121', originalText);
        }
    });
}
