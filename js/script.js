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
    if (!ta.hasAttribute('maxlength')) ta.setAttribute('maxlength', '1000');
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
// === SANITISATION & PER-FIELD VALIDATION ===
// Strips HTML tags, validates each field by type, and surfaces
// inline error messages directly next to the offending field.
// =============================================================

function stripHtml(str) {
    return str.replace(/<[^>]*>/g, '').trim();
}

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validateField(field) {
    if (field.type === 'hidden' || field.type === 'radio' || field.type === 'checkbox') return null;
    const name = field.name;
    if (!name || name === 'hp_name' || name === 'botcheck' || name === 'access_key') return null;

    const isRequired = field.hasAttribute('required');
    const value = field.tagName === 'SELECT' ? field.value : stripHtml(field.value);

    switch (name) {
        case 'name':
            if (!value || value.length < 2)
                return isRequired ? 'Please enter your full name (at least 2 characters).' : null;
            if (!/^[A-Za-z\s'\-]{2,100}$/.test(value))
                return 'Name should contain letters and spaces only — no numbers or symbols.';
            return null;

        case 'email':
            if (!value) return isRequired ? 'Please enter your email address.' : null;
            if (!EMAIL_RE.test(value))
                return 'Please enter a valid email address (e.g. you@example.com).';
            return null;

        case 'phone':
            if (!value) return isRequired ? 'Please enter your phone number.' : null;
            if (!/^0[234]\d{8}$/.test(value.replace(/\D/g, '')))
                return 'Please enter an Australian number starting with 04, 02, or 03 — 10 digits (e.g. 0412 345 678).';
            return null;

        case 'message':
            if (!value) return isRequired ? 'Please tell us a little about what you need.' : null;
            if (value.length < 10) return 'Please provide a bit more detail — at least 10 characters.';
            if (value.length > 1000) return 'Message is too long — please keep it under 1000 characters.';
            return null;

        default:
            if (name === 'suburb' && field.tagName !== 'SELECT' && value)
                if (!/^[A-Za-z\s'\-]{2,}$/.test(value))
                    return 'Suburb should contain letters and spaces only.';
            if (isRequired && !value) return 'Please complete this field.';
            return null;
    }
}

function showFieldError(field, message) {
    const existing = field.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
    const err = document.createElement('span');
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    err.setAttribute('aria-live', 'polite');
    err.textContent = message;
    field.parentNode.appendChild(err);
    field.classList.add('input-error');
    field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
    const existing = field.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
    field.classList.remove('input-error');
    field.removeAttribute('aria-invalid');
}

function updateSubmitButton(form) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const required = Array.from(form.querySelectorAll('[required]'))
        .filter(f => f.type !== 'radio' && f.type !== 'checkbox' && f.type !== 'hidden');
    btn.disabled = !required.every(f => validateField(f) === null);
}

function showFormSuccess(form) {
    const nameField = form.querySelector('input[name="name"]');
    const firstName = nameField
        ? stripHtml(nameField.value).split(' ')[0].replace(/[^A-Za-z'\-]/g, '')
        : '';

    const div = document.createElement('div');
    div.className = 'form-success';
    div.setAttribute('role', 'alert');
    div.setAttribute('aria-live', 'polite');
    div.innerHTML =
        '<div class="form-success-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"' +
            ' stroke-linecap="round" stroke-linejoin="round" width="40" height="40">' +
            '<polyline points="20 6 9 17 4 12"/></svg>' +
        '</div>' +
        '<h3 class="form-success-heading"></h3>' +
        '<p class="form-success-message">We\'ve received your enquiry and a member of our' +
        ' care team will be in touch shortly \u2014 usually within the hour.</p>' +
        '<a href="tel:0469371121" class="form-success-call">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
            ' width="16" height="16" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18' +
            ' 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2' +
            ' 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45' +
            ' 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339' +
            ' 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
            'Or call us now: 0469\u202f371\u202f121' +
        '</a>';

    // Set heading safely via textContent — never concatenate user data into innerHTML
    div.querySelector('.form-success-heading').textContent =
        'Thank you' + (firstName ? ', ' + firstName : '') + '!';

    form.style.display = 'none';
    form.insertAdjacentElement('afterend', div);
}

function attachFormValidation(form) {
    updateSubmitButton(form);
    form.querySelectorAll(
        'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])' +
        ':not([name="hp_name"]):not([name="botcheck"]), textarea, select'
    ).forEach(field => {
        field.addEventListener('blur', () => {
            const v = field.tagName === 'SELECT' ? field.value : stripHtml(field.value);
            const err = validateField(field);
            if (err && (field.hasAttribute('required') || v.length > 0)) showFieldError(field, err);
            else clearFieldError(field);
            updateSubmitButton(form);
        });
        const onInput = () => {
            if (field.classList.contains('input-error')) {
                const err = validateField(field);
                if (!err) clearFieldError(field);
                else {
                    const span = field.parentNode.querySelector('.field-error');
                    if (span) span.textContent = err;
                }
            }
            updateSubmitButton(form);
        };
        field.addEventListener('input', onInput);
        field.addEventListener('change', onInput);
    });
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

function buildDynamicSubject(baseSubject, personName) {
    if (!personName) return baseSubject;
    const dashIdx = baseSubject.indexOf(' \u2014 ');
    if (dashIdx !== -1) {
        return baseSubject.slice(0, dashIdx) + ' from ' + personName + baseSubject.slice(dashIdx);
    }
    return baseSubject + ' from ' + personName;
}

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

    // Per-field validation with inline error display
    let hasErrors = false;
    form.querySelectorAll(
        'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])' +
        ':not([name="hp_name"]):not([name="botcheck"]), textarea, select'
    ).forEach(field => {
        const err = validateField(field);
        if (err) { showFieldError(field, err); hasErrors = true; }
        else clearFieldError(field);
    });

    if (hasErrors) {
        const first = form.querySelector('.input-error');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // --- Security checks before touching the network ---
    const rateLimitError = checkRateLimit();
    if (rateLimitError) {
        showFormError(btn, rateLimitError, originalText);
        return;
    }

    // Text honeypot — silently fake success if a bot filled it
    const hpField = form.querySelector('input[name="hp_name"]');
    if (hpField && hpField.value.trim() !== '') {
        showFormSuccess(form);
        return;
    }

    // --- Proceed with submission ---
    btn.textContent = 'Sending\u2026';
    btn.disabled = true;

    const data = new FormData(form);

    // Sanitize text inputs before sending
    ['name', 'email', 'phone', 'message'].forEach(fieldName => {
        if (data.has(fieldName)) data.set(fieldName, stripHtml(data.get(fieldName)));
    });
    data.delete('hp_name');

    data.set('access_key', WEB3FORMS_KEY);

    const formId = form.id;
    const baseSubject = FORM_SUBJECTS[formId] || 'New Enquiry \u2014 jpeerhealth.com';
    const nameField = form.querySelector('input[name="name"]');
    const personName = nameField ? stripHtml(nameField.value) : '';
    data.set('subject', buildDynamicSubject(baseSubject, personName));

    if (!data.has('botcheck')) data.set('botcheck', '');
    data.set('from_page', window.location.href);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (result.success) {
            recordSubmission();
            showFormSuccess(form);
        } else {
            throw new Error('Submission failed');
        }

    } catch {
        showFormError(btn, 'Something went wrong — call us on 0469 371 121', originalText);
        btn.disabled = false;
    }
}

// Attach submit handler to all named forms
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
// === HONEYPOT INJECTION & REAL-TIME VALIDATION SETUP ===
// Inject a visually-hidden text honeypot into every form.
// Bots auto-fill visible-looking hidden fields; humans never do.
// =============================================================

document.querySelectorAll('form[id]').forEach(form => {
    if (form.querySelector('[name="hp_name"]')) return;
    const hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'hp_name';
    hp.tabIndex = -1;
    hp.setAttribute('autocomplete', 'off');
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;' +
                       'opacity:0;pointer-events:none;';
    form.appendChild(hp);
});

// Attach real-time validation + submit-button gating to every form
['contactForm', 'callbackForm', 'enquiryForm', 'guideForm', 'pricingEnquiryForm', 'consultForm'].forEach(id => {
    const form = document.getElementById(id);
    if (form) attachFormValidation(form);
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

// Consult form submission (inline modal — uses same rate limiting and validation)
if (consultForm) {
    consultForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = document.getElementById('consultSubmitBtn');
        if (!btn) return;

        const originalText = btn.textContent.trim();

        // Per-field validation with inline error display
        let hasErrors = false;
        consultForm.querySelectorAll(
            'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])' +
            ':not([name="hp_name"]):not([name="botcheck"]), textarea, select'
        ).forEach(field => {
            const err = validateField(field);
            if (err) { showFieldError(field, err); hasErrors = true; }
            else clearFieldError(field);
        });

        if (hasErrors) return;

        // Security checks
        const rateLimitError = checkRateLimit();
        if (rateLimitError) {
            showFormError(btn, rateLimitError, originalText);
            return;
        }

        // Text honeypot
        const hpField = consultForm.querySelector('input[name="hp_name"]');
        if (hpField && hpField.value.trim() !== '') {
            showFormSuccess(consultForm);
            return;
        }

        btn.textContent = 'Sending\u2026';
        btn.disabled = true;

        const data = new FormData(consultForm);
        ['name', 'email', 'phone', 'message'].forEach(fieldName => {
            if (data.has(fieldName)) data.set(fieldName, stripHtml(data.get(fieldName)));
        });
        data.delete('hp_name');

        data.set('access_key', WEB3FORMS_KEY);
        const consultNameField = consultForm.querySelector('input[name="name"]');
        const consultPersonName = consultNameField ? stripHtml(consultNameField.value) : '';
        data.set('subject', buildDynamicSubject('Free Consultation Request \u2014 jpeerhealth.com', consultPersonName));
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
                showFormSuccess(consultForm);
            } else {
                throw new Error('Submission failed');
            }
        } catch {
            showFormError(btn, 'Something went wrong — please call 0469 371 121', originalText);
            btn.disabled = false;
        }
    });
}
