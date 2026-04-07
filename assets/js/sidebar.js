/**
 * Sidebar Toggle with Local Storage Persistence
 *
 * Saves the sidebar collapsed/expanded state to localStorage so that
 * the preference survives page reloads and new sessions.
 *
 * Storage key : "sidebar-collapsed"
 * Stored value: "true" | "false"
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'sidebar-collapsed';

  /**
   * Read the persisted sidebar state from localStorage.
   * Returns true if the sidebar should be collapsed, false otherwise.
   */
  function isCollapsedInStorage() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (_err) {
      // localStorage may be unavailable (private browsing, quota, etc.)
      return false;
    }
  }

  /**
   * Persist the sidebar state to localStorage.
   * @param {boolean} collapsed - Whether the sidebar is collapsed.
   */
  function saveState(collapsed) {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch (_err) {
      // Silently ignore if storage is unavailable.
    }
  }

  /**
   * Apply the collapsed/expanded class to the sidebar element and
   * update the toggle button's accessible label.
   * @param {HTMLElement} sidebar  - The sidebar element.
   * @param {boolean}     collapsed - Desired state.
   */
  function applySidebarState(sidebar, collapsed) {
    if (collapsed) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }

    // Update every toggle button's aria-label for accessibility.
    var buttons = document.querySelectorAll('[data-sidebar-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        'aria-label',
        collapsed ? 'Buka sidebar' : 'Tutup sidebar'
      );
    }
  }

  /**
   * Initialise sidebar behaviour once the DOM is ready.
   */
  function init() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) {
      return;
    }

    // 1. Restore saved state on load.
    var collapsed = isCollapsedInStorage();
    applySidebarState(sidebar, collapsed);

    // 2. Wire up every toggle button.
    var buttons = document.querySelectorAll('[data-sidebar-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var isNowCollapsed = !sidebar.classList.contains('collapsed');
        applySidebarState(sidebar, isNowCollapsed);
        saveState(isNowCollapsed);
      });
    }
  }

  // Run init when the DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
