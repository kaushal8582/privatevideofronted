/** Practical email check — requires a domain with at least one dot (e.g. name@site.com). */
export const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const UPI_RE = /^[\w.\-]{2,}@[\w.\-]{2,}$/i;
export const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const ACCOUNT_NUMBER_RE = /^\d{6,32}$/;

export const isValidEmail = (value = '') => EMAIL_RE.test(String(value).trim());

export const validateName = (value = '', { min = 2, max = 120 } = {}) => {
  const name = String(value || '').trim();
  if (!name) return 'Please enter your name.';
  if (name.length < min) return `Name must be at least ${min} characters.`;
  if (name.length > max) return `Name must be under ${max} characters.`;
  return '';
};

export const validateEmail = (value = '') => {
  const email = String(value || '').trim();
  if (!email) return 'Please enter your email.';
  if (!isValidEmail(email)) return 'Please enter a valid email address.';
  return '';
};

export const validatePassword = (value = '', { min = 6 } = {}) => {
  const password = String(value || '');
  if (!password) return 'Please enter your password.';
  if (password.length < min) return `Password must be at least ${min} characters.`;
  return '';
};

export const validateMessage = (value = '', { min = 10, max = 5000 } = {}) => {
  const message = String(value || '').trim();
  if (!message) return 'Please enter a message.';
  if (message.length < min) return `Message must be at least ${min} characters.`;
  if (message.length > max) return `Message must be under ${max} characters.`;
  return '';
};

export const validateUpiId = (value = '') => {
  const upiId = String(value || '').trim();
  if (!upiId) return 'Please enter your UPI ID.';
  if (!UPI_RE.test(upiId)) return 'Enter a valid UPI ID (e.g. name@upi).';
  return '';
};

export const validateIfsc = (value = '') => {
  const ifsc = String(value || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!ifsc) return 'Please enter the IFSC code.';
  if (!IFSC_RE.test(ifsc)) return 'Enter a valid IFSC code.';
  return '';
};

export const validateAccountNumber = (value = '') => {
  const accountNumber = String(value || '').replace(/\s+/g, '');
  if (!accountNumber) return 'Please enter the account number.';
  if (!ACCOUNT_NUMBER_RE.test(accountNumber)) {
    return 'Enter a valid bank account number (6–32 digits).';
  }
  return '';
};
