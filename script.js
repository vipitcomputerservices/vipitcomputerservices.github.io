const bookingTerms = document.getElementById('bookingTerms');
const bookingBtn = document.getElementById('bookingBtn');

if (bookingTerms && bookingBtn) {
  bookingTerms.addEventListener('change', () => {
    bookingBtn.disabled = !bookingTerms.checked;
  });

  bookingBtn.addEventListener('click', () => {
    if (!bookingBtn.disabled) {
      window.open(bookingBtn.dataset.url, '_blank', 'noopener');
    }
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const company = data.get('company') || '';
    const message = data.get('message') || '';
    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:vipitcomputerservices@gmail.com?subject=${subject}&body=${body}`;
  });
}
