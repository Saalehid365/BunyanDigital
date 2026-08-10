# Yardley Packaging — eBay Listing Template

**File:** `ebay-listing-template.html`

A reusable HTML description template for Yardley Packaging's eBay listings, branded in their green/white house style. It's pre-filled with a real example (Long Cardboard Boxes, £19.90) so it's ready to use on that listing today, and built so it's quick to reuse for every future product.

---

## 1. How to use it on today's listing (Long Cardboard Boxes)

1. Open `ebay-listing-template.html` in any text editor (Notepad, VS Code, TextEdit).
2. Replace the two placeholder photo blocks with real image links — see **Section 3** below on photo hosting. Everything else in this file is already filled in with real content from the product page.
3. Copy the **entire contents** of the file.
4. In eBay Seller Hub, go to your listing → **Description**. Switch the description editor to **HTML/source mode** — look for a `<>` or "Enter your own HTML" icon near the formatting toolbar (not the default rich-text box).
5. Paste the code in, then use eBay's **Preview** to check it on both desktop and mobile before publishing.

---

## 2. Reusing it for a new product (going forward)

1. Make a copy of `ebay-listing-template.html` and rename it to match the new product, e.g. `bubble-wrap-listing.html`. Keep the original as your master template — never edit it directly for a one-off listing.
2. Open the copy and update these sections only:

   | Section | What to change |
   |---|---|
   | Product Title + Intro | The `<h1>` title and the one-line intro sentence |
   | Photo Block | Swap in the new product's photo URL(s) |
   | Feature Bullets | Rewrite the 4–6 bullets for the new product (keep the icon + **bold label** + sentence style) |
   | Specifications | Update Material, Colour, Size options, Pack quantity, Recyclable, Custom sizing rows |
   | Trust Strip / Delivery / "More from Yardley" / Footer | Usually **no changes needed** — these are store-wide, not product-specific |

3. Search the file for `{{` to find every placeholder that still needs filling in — anything in double curly braces hasn't been written yet.
4. Paste into the new eBay listing the same way as step 4 above.

**Tip:** keep a small spreadsheet (Product name → SKU → template file used) so it's easy to track which listings use which version as your catalogue grows, and so anyone on the team can find and update the right file later.

---

## 3. Hosting photos (important — do this before publishing)

eBay's description editor does **not** let you upload images directly into the HTML — you have to link to an image that's already hosted somewhere with a public HTTPS URL. Options, easiest first:

- **eBay Picture Manager trick:** upload the photo to your listing's main photo gallery first (where you'd normally add listing images), save as a draft, then right-click the uploaded thumbnail in the gallery and "copy image address" — you get an `i.ebayimg.com` link you can paste into the template's `<img src="...">`.
- **Your own website:** since yardleypackaging.co.uk is already live, images already hosted there (e.g. product photos from the site) can be linked to directly, as long as the URL is a direct image file (ends in `.jpg`/`.png`) and is HTTPS.
- Avoid free throwaway image hosts — links can expire or get blocked, which leaves broken images in a live listing.

Recommended photo spec: square (1:1), at least 1600×1600px, plain white background, JPG format.

---

## 4. eBay HTML rules — what NOT to add

eBay actively strips or blocks the following from listing descriptions, so don't add them even if you're editing the template further:

- ❌ `<script>` tags or any JavaScript
- ❌ `<iframe>`, embedded video players, or forms/input fields
- ❌ Links to any website that isn't eBay (this includes **yardleypackaging.co.uk itself** — eBay's Links Policy blocks off-eBay links in listing descriptions and can get a listing taken down). Only reference other Yardley eBay listings or your eBay Store, never the standalone website URL.
- ❌ Google Fonts or any externally-loaded stylesheet — stick to system fonts (Arial/Helvetica), which is what the template already uses
- ❌ Auto-playing audio/video

The template is built entirely from HTML tables and inline styles specifically because these survive eBay's sanitisation reliably — flexbox/grid CSS and `<style>` blocks are more likely to get stripped or render inconsistently across eBay's desktop site, mobile site, and mobile app.

---

## 5. Also fill in eBay's own "Item Specifics" fields

The HTML description is only half of a strong listing. For every product, also fill in eBay's structured **Item Specifics** fields in the listing form itself (Brand, Type, Material, Colour, MPN, etc.) — these directly affect eBay search ranking and filtering, and they're separate from anything in this HTML file.

---

## 6. Quick checklist before hitting publish

- [ ] Title and intro rewritten for this product
- [ ] Real photo URL(s) in place of the placeholder boxes
- [ ] Feature bullets rewritten and accurate
- [ ] Specifications table filled in
- [ ] No `{{` placeholders left in the file (search to confirm)
- [ ] No links to yardleypackaging.co.uk anywhere in the HTML
- [ ] Previewed on both desktop and mobile in eBay's preview tool
- [ ] Item Specifics filled in on the listing form itself
