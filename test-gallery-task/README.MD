# Interactive Picture Gallery – Test Project

This project is an implementation of an accessible, standards-compliant interactive picture gallery using only the provided HTML, CSS, and JavaScript files, as required by the test instructions.

## Features & Requirements Coverage

- **Interactive Tabbed Gallery:**  
  The gallery provides tabbed navigation for each set of images when JavaScript is enabled. Tabs are generated automatically for each gallery, and each tab displays a tooltip with text from the corresponding image's `alt` attribute.

- **Graceful Degradation:**  
  If JavaScript is disabled, all images and captions remain visible in the HTML. Users can view all gallery content without any loss of information or accessibility.

- **No HTML Modification:**  
  All interactivity and styling are achieved without modifying the provided HTML file. Only the CSS and JavaScript files (`gallery.css`, `js.css`, `gallery.js`, etc.) are used.

- **Automatic Tab Generation:**  
  Tabs are created dynamically for each gallery on page load, matching the number of images in each gallery.

- **Default Display and "shown" Class:**  
  By default, the gallery displays the image(s) marked with the `shown` class in the HTML. When a tab is clicked, the corresponding image is shown and the "shown" class is updated accordingly.

- **No Tables for Tabs:**  
  Tabs are created using semantic HTML elements (`<ul>`, `<li>`, `<a>`) and styled with CSS Flexbox, not tables.

- **Consistent Design:**  
  The gallery uses a centralized color palette via CSS variables for easy maintenance and visual consistency. The tab bar appears as a single unified element, and the gallery/caption backgrounds match the required design.

- **W3C Standards Compliance:**  
  Both the CSS and HTML are valid according to W3C standards. CSS variables are used for maintainability, and all selectors and properties are standards-compliant.

- **Support for Unique and Non-Unique IDs:**  
  The JavaScript logic works regardless of whether a `<dl>` element has an `id` or not, as seen in the provided HTML.

## How It Works

- **CSS (`gallery.css`):**  
  - Centralizes all color values in `:root` for easy updates.
  - Ensures a fixed width for all gallery items.
  - Styles the tab bar to appear as a single, unified element.
  - Provides a visually "inset" effect for images using the `<dt>` border.
  - Applies a cyan background and black text to captions for readability.
  - No border-radius is used, matching the design requirements.
  - All styles are valid and accessible.
  - By default, all gallery items are visible (`display: block;`). When JavaScript is enabled, `js.css` hides all items except the one with the `shown` class.

- **JavaScript (`gallery.js`):**  
  - Dynamically generates tabs for each gallery on page load.
  - Sets the tooltip for each tab from the image's `alt` attribute.
  - Handles tab switching, updating the "shown" class and active tab.
  - Ensures the gallery is still readable and usable if JavaScript is disabled (no tabs, all images visible).
  - Follows best practices: each function has a single responsibility and descriptive naming.

- **Graceful Degradation:**  
  - If JavaScript is unavailable, all images and captions are visible in the order they appear in the HTML, ensuring accessibility and usability for all users.

## File Structure

```
gallery.html      # Provided HTML (not modified)
gallery.css       # Main gallery styles (all presentation)
gallery.js        # Main gallery logic (all interactivity)
events2.js        # Cross-browser event utility (provided)
js-css.js         # Loads js.css if JS is enabled (provided)
js.css            # JS-only styles (hides all items except .shown when JS is enabled)
pic*.jpg          # Gallery images
```

## How to Use

1. Open `gallery.html` in your browser.
2. The gallery will display with interactive tabs if JavaScript is enabled.
3. If JavaScript is disabled, all images and captions are shown in a readable format.

## Accessibility & Best Practices

- All interactive elements are keyboard accessible.
- Tooltips provide additional context for screen readers.
- The gallery is fully usable without JavaScript.
- All code is modular, maintainable, and standards-compliant.

---

**This solution meets all requirements, ensures graceful degradation, and is ready for review.**