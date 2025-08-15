(function(){
  function validateEmail(value) {
    return /.+@.+\..+/.test(value);
  }

  function initialize() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    const email = document.getElementById('email');
    const consent = document.getElementById('consent');
    const message = document.getElementById('form-message');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      message.textContent = '';

      const errors = [];
      if (!validateEmail(email.value)) errors.push('Enter a valid email.');
      if (!consent.checked) errors.push('Please agree to receive emails.');

      if (errors.length) {
        message.textContent = errors.join(' ');
        message.style.color = '#7f1d1d';
        return;
      }

      // Simulate success
      message.textContent = 'Thanks for subscribing!';
      message.style.color = '#3f6212';
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', initialize);
})(); 