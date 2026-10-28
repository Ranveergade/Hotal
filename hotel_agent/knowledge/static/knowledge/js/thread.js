/**
 * THREAD / HOTEL INTELLIGENCE — Shared Frontend Controller
 */

// CSRF Token Extractor for Django POST requests
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('mobileToggle');
  const header = document.querySelector('.thread-header');

  if (toggleBtn && header) {
    toggleBtn.addEventListener('click', () => {
      header.classList.toggle('mobile-open');
    });
  }

  // Set minimum date for date inputs to today
  const today = new Date().toISOString().split('T')[0];
  const checkInInput = document.getElementById('checkInInput');
  const checkOutInput = document.getElementById('checkOutInput');

  if (checkInInput) {
    checkInInput.min = today;
    checkInInput.addEventListener('change', () => {
      if (checkOutInput) {
        checkOutInput.min = checkInInput.value;
        if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
          const nextDay = new Date(checkInInput.value);
          nextDay.setDate(nextDay.getDate() + 1);
          checkOutInput.value = nextDay.toISOString().split('T')[0];
        }
      }
    });
  }
});

// Toast / Notification Helper
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('threadToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'threadToastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '24px';
    toastContainer.style.right = '24px';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '8px';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'thread-toast';
  toast.style.background = '#151821';
  toast.style.color = '#F5F3ED';
  toast.style.border = type === 'error' ? '1px solid #E6392E' : '1px solid rgba(255,255,255,0.12)';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '8px';
  toast.style.fontSize = '0.85rem';
  toast.style.fontFamily = "'JetBrains Mono', monospace";
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
  toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(10px)';
  toast.textContent = message;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Safe Text Sanitizer (prevents unsafe HTML injection)
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
