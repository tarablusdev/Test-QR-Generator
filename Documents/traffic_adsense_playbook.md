# Traffic & AdSense Growth Playbook — qubex.it

## Core objective
Maximize pageviews and user engagement so AdSense impressions and RPM rise. Track everything and iterate.

---

## Priority 1 — Technical foundations
- Serve single canonical site `qubex.it/*`. Use subfolders for tools (`/qr/`, `/pdf/`) to concentrate SEO power.  
- Mobile-first design. Ensure mobile content = desktop content. Test with Google mobile tools.  
- Pass Core Web Vitals for most pages. Targets: **LCP ≤ 2.5s**, **INP ≤ 200ms**, **CLS ≤ 0.1** (75th percentile).  
- Use TLS (HTTPS), fast hosting, and CDN (Cloudflare or equivalent). Cache static assets and enable Brotli/GZIP.  
- Provide `robots.txt`, XML sitemap, canonical tags, and structured data for tool pages (FAQ/schema where relevant).  

---

## Priority 2 — On-page SEO and content structure
- Create a homepage hub that links to each tool. Use keyword-rich anchor text.  
- Split features into distinct pages for SEO. Example: `/qr/link`, `/qr/wifi`, `/qr/text`. Each page targets one keyword cluster.  
- Content per tool page: one clear H1, brief intro, step UI, 300–800 words of unique explanatory content, common questions (FAQ block), canonical examples, and internal links to related tools.  
- Use content clusters / pillar pages. One pillar (e.g., “QR codes guide”) links out to specialized pages. Build topical authority.  
- Keywords: prioritize search intent. Target informational long-tail queries first and transactional queries later.  

---

## Priority 3 — AdSense & ad UX
- Follow Google AdSense placement and policy strictly. Label ads as “Advertisement” when needed. Avoid mimicking UI elements.  
- Start with three ad slots per page max. Use responsive ad units.  
- Optimize viewability: place one unit above the fold, one in-content near results, and one in sidebar/footer.  
- Do not push excessive ads on generator result pages. Keep UX primary.  
- Link AdSense with GA4 and Search Console. Track RPM, CTR, impressions per page, and traffic sources.  

---

## Priority 4 — Growth & acquisition tactics
- Content strategy: produce tutorials, “how to use” pages, comparisons, and templates for each tool.  
- Link acquisition: outreach to blogs, guest posts, resource pages, tool roundups, and producthunt/indiehackers launches.  
- Build internal linking funnels. After user completes a tool action, show “Related tools” suggestions.  
- Viral/referrals: add share buttons, prefilled social snippets, direct link copies, and optional embed widgets.  
- PR & listings: submit tools to directories, Chrome extension store (if applicable), and developer forums.  

---

## Priority 5 — Measurement, testing, iterate
- Mandatory stack: Google Search Console, GA4, AdSense reports, Lighthouse/PageSpeed.  
- KPIs: organic sessions, pages per session, bounce rate, session duration, top pages RPM, impressions, CTR, Core Web Vitals.  
- A/B test ad placements on high-traffic pages.  
- Monthly content audit: promote top 20% pages that drive 80% revenue.  

---

## UX & retention
- Fast, minimal UI. One action per page. Avoid intrusive popups.  
- Clear success state: after tool action, show result + usage tips + links to other tools.  
- Optional accounts/bookmarks later if retention impact is measurable.  

---

## Legal & privacy
- Publish Privacy Policy and Terms.  
- Include cookie/consent management (GDPR/CCPA).  
- Implement consent management platform or custom consent for ad personalization.  

---

## Sources (authoritative)
- Google Search Central (SEO).  
- Google AdSense best practices & policies.  
- Web.dev (Core Web Vitals).  
- Backlinko (link building).  
- Cloudflare (performance & CDN).  
