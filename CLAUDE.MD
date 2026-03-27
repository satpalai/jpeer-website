# J.PEER Health — Website Build Guide

## Brand Quick Reference
- **Company Name:** J.PEER Health (always with the period after J)
- **Tagline:** Heartfelt Care
- **Phone:** 0469 371 121
- **Email:** Care@Jpeerhealth.com
- **Availability:** 24/7
- **Service Area:** Dandenong, Clyde, Clyde North, Berwick, Cranbourne, 
  Noble Park, Carrum Downs, Narre Warren, Hallam, Endeavour Hills, Pakenham

## Tech Stack
- HTML, CSS, JavaScript (static site)
- Separate styles.css for all styling
- Separate script.js for all JavaScript
- Google Fonts for typography (use fonts from the branding guide)
- Mobile-first responsive design
- WCAG AA accessible (minimum 16px base font, 4.5:1 contrast ratio)
- Page load under 3 seconds
- All images compressed, WebP format preferred, under 200KB each

## Design Direction
- Warm, trustworthy, human — NOT clinical, corporate, or cold
- Use the J.PEER brand colour palette from the branding guide
- Organic rounded shapes framing photography (per branding guide art direction)
- Subtle animations on scroll and hover — nothing flashy
- Premium but approachable
- Phone number visible in the header on EVERY page (desktop)
- Sticky click-to-call button on mobile on EVERY page
- Every page must have a clear CTA

## Site Architecture
This is a 45+ page site organised into 7 sections:

### Core Pages (Build Phase 1)
- Homepage (index.html)
- About: Our Story, Our Team, Our Values
- Contact page with enquiry form
- Pricing & Fees page

### Service Pages (Build Phase 2)
Each service gets its own page following the service page template:
- Personal Care
- Domestic Assistance
- Social & Community Support
- Nursing & Health Support
- Respite Care
- Dementia & Cognitive Care
- Post-Hospital Care
- 24/7 & Overnight Care
- Support at Home Program (explainer page, 2000+ words)

### Suburb Pages (Build Phase 3)
Each suburb gets its own page following the suburb page template:
- Dandenong, Berwick, Cranbourne, Clyde/Clyde North, Noble Park,
  Carrum Downs, Narre Warren, Hallam, Endeavour Hills, Pakenham

### Language Pages (Build Phase 4)
Each language gets its own page:
- Hindi, Punjabi, Urdu, Tamil, Malay

### Resource Pages (Build Phase 5)
- Blog index + 10 launch posts
- FAQs (20-30 questions with FAQ schema)
- Home Care Guide (lead magnet landing page)
- How to Switch Providers

### Utility Pages (Build Phase 6)
- Privacy Policy
- Terms & Conditions

## URL Structure
jpeerhealth.com/                                → Homepage
jpeerhealth.com/about/our-story                 → Our Story
jpeerhealth.com/about/our-team                  → Our Team
jpeerhealth.com/about/our-values                → Our Values
jpeerhealth.com/services/personal-care          → Service page
jpeerhealth.com/areas/home-care-dandenong       → Suburb page
jpeerhealth.com/languages/hindi-home-care-melbourne → Language page
jpeerhealth.com/pricing                         → Pricing page
jpeerhealth.com/resources/blog                  → Blog index
jpeerhealth.com/resources/faqs                  → FAQs
jpeerhealth.com/contact                         → Contact page

## Folder Structure
/index.html
/about/our-story.html
/about/our-team.html
/about/our-values.html
/services/personal-care.html
/services/domestic-assistance.html
/services/social-community-support.html
/services/nursing-health-support.html
/services/respite-care.html
/services/dementia-care.html
/services/post-hospital-care.html
/services/24-7-overnight-care.html
/services/support-at-home.html
/areas/home-care-dandenong.html
/areas/home-care-berwick.html
(etc for all suburbs)
/languages/hindi-home-care-melbourne.html
(etc for all languages)
/pricing.html
/resources/blog.html
/resources/faqs.html
/resources/home-care-guide.html
/resources/switch-providers.html
/contact.html
/privacy-policy.html
/terms-and-conditions.html
/css/styles.css
/js/script.js
/images/ (all images go here)

## Shared Components (must be identical on every page)

### Header
- J.PEER Health logo (left)
- Phone number: 0469 371 121 (right, click-to-call on mobile)
- Navigation: Home, About (dropdown), Services (dropdown), Areas We Serve 
  (dropdown), Care in Your Language, Pricing, Resources (dropdown), Contact
- Mobile: hamburger menu

### Footer
- J.PEER Health logo
- Phone: 0469 371 121
- Email: Care@Jpeerhealth.com
- Quick links to all main sections
- Service area list
- Languages spoken
- Aged Care Quality and Safety Commission badge
- Support at Home approved provider badge
- ABN displayed
- Complaints process link
- Regulatory contacts: My Aged Care (1800 200 422), OPAN (1800 700 600), 
  ACQSC (1800 951 822)
- Copyright © 2026 J.PEER Health
- Privacy Policy and Terms links

### Sticky Mobile CTA
- Fixed bottom of screen on mobile
- Button text: "Get Your Free Care Consultation"
- Taps to call 0469 371 121

## Content Tone & Language Rules
- Warm, clear, confident, culturally aware, empathetic
- "Home care" (two words, not "homecare")
- "Clients" (not patients, consumers, or service users)
- "Care team" or "carers" (not staff, workers, or resources)
- "Family" or "loved ones" (not stakeholders)
- "Care plan" (not service agreement)
- "Support at Home" (not "Home Care Packages")
- Person-first: "person living with dementia" not "dementia patient"
- Never use: "facility", "intake", "compliance", "affordable"
- Never use pressure language: "Apply now", "Limited spots", "Don't miss out"
- CTA buttons never say "Submit" — use "Send My Enquiry" or "Request a Callback"
- Include reassurance line near forms: "No obligation. We'll call you for a friendly chat."

## SEO Requirements (every page)
- Title tag format: [Primary Keyword] | J.PEER Health — Heartfelt Care (under 60 chars)
- Meta description: 150-160 chars, includes keyword and CTA
- One H1 per page with primary keyword
- Clean URL structure with hyphens
- Internal linking: every page links to 2-3 other pages with descriptive anchor text
- Image alt text: descriptive with keywords
- LocalBusiness schema on every page
- FAQPage schema on FAQ sections
- BreadcrumbList schema sitewide

## Conversion Infrastructure (every page)
- Sticky CTA button on mobile (click-to-call)
- Phone number in header on desktop
- Enquiry form in footer
- "How did you hear about us" dropdown on every form
- Forms must include: name, phone, email, suburb, message, preferred language
```

4. Press **Ctrl+S** to save

**Step 4: Copy the full blueprint into your project**

Your blueprint document has all the detailed copy, section breakdowns, and page-level instructions. Claude Code needs access to it.

1. In VS Code's left sidebar, click the **new file icon**
2. Name it `WEBSITE-BLUEPRINT.md`
3. Open the blueprint file I just read (the one you uploaded). Copy the **entire contents**
4. Paste it all into `WEBSITE-BLUEPRINT.md` in VS Code
5. Press **Ctrl+S** to save

Now Claude Code has two files: `CLAUDE.md` (the build rules) and `WEBSITE-BLUEPRINT.md` (the detailed content plan for every page).

**Step 5: Add your branding assets**

1. In VS Code's Explorer sidebar, right-click the folder → **New Folder** → name it `images`
2. Open File Explorer (Windows key + E) and find your logo files:
   - BLACK_TEXT_LOGO.png
   - BLACK_FULL_LOGO_COMBINED.png
   - WHITE_TEXT_LOGO.png
   - WHITE_FULL_LOGO_COMBINED.png
   - (and any others you have)
3. Copy them into the `images` folder in your project (drag and drop into VS Code's sidebar, or copy/paste through File Explorer into `C:\Users\ladpaal\jpeer-website\images\`)

**Step 6: First Git commit**

1. In VS Code's terminal:
```
git add .
git commit -m "Initial setup with CLAUDE.md, blueprint, and brand assets"
```

---

**PHASE 4 — DESIGN KEY COMPONENTS (HERE IN THIS CHAT)**

**Step 7: Design the homepage hero section**

Come back to this chat and ask me to design your hero. Something like:
```
Design the hero section for J.PEER Health's homepage. 

Headline: "Home care that truly feels like home."
Sub-headline: "Delivered in your language, your way, with the warmth and 
respect your loved one deserves. Serving Melbourne's south-east."
Primary CTA: "Get Your Free Care Consultation — Call 0469 371 121"
Secondary CTA: "Request a Callback"

Use the J.PEER brand colours. Make it warm, premium, mobile-responsive. 
Include space for a hero image. Phone number must be visible.
```

I'll generate the full HTML/CSS.

**Step 8: Design the dual-path selector**

This is the section your blueprint calls out as a key differentiator — two cards: "I need care for myself" and "I'm looking for care for a parent." Ask me to design it.

**Step 9: Design the navigation header**

Ask me to design the full desktop + mobile nav with all your sections and the phone number. This component gets reused on every page, so getting it right early matters.

**Step 10: Save the designed components**

Each time I give you code:
1. Copy it
2. Create the appropriate file in VS Code (e.g. `index.html`)
3. Paste and save
4. Right-click → **Open with Live Server** to preview

---

**PHASE 5 — BUILD PHASE 1: CORE PAGES (IN CLAUDE CODE)**

**Step 11: Launch Claude Code**

1. In VS Code's terminal:
```
cd C:\Users\ladpaal\jpeer-website
claude
```

2. Claude Code starts and reads both your `CLAUDE.md` and detects `WEBSITE-BLUEPRINT.md`.

**Step 12: Build the complete homepage**
```
Build the complete homepage (index.html) following the Homepage Blueprint 
in WEBSITE-BLUEPRINT.md. Include all 10 sections described there: hero, 
dual-path selector, why J.PEER Health, services overview, origin story, 
areas we serve, care in your language, social proof, trust bar, and final 
CTA. Create styles.css and script.js as separate files. If I already have 
designed components in index.html, keep those and build around them.
Use the frontend-design skill for distinctive visuals. Follow all rules 
in CLAUDE.md.
```

**Step 13: Preview, iterate, commit**

1. Right-click `index.html` → **Open with Live Server**
2. Check desktop and mobile (resize your browser)
3. Tell Claude Code any changes you want in plain English
4. When happy, type `/exit` then:
```
git add .
git commit -m "Homepage complete with all sections"
```

**Step 14: Build the About pages**

1. Start `claude` again
2. Build one at a time:
```
Build the Our Story page (about/our-story.html) following the blueprint in 
WEBSITE-BLUEPRINT.md section 4.1. Use the same header, footer, nav, and 
styles.css as the homepage. Include the grandmother origin story, the mission, 
team experience, and CTA. Use the copywriting skill to make the story 
emotionally compelling.
```

3. Preview, iterate, commit
4. Repeat for Our Team and Our Values

**Step 15: Build the Contact page**
```
Build the Contact page (contact.html) following WEBSITE-BLUEPRINT.md section 
4.7. Include the enquiry form with all required fields: name, phone, email, 
suburb, message, preferred language, and "how did you hear about us" dropdown. 
Include click-to-call phone number, email, callback option, Google Map, and 
languages spoken. Button text must say "Send My Enquiry" not "Submit". Include 
reassurance line.
```

Preview, iterate, commit.

**Step 16: Build the Pricing page**
```
Build the Pricing & Fees page (pricing.html) following WEBSITE-BLUEPRINT.md 
section 4.5. This is the most important trust page. Include how pricing works, 
J.PEER's fee structure, Support at Home funding explanation, private pricing, 
comparison context, FAQ section with schema markup, and CTA.
```

Preview, iterate, commit.

---

**PHASE 6 — BUILD PHASE 2: SERVICE PAGES**

**Step 17: Build the service page template first**
```
Create a service page template following the structure in WEBSITE-BLUEPRINT.md 
section 4.2. It should include: H1 with service name + Melbourne, opening 
paragraph about the pain point, what's included with specific tasks, how 
J.PEER delivers differently, who it's for, 3-step process, FAQ section with 
schema markup, testimonial placeholder, and CTA. Use this template to build 
the Personal Care page first (services/personal-care.html).
```

Preview and refine until you're happy with the template.

**Step 18: Build the remaining service pages**
```
Using the same template and styling as the Personal Care page, build all 
remaining service pages:
- services/domestic-assistance.html
- services/social-community-support.html
- services/nursing-health-support.html
- services/respite-care.html
- services/dementia-care.html
- services/post-hospital-care.html
- services/24-7-overnight-care.html
- services/support-at-home.html

Use the copywriting skill to write unique, compelling copy for each one. 
The Support at Home page should be 2000+ words and the most comprehensive 
page on the site. Follow the content direction in WEBSITE-BLUEPRINT.md. 
Each page must have unique content — no duplicating between pages.
```

This is a big ask — Claude Code might do them in batches. Review each page. Commit after each batch.

---

**PHASE 7 — BUILD PHASE 3: SUBURB PAGES**

**Step 19: Build the suburb page template first**
```
Create a suburb page template following WEBSITE-BLUEPRINT.md section 4.3. 
Build it using Home Care Dandenong first (areas/home-care-dandenong.html). 
Include: H1 with suburb name, opening paragraph referencing local landmarks, 
services available, languages spoken, why families choose J.PEER, map embed, 
testimonial placeholder, FAQ with schema, and CTA. Each suburb page must be 
500-700 words of UNIQUE content.
```

**Step 20: Build remaining suburb pages**
```
Using the Dandenong template, build all remaining suburb pages with unique 
content for each. Reference local landmarks, community character, and specific 
demographics. Do NOT copy content between suburb pages:
- areas/home-care-berwick.html
- areas/home-care-cranbourne.html
- areas/home-care-clyde.html
- areas/home-care-noble-park.html
- areas/home-care-carrum-downs.html
- areas/home-care-narre-warren.html
- areas/home-care-hallam.html
- areas/home-care-endeavour-hills.html
- areas/home-care-pakenham.html
```

Commit after each batch.

---

**PHASE 8 — BUILD PHASE 4: LANGUAGE PAGES**

**Step 21: Build the language pages**
```
Create language pages following WEBSITE-BLUEPRINT.md section 4.4. Build all 
five with unique content:
- languages/hindi-home-care-melbourne.html
- languages/punjabi-home-care-melbourne.html
- languages/urdu-home-care-melbourne.html
- languages/tamil-home-care-melbourne.html
- languages/malay-home-care-melbourne.html

Each must explain why language-matched care matters, how J.PEER serves 
that community, suburbs served, services available, and include a greeting 
in the target language. 500-700 words each, all unique.
```

Commit.

---

**PHASE 9 — BUILD PHASE 5: RESOURCE PAGES**

**Step 22: Build the FAQ page**
```
Build the FAQs page (resources/faqs.html) with 20-30 questions organised 
by category: Getting Started, Services, Pricing, Switching Providers, 
Government Funding, About J.PEER Health. Every question must have 
FAQPage schema markup. Use the copywriting skill for clear, helpful answers.
```

**Step 23: Build the How to Switch page**
```
Build the Switch Providers page (resources/switch-providers.html) following 
WEBSITE-BLUEPRINT.md section 4.6. 600-800 words. Simple 3-step process. 
"We handle the transition for you" messaging.
```

**Step 24: Build the Home Care Guide landing page**
```
Build the lead magnet page (resources/home-care-guide.html). This is a 
download page for "The Complete Guide to Home Care in Melbourne." Include 
a gated form: name, email, phone (optional), suburb. Make it compelling 
— explain what's in the guide and why it helps.
```

**Step 25: Build the blog index page**
```
Build the blog index page (resources/blog.html) with cards for the 10 launch 
blog posts listed in WEBSITE-BLUEPRINT.md section 8. For now, create the 
cards linking to placeholder URLs. We'll build individual blog posts later.
```

Commit after each page.

---

**PHASE 10 — BUILD PHASE 6: UTILITY PAGES**

**Step 26: Build legal pages**
```
Build the Privacy Policy (privacy-policy.html) and Terms & Conditions 
(terms-and-conditions.html). The Privacy Policy must comply with Australian 
Privacy Principles under the Privacy Act 1988. Include all required content 
from WEBSITE-BLUEPRINT.md section 4.8.
```

Commit.

---

**PHASE 11 — FINAL POLISH**

**Step 27: Full site review**
```
Do a comprehensive review of the entire site:
1. Check all navigation links work across every page
2. Check mobile hamburger menu works on every page
3. Check the sticky mobile CTA appears on every page
4. Check phone number is in the header on every page
5. Verify consistent styling across all pages
6. Run an SEO check: title tags, meta descriptions, H1s, schema markup
7. Check all internal links use descriptive anchor text
8. Verify every form has the required fields
9. Add hover animations on buttons and cards
10. Check accessibility: contrast ratios, alt text, keyboard navigation
11. Verify no page uses forbidden language (see CLAUDE.md tone rules)
```

**Step 28: Final commit**
```
git add .
git commit -m "Full site complete - all pages, SEO, accessibility reviewed"
```

---

**PHASE 12 — PUT IT ONLINE**

**Step 29: Create a GitHub account**

1. Go to https://github.com → **Sign up** → create account

**Step 30: Create a repository**

1. Click the green **New** button → name it `jpeer-website`
2. Leave it **Public**, don't tick any checkboxes → **Create repository**

**Step 31: Push to GitHub**
```
git remote add origin https://github.com/yourusername/jpeer-website.git
git branch -M main
git push -u origin main