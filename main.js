const form = document.getElementById('signupForm');
const feedback = document.getElementById('formFeedback');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  const btn = form.querySelector('button');
  const originalText = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Sender...';
  feedback.textContent = '';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    });

    if (res.ok) {
      feedback.textContent = '✓ Takk! Vi holder deg oppdatert.';
      feedback.style.color = '#5B33E6';
      form.reset();
    } else {
      feedback.textContent = 'Noe gikk galt. Prøv igjen.';
      feedback.style.color = '#e53e3e';
    }
  } catch {
    feedback.textContent = 'Noe gikk galt. Prøv igjen.';
    feedback.style.color = '#e53e3e';
  } finally {
    clearTimeout(timeout);
    btn.disabled = false;
    btn.textContent = originalText;
  }
});
