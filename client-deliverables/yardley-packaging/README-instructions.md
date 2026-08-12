# Yardley Packaging — eBay Listing Template

**Files:**
- `ebay-template-generator.html` — **use this one day-to-day.** A form-based generator: fill in a product's title, features and specs, and it outputs ready-to-paste HTML with a live preview. No coding, no manual editing of placeholders.
- `ebay-listing-template.html` — the raw template the generator is built from. Only needed if you want to hand-edit the HTML directly instead of using the generator.
- `assets/yardley-logo-white.png` — the logo file itself, kept here for reference/reuse elsewhere. You don't need to touch it for listings — see below.

A reusable listing description for Yardley Packaging's eBay listings, branded in their green/white house style and real logo. Pre-loaded with a real example (Long Cardboard Boxes, £19.90) so it's ready to use today, and built so any future product takes minutes, not manual HTML editing.

**About the logo:** it's embedded directly inside both HTML files as inline image data, not linked to an external file. That means it always displays correctly with zero extra setup — nothing to host, nothing that can break.

**No product photo in the description:** on purpose. eBay already shows your product photos in its own listing gallery above the description, so putting one inside the description too was just duplicate work for no benefit — it's been left out.

---

## 0. The generator (recommended workflow)

Open `ebay-template-generator.html` in any browser — double-click the file, no install, no internet connection needed (it doesn't call any server; nothing about your listing data leaves your computer).

1. It opens pre-loaded with the Long Cardboard Boxes example. Use **"Clear / New listing"** to start a fresh product, or edit the example fields directly for today's listing.
2. Pick a **Category** from the dropdown (all 13 of Yardley's real categories — Cardboard Boxes, Bubble Wrap, Mailing Bags, Packaging Tapes, etc.). This automatically fills in sensible **Material**, **Colour**, **Recyclable**, **Custom Sizing** and **Feature** suggestions for that product type — everything stays fully editable afterward.
3. Fill in the **Title** and **Intro line**.
4. Adjust the pre-filled **Features** as needed — each one has its own "Choose a preset" dropdown if you want to swap in a different pre-written feature instead of typing one from scratch — and set **Size options** and **Pack quantity** (dimensions are typed freely since every size varies; quantity has a dropdown of common pack sizes).
5. The right-hand panel updates live — a rendered preview on top, the raw HTML underneath.
6. Click **Copy HTML**, then paste it into eBay's listing description (see step 4 below).
7. Click **Download .html** to save a record of that listing's content for your files.

Every dropdown (Material, Colour, Recyclable, Pack Quantity, Custom Sizing, and each Feature) has an **"Other (type below)"** option at the bottom if none of the listed choices fit — picking it reveals a text box to type your own.

It warns you if any field looks like it contains a web address, since links to non-eBay sites aren't allowed in listing descriptions (see Section 3).

Your in-progress form is auto-saved in the browser as you type, so refreshing the page won't lose your work — but it only remembers the *last* listing you were editing, not a history of every one, so download or copy-paste each listing's HTML before starting the next.

**Where to keep it:** it's a single file with no dependencies, so it works equally well:
- kept on a shared drive or emailed to whoever lists products, opened locally when needed, or
- uploaded to an unlisted/private page on your own website (e.g. `yardleypackaging.co.uk/tools/ebay-generator.html`) so the whole team can reach it from one link.

Either way, nothing needs installing or hosting on a server — it's just a webpage that runs entirely in the browser.

---

## 1. How to use the raw template directly (manual method)

1. Open `ebay-listing-template.html` in any text editor (Notepad, VS Code, TextEdit). Everything in this file is already filled in with real content from the Long Cardboard Boxes product page.
2. Copy the **entire contents** of the file.
3. In eBay Seller Hub, go to your listing → **Description**. Switch the description editor to **HTML/source mode** — look for a `<>` or "Enter your own HTML" icon near the formatting toolbar (not the default rich-text box).
4. Paste the code in, then use eBay's **Preview** to check it on both desktop and mobile before publishing.

---

## 2. Reusing it for a new product (going forward)

1. Make a copy of `ebay-listing-template.html` and rename it to match the new product, e.g. `bubble-wrap-listing.html`. Keep the original as your master template — never edit it directly for a one-off listing.
2. Open the copy and update these sections only:

   | Section | What to change |
   |---|---|
   | Product Title + Intro | The `<h1>` title and the one-line intro sentence |
   | Feature Bullets | Rewrite the 4–6 bullets for the new product (keep the icon + **bold label** + sentence style) |
   | Specifications | Update Material, Colour, Size options, Pack quantity, Recyclable, Custom sizing rows |
   | Trust Strip / Delivery / "More from Yardley" / Footer | Usually **no changes needed** — these are store-wide, not product-specific |

3. Search the file for `{{` to find every placeholder that still needs filling in — anything in double curly braces hasn't been written yet.
4. Paste into the new eBay listing the same way as step 3 above.

**Tip:** keep a small spreadsheet (Product name → SKU → template file used) so it's easy to track which listings use which version as your catalogue grows, and so anyone on the team can find and update the right file later.

---

## 3. eBay HTML rules — what NOT to add

eBay actively strips or blocks the following from listing descriptions, so don't add them even if you're editing the template further:

- ❌ `<script>` tags or any JavaScript
- ❌ `<iframe>`, embedded video players, or forms/input fields
- ❌ Links to any website that isn't eBay (this includes **yardleypackaging.co.uk itself** — eBay's Links Policy blocks off-eBay links in listing descriptions and can get a listing taken down). Only reference other Yardley eBay listings or your eBay Store, never the standalone website URL.
- ❌ Google Fonts or any externally-loaded stylesheet — stick to system fonts (Arial/Helvetica), which is what the template already uses
- ❌ Auto-playing audio/video

The template is built entirely from HTML tables and inline styles specifically because these survive eBay's sanitisation reliably — flexbox/grid CSS and `<style>` blocks are more likely to get stripped or render inconsistently across eBay's desktop site, mobile site, and mobile app.

---

## 4. Also fill in eBay's own "Item Specifics" fields

The HTML description is only half of a strong listing. For every product, also fill in eBay's structured **Item Specifics** fields in the listing form itself (Brand, Type, Material, Colour, MPN, etc.) — these directly affect eBay search ranking and filtering, and they're separate from anything in this HTML file.

---

## 5. Quick checklist before hitting publish

- [ ] Title and intro written for this product
- [ ] Product photos added to eBay's own listing gallery (not the description — see note above)
- [ ] Feature bullets written and accurate
- [ ] Specifications table filled in
- [ ] No `{{` placeholders left, if editing the raw template by hand
- [ ] No links to yardleypackaging.co.uk anywhere in the HTML (the generator warns you about this automatically)
- [ ] Previewed on both desktop and mobile in eBay's preview tool
- [ ] Item Specifics filled in on the listing form itself
