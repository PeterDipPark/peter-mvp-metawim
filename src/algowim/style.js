/**
 * Is Internet Explorer
 * @type {Boolean}
 */
const isIE = typeof navigator != "undefined" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);

/**
 * Installs the styles string into the window that contains opt_element.
 * @param {string} stylesString The style string to install.
 * @return {Element|StyleSheet} The style element installed.
 */
export function installStyles (stylesString) {
  const style = hasStyles(stylesString);
  if (style!==null) {
    return style
  }
  const doc = window.document;
  const styleSheet = createStyles(stylesString);

  let head = doc.getElementsByTagName('head')[0];
  // In opera documents are not guaranteed to have a head element, thus we
  // have to make sure one exists before using it.
  if (!head) {
    const body = doc.getElementsByTagName('body')[0];
    head = doc.createElement('head');
    body.parentNode.insertBefore(head, body);
  }  
  head.appendChild(styleSheet);
  
  return styleSheet;
};

/**
 * Create Styles
 * @param {string} stylesString The style string to create.
 * @return {Element|StyleSheet} The style element created.
 */
export function createStyles(stylesString) {
  const doc = window.document;
  let styleSheet = null;
  // IE < 11 requires createStyleSheet. Note that doc.createStyleSheet will be
  // undefined as of IE 11.
  if (isIE && doc.createStyleSheet) {
    styleSheet = doc.createStyleSheet();
    setStyles(styleSheet, stylesString);
  } else {
    styleSheet = doc.createElement('style');
    // NOTE(user): Setting styles after the style element has been appended
    // to the head results in a nasty Webkit bug in certain scenarios. Please
    // refer to https://bugs.webkit.org/show_bug.cgi?id=26307 for additional
    // details.
    setStyles(styleSheet, stylesString);
  }
  return styleSheet;

}
/**
 * Removes the styles added by {@link #installStyles}.
 * @param {Element|StyleSheet} styleSheet The value returned by
 *     {@link #installStyles}.
 */
export function uninstallStyles(styleSheet) {
  const node = styleSheet.ownerNode || styleSheet.owningElement ||
      /** @type {Element} */ (styleSheet);
  const head = document.getElementsByTagName('head')[0];
  head.removeChild(node);
};

/**
 * [getComputedStyle description]
 * @param  {[type]} element  [description]
 * @param  {[type]} property [description]
 * @return {[type]}          [description]
 */
export function getComputedStyle(element, property) {
  var doc = getOwnerDocument(element);
  if (doc.defaultView && doc.defaultView.getComputedStyle) {
    var styles = doc.defaultView.getComputedStyle(element, null);
    if (styles) {
      // element.style[..] is undefined for browser specific styles
      // as 'filter'.
      return styles[property] || styles.getPropertyValue(property) || '';
    }
  }

  return '';
};


/**
 * [getOwnerDocument description]
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
function getOwnerDocument(node) {
  // TODO(arv): Remove IE5 code.
  // IE5 uses document instead of ownerDocument
  return /** @type {!Document} */ (
      node.nodeType == 9 ? node :
      node.ownerDocument || node.document);
};

/**
 * Sets the content of a style element.  The style element can be any valid
 * style element.  This element will have its content completely replaced by
 * the new stylesString.
 * @param {Element|StyleSheet} element A stylesheet element as returned by
 *     installStyles.
 * @param {string} stylesString The new content of the stylesheet.
 */
function setStyles(element, stylesString) {
  if (isIE && element.cssText !== undefined) {
    // Adding the selectors individually caused the browser to hang if the
    // selector was invalid or there were CSS comments.  Setting the cssText of
    // the style node works fine and ignores CSS that IE doesn't understand.
    // However IE >= 11 doesn't support cssText any more, so we make sure that
    // cssText is a defined property and otherwise fall back to innerHTML.
    element.cssText = stylesString;
  } else {
    element.innerHTML = stylesString;
  }
};

/**
 * Check if the style is already installed
 * @return {Element|Null} Style DOM
 */
function hasStyles(stylesString) {
  const head = document.getElementsByTagName('head')[0];
  let style = null;
  styleloop:
  for (var i = head.childNodes.length - 1; i >= 0; i--) {
      style = head.childNodes[i];
      if (style.tagName && style.tagName=="STYLE") {
        if (isIE && style.cssText !== undefined) {
          if (style.cssText.indexOf(stylesString)===0) {
            break styleloop;
          }
        } else {
          if (style.innerHTML.indexOf(stylesString)===0) {
            break styleloop;
          }
        }
      }
      style = null;
  };
  return style;
}