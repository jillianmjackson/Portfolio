// Copies the email address on click and briefly shows "Copied!" in its place.
document.querySelectorAll('.copy-email').forEach(btn => {
  const email = btn.dataset.email;
  let timer;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback for browsers/contexts without the async Clipboard API
      const field = document.createElement('textarea');
      field.value = email;
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }

    btn.textContent = 'Copied!';
    btn.classList.add('is-copied');
    clearTimeout(timer);
    timer = setTimeout(() => {
      btn.textContent = email;
      btn.classList.remove('is-copied');
    }, 1500);
  });
});
