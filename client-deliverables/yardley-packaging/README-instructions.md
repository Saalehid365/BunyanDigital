# Yardley Packaging — eBay Listing Template

**Files:**
- `ebay-template-generator.html` — **use this one day-to-day.** A form-based generator: fill in a product's title, features and specs, and it outputs ready-to-paste HTML with a live preview. No coding, no manual editing of placeholders.
- `ebay-listing-template.html` — the raw template the generator is built from. Only needed if you want to hand-edit the HTML directly instead of using the generator.
- `assets/yardley-logo-white.png` — the logo file itself, kept here for reference/reuse elsewhere. You don't need to touch it for listings — see below.

A reusable listing description for Yardley Packaging's eBay listings, branded in their green/white house style and real logo. Pre-loaded with a real example (Long Cardboard Boxes, £19.90) so it's ready to use today, and built so any future product takes minutes, not manual HTML editing.

**About the logo:** it's embedded directly inside both HTML files as inline image data, not linked to an external file. That means it always displays correctly with zero extra setup — you don't need to host it anywhere, and there's no broken-image risk the way there is with product photos (see Section 3).

---

## 0. The generator (recommended workflow)

Open `ebay-template-generator.html` in any browser — double-click the file, no install, no internet connection needed (it doesn't call any server; nothing about your listing data leaves your computer).

1. It opens pre-loaded with the Long Cardboard Boxes example. Use **"Clear / New listing"** to start a fresh product, or edit the example fields directly for today's listing.
2. Pick a **Category** from the dropdown (all 13 of Yardley's real categories — Cardboard Boxes, Bubble Wrap, Mailing Bags, Packaging Tapes, etc.). This automatically fills in sensible **Material**, **Colour**, **Recyclable**, **Custom Sizing** and **Feature** suggestions for that product type — everything stays fully editable afterward.
3. Fill in the **Title** and **Intro line**, and for the photo, **just drag your product photo in or click to upload it** — no need to touch eBay first. The generator resizes and compresses it automatically and bakes it directly into the HTML, so there's nothing to host separately. (If you'd rather link to a photo you've already uploaded to your eBay listing gallery, click "Paste an image URL instead" — see Section 3 for when that's useful.)
4. Adjust the pre-filled **Features** as needed — each one has its own "Choose a preset" dropdown if you want to swap in a different pre-written feature instead of typing one from scratch — and set **Size options** and **Pack quantity** (dimensions are typed freely since every size varies; quantity has a dropdown of common pack sizes).
5. The right-hand panel updates live — a rendered preview on top, the raw HTML underneath.
6. Click **Copy HTML**, then paste it into eBay's listing description (see step 4 below).
7. Click **Download .html** to save a record of that listing's content for your files.

Every dropdown (Material, Colour, Recyclable, Pack Quantity, Custom Sizing, and each Feature) has an **"Other (type below)"** option at the bottom if none of the listed choices fit — picking it reveals a text box to type your own.

It warns you if any field looks like it contains a web address, since links to non-eBay sites aren't allowed in listing descriptions (see Section 4).

Your in-progress form is auto-saved in the browser as you type, so refreshing the page won't lose your work — but it only remembers the *last* listing you were editing, not a history of every one, so download or copy-paste each listing's HTML before starting the next.

**Where to keep it:** it's a single file with no dependencies, so it works equally well:
- kept on a shared drive or emailed to whoever lists products, opened locally when needed, or
- uploaded to an unlisted/private page on your own website (e.g. `yardleypackaging.co.uk/tools/ebay-generator.html`) so the whole team can reach it from one link.

Either way, nothing needs installing or hosting on a server — it's just a webpage that runs entirely in the browser.

---

## 1. How to use the raw template directly (manual method)

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

## 3. Product photos

**Using the generator (recommended):** just upload the photo — drag it onto the photo box, or click it to browse. It's resized to a sensible size and compressed in your browser, then embedded directly into the listing HTML as the image itself, not a link to one. Nothing to host, nothing that can go "broken image" later, and it's the same photo file you already have on your computer for the product — no need to touch eBay's gallery first.

A small file-size note appears once it's uploaded. If it says the file is large, try a smaller/more compressed source photo — a very large embedded photo makes the listing HTML heavier to load for buyers.

**Editing the raw template by hand, or prefer to link instead:** eBay's description editor doesn't have its own upload button for the description field, so you'd need to link to an image already hosted somewhere with a public HTTPS URL:

- **eBay Picture Manager trick:** upload the photo to your listing's main photo gallery first (where you'd normally add listing images), save as a draft, then right-click the uploaded thumbnail in the gallery and "copy image address" — you get an `i.ebayimg.com` link.
- **Your own website:** since yardleypackaging.co.uk is already live, images already hosted there can be linked to directly, as long as the URL is a direct image file (ends in `.jpg`/`.png`) and is HTTPS.
- Avoid free throwaway image hosts — links can expire or get blocked, which leaves broken images in a live listing.

Recommended photo spec either way: square (1:1) works best, plain white background, JPG or PNG.

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

- [ ] Title and intro written for this product
- [ ] Real product photo uploaded (or a photo URL pasted, if using the manual link method)
- [ ] Feature bullets written and accurate
- [ ] Specifications table filled in
- [ ] No `{{` placeholders left, if editing the raw template by hand
- [ ] No links to yardleypackaging.co.uk anywhere in the HTML (the generator warns you about this automatically)
- [ ] Previewed on both desktop and mobile in eBay's preview tool
- [ ] Item Specifics filled in on the listing form itself
