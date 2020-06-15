document.addEventListener('DOMContentLoaded', function () {
  // Variables
  var navOffsetTop =
    document.querySelector('.navbar').getBoundingClientRect().top +
    document.body.scrollTop;
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  function init () {
    // handle menu popovers
    var y = document.querySelectorAll('[data-popover]');
    y.forEach(function (e) {
      e.addEventListener('click', newOpenPopover);
    });
    document.addEventListener('click', newClosePopover);

    // attach click even to all anchor links
    addSmoothScroll();

    // add click event to theme buttons
    document.querySelector('.lightTheme')
      .addEventListener('click', () => { toggleTheme(false); });
    document.querySelector('.darkTheme')
      .addEventListener('click', () => { toggleTheme(true); });
    toggleTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // listener for navbar visibility
    window.addEventListener('scroll', onScroll);

    // prep for html escaping
    buildSnippets();
  }

  /* non-jquery functions */

  function toggleTheme (darkMode) {
    // Add transition class
    document.documentElement.classList.add('transition-theme');

    if (darkMode) {
      // Change data-theme
      document.documentElement.setAttribute('data-theme', 'dark');
      // Update the buttons
      document.querySelector('.lightTheme').classList.remove('button-primary');
      document.querySelector('.darkTheme').classList.add('button-primary');
      // Switch the prettify stylesheets
      document.getElementById('prettify-light').disabled = true;
      document.getElementById('prettify-dark').disabled = false;
    } else {
      // Change data-theme
      document.documentElement.setAttribute('data-theme', 'light');
      // Update the buttons
      document.querySelector('.lightTheme').classList.add('button-primary');
      document.querySelector('.darkTheme').classList.remove('button-primary');
      // Switch the prettify stylesheets
      document.getElementById('prettify-light').disabled = false;
      document.getElementById('prettify-dark').disabled = true;
    }

    // remove transition class
    window.setTimeout(function () {
      document.documentElement.classList.remove('transition-theme');
    }, 1000);
  }

  function addSmoothScroll () {
    var els = document.querySelectorAll('[href^="#"]');
    els.forEach(function (e) {
      e.addEventListener('click', function (i) {
        i.preventDefault();
        var target = e.getAttribute('href');
        document
          .getElementById(target.substring(1))
          .scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function escapeHtml (string) {
    return String(string).replace(/[&<>''/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets () {
    var els = document.querySelectorAll('.code-example-body');
    els.forEach(function (e) {
      var newContent = escapeHtml(e.innerHTML);
      e.innerHTML = newContent;
    });
  }

  function newOpenPopover (e) {
    e.preventDefault();
    newClosePopover();
    var pop = e.target.getAttribute('data-popover');
    var popoverEl = document.getElementById(pop);
    // var popover = $($(this).data('popover'));
    popoverEl.classList.add('open');
    e.stopImmediatePropagation();
  }

  function newClosePopover (e) {
    var x = document.querySelector('.popover.open');
    if (x != null) {
      x.classList.remove('open');
    }
  }

  window.onresize = function () {
    document.body.classList.remove('has-docked-nav');
    var rect = document.querySelector('.navbar').getBoundingClientRect();
    navOffsetTop = rect.top + document.body.scrollTop;
    onScroll();
  };

  function onScroll () {
    var b = document.body;
    if (
      navOffsetTop < window.scrollY &&
      !b.classList.contains('has-docked-nav')
    ) {
      b.classList.add('has-docked-nav');
    }
    if (
      navOffsetTop > window.scrollY &&
      b.classList.contains('has-docked-nav')
    ) {
      b.classList.remove('has-docked-nav');
    }
  }

  init();
});
