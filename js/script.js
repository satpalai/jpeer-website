/* =============================================================
   J.PEER Health — script.js
   ============================================================= */

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
// === FORM SUBMISSIONS VIA WEB3FORMS ===
//
// Setup instructions:
// 1. Go to https://web3forms.com
// 2. Enter Care@Jpeerhealth.com and click "Create Access Key"
// 3. Copy your access key and replace 77006307-dbcf-4b2c-b606-cbc303a742ea below
// =============================================================

const WEB3FORMS_KEY = '77006307-dbcf-4b2c-b606-cbc303a742ea';

// Subject lines for each form (used in email notifications)
const FORM_SUBJECTS = {
    contactForm:  'New Care Enquiry — jpeerhealth.com',
    callbackForm: 'Callback Request — jpeerhealth.com',
    enquiryForm:  'New Care Enquiry — jpeerhealth.com',
    guideForm:    'Home Care Guide Download Request',
};

/**
 * Submit a form to Web3Forms and handle UI feedback.
 * @param {HTMLFormElement} form
 */
async function submitForm(form) {
    const btn = form.querySelector('button[type="submit"], .btn-submit');
    if (!btn) return;

    const originalText = btn.textContent.trim();
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Build FormData and inject Web3Forms key + subject
    const data = new FormData(form);
    data.set('access_key', WEB3FORMS_KEY);

    const formId = form.id;
    if (FORM_SUBJECTS[formId]) {
        data.set('subject', FORM_SUBJECTS[formId]);
    }

    // Bot-detection honeypot field (hidden, must stay empty)
    if (!data.has('botcheck')) {
        data.set('botcheck', '');
    }

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (result.success) {
            btn.textContent = 'Sent — we\'ll be in touch shortly';
            btn.style.background = '#16a34a';
            form.reset();

            // Show reassurance if it exists
            const reassurance = form.querySelector('.form-reassurance');
            if (reassurance) {
                reassurance.style.color = '#16a34a';
                reassurance.style.fontWeight = '600';
            }

            // Reset button after 6 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                if (reassurance) {
                    reassurance.style.color = '';
                    reassurance.style.fontWeight = '';
                }
            }, 6000);

        } else {
            throw new Error(result.message || 'Submission failed');
        }

    } catch (err) {
        btn.textContent = 'Something went wrong — call us on 0469 371 121';
        btn.style.background = '#dc2626';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 6000);
    }
}

// Attach handler to all forms on the page
['contactForm', 'callbackForm', 'enquiryForm', 'guideForm'].forEach(id => {
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

const consultModal  = document.getElementById('consultModal');
const consultBtn    = document.getElementById('consultBtn');
const modalClose    = document.getElementById('modalClose');
const consultForm   = document.getElementById('consultForm');

function openModal() {
    if (!consultModal) return;
    consultModal.hidden = false;
    document.body.style.overflow = 'hidden';
    // Focus first input after animation
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

// Close on overlay click (not card click)
if (consultModal) {
    consultModal.addEventListener('click', e => {
        if (e.target === consultModal) closeModal();
    });
}

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && consultModal && !consultModal.hidden) closeModal();
});

// Consult form submission
if (consultForm) {
    consultForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = document.getElementById('consultSubmitBtn');
        const originalText = btn.textContent.trim();
        btn.textContent = 'Sending…';
        btn.disabled = true;

        const data = new FormData(consultForm);
        data.set('access_key', WEB3FORMS_KEY);
        data.set('subject', 'Free Consultation Request — jpeerhealth.com');

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: data
            });
            const result = await res.json();

            if (result.success) {
                // Replace form with success message
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
                throw new Error(result.message);
            }
        } catch {
            btn.textContent = 'Something went wrong — please call 0469 371 121';
            btn.style.background = '#dc2626';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 6000);
        }
    });
}
