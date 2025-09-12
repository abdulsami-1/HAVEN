// Bootstrap form validation
(() => {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
})()

// Tax toggle
function setupTaxToggle() {
  const taxToggle = document.querySelector('.tax-toggle');
  const taxSwitch = document.querySelector('#flexSwitchCheckDefault');
  
  if (!taxToggle || !taxSwitch) return;
  
  const basePrices = new Map();
  
  function initializeBasePrices() {
    const priceElements = document.querySelectorAll('.listing-price');
    priceElements.forEach((priceEl, index) => {
      const priceText = priceEl.childNodes[0].textContent;
      const displayedPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
      // Since we're showing total price initially, calculate base price
      const basePrice = Math.round(displayedPrice / 1.15);
      if (!isNaN(basePrice) && basePrice > 0) {
        basePrices.set(index, basePrice);
      }
    });
  }
  
  function updatePrices(showBeforeTaxes) {
    const priceElements = document.querySelectorAll('.listing-price');
    
    priceElements.forEach((priceEl, index) => {
      const basePrice = basePrices.get(index);
      if (!basePrice || isNaN(basePrice)) return;
      
      if (showBeforeTaxes) {
        // Toggle ON: Show base price WITHOUT taxes (before taxes)
        priceEl.childNodes[0].textContent = `$${basePrice.toLocaleString('en-US')} `;
        const taxInfo = priceEl.querySelector('.tax-info');
        if (taxInfo) {
          taxInfo.textContent = 'before taxes';
          taxInfo.style.display = 'inline';
        }
      } else {
        // Toggle OFF: Show total price WITH taxes included (default)
        const totalPrice = Math.round(basePrice * 1.15);
        priceEl.childNodes[0].textContent = `$${totalPrice.toLocaleString('en-US')} `;
        const taxInfo = priceEl.querySelector('.tax-info');
        if (taxInfo) {
          taxInfo.textContent = '+15% GST';
          taxInfo.style.display = 'inline';
        }
      }
    });
  }
  
  taxSwitch.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    taxToggle.setAttribute('aria-pressed', String(isChecked));
    updatePrices(isChecked); // isChecked = true means show prices before taxes
    
    if (isChecked) {
      taxToggle.style.backgroundColor = '#f1f1f1';
      taxToggle.style.borderColor = '#222222';
    } else {
      taxToggle.style.backgroundColor = '#ffffff';
      taxToggle.style.borderColor = '#ebebeb';
    }
  });
  
  taxToggle.addEventListener('click', (e) => {
    if (e.target === taxSwitch) return;
    taxSwitch.checked = !taxSwitch.checked;
    taxSwitch.dispatchEvent(new Event('change'));
  });
  
  initializeBasePrices();
  updatePrices(false); // Start with total prices (taxes included)
}

// Filter navigation
function setupFilterNav() {
  const scroll = document.querySelector('.filter-scroll');
  const prev = document.querySelector('.filter-prev');
  const next = document.querySelector('.filter-next');
  
  // Only setup if all elements exist
  if (!scroll) return;
  if (!prev || !next) return;
  
  const step = 240;
  prev.addEventListener('click', () => scroll.scrollBy({left: -step, behavior: 'smooth'}));
  next.addEventListener('click', () => scroll.scrollBy({left: step, behavior: 'smooth'}));
}


// User menu
function setupUserMenu() {
  const wrapper = document.getElementById('userMenuWrapper');
  if (!wrapper) return;
  const btn = wrapper.querySelector('#userMenuBtn');
  const pop = wrapper.querySelector('#userPopover');
  if (!btn || !pop) return;

  function open() {
    pop.classList.add('open');
    pop.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    pop.classList.remove('open');
    pop.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = pop.classList.contains('open');
    isOpen ? close() : open();
  });

  document.addEventListener('click', (e) => {
    if (!pop.classList.contains('open')) return;
    if (wrapper.contains(e.target)) return;
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// Mobile menu
function setupMobileMenu() {
  const wrapper = document.getElementById('mobileMenuWrapper');
  if (!wrapper) return;
  const btn = wrapper.querySelector('#mobileMenuBtn');
  const pop = wrapper.querySelector('#mobilePopover');
  if (!btn || !pop) return;

  function open() {
    pop.classList.add('open');
    pop.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    pop.classList.remove('open');
    pop.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = pop.classList.contains('open');
    isOpen ? close() : open();
  });

  document.addEventListener('click', (e) => {
    if (!pop.classList.contains('open')) return;
    if (wrapper.contains(e.target)) return;
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupFilterNav();
  setupUserMenu();
  setupMobileMenu();
  setupTaxToggle();
  setupFlashAutoDismiss();
});

// Flash alerts auto-dismiss
function setupFlashAutoDismiss() {
  const alerts = document.querySelectorAll('.flash-alert[data-auto-dismiss="true"]');
  alerts.forEach((alertEl) => {
    setTimeout(() => {
      if (window.bootstrap && bootstrap.Alert) {
        try { new bootstrap.Alert(alertEl).close(); return; } catch (e) {}
      }
      alertEl.classList.remove('show');
      setTimeout(() => alertEl.remove(), 150);
    }, 10000);
  });
}
