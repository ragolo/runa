/* Gallery script widget */

// Utility: Get elements by class name (for compatibility)
function getElementsByClass(searchClass, node, tag) {
    var classElements = [];
    if (node == null) node = document;
    if (tag == null) tag = '*';
    var els = node.getElementsByTagName(tag);
    var elsLen = els.length;
    var pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)');
    for (var i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            classElements[j] = els[i];
            j++;
        }
    }
    return classElements;
}

// Utility: Add event cross-browser
function addEventSimple(el, evt, fn) {
    if (el.addEventListener) el.addEventListener(evt, fn, false);
    else if (el.attachEvent) el.attachEvent('on' + evt, fn);
    else el['on' + evt] = fn;
}

// Create a tab button for a gallery item
function createTabButton(index, dl, dls, tabBar) {
    var tab = document.createElement('li');
    var btn = document.createElement('a');
    btn.href = "#";
    btn.innerHTML = (index + 1);
    btn.title = dl.getElementsByTagName('img')[0].alt;
    addTabButtonHandler(btn, dl, dls, tabBar, index);
    tab.appendChild(btn);
    if (dl.className.indexOf('shown') !== -1) tab.className = 'active';
    return tab;
}

// Add click handler to a tab button
function addTabButtonHandler(btn, dl, dls, tabBar, idx) {
    addEventSimple(btn, 'click', function (e) {
        if (e && e.preventDefault) e.preventDefault();
        else window.event.returnValue = false;
        hideAllGalleryItems(dls);
        showGalleryItem(dl);
        highlightActiveTab(tabBar, idx);
    });
}

// Hide all gallery items
function hideAllGalleryItems(dls) {
    for (var j = 0; j < dls.length; j++) dls[j].className = '';
}

// Show a specific gallery item
function showGalleryItem(dl) {
    dl.className = 'shown';
}

// Highlight the active tab
function highlightActiveTab(tabBar, idx) {
    var tabs = tabBar.getElementsByTagName('li');
    for (var t = 0; t < tabs.length; t++) tabs[t].className = '';
    tabBar.getElementsByTagName('li')[idx].className = 'active';
}

// Create the tab bar for a gallery
function createTabBarForGallery(dls) {
    var tabBar = document.createElement('ul');
    tabBar.className = 'gallery-tabs';
    for (var i = 0; i < dls.length; i++) {
        var tab = createTabButton(i, dls[i], dls, tabBar);
        tabBar.appendChild(tab);
    }
    return tabBar;
}

// Initialize all galleries on the page
function initializeGalleries() {
    var galleries = getElementsByClass('gallery');
    for (var g = 0; g < galleries.length; g++) {
        var gallery = galleries[g];
        var dls = gallery.getElementsByTagName('dl');
        if (dls.length < 2) continue;
        var tabBar = createTabBarForGallery(dls);
        gallery.insertBefore(tabBar, dls[0]);
    }
}

// Entry point: Initialize galleries on window load
addEventSimple(window, 'load', initializeGalleries);