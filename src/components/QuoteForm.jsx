import { useRef, useState } from "react";
import validator from 'validator';
import styles from './QuoteForm.module.css';
import { useQuoteRequest } from '../hooks/useQuoteRequest';
import QuoteResult from './QuoteResult';

const validate = {
  name: (v) => {
    if (!v.trim()) return 'Full name is required.';
    if (v.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email: (v) => {
    if (!v.trim()) return 'Email is required.';
    return validator.isEmail(v.trim()) ? '' : 'Enter a valid email, like name@example.com.';
  },
  phone: (v) => {
    if (!v.trim()) return 'Phone number is required.';
    const digits = v.replace(/[\s\-()]/g, '');
    return /^\+?\d{10,15}$/.test(digits)
      ? ''
      : 'Enter a valid phone number (10 to 15 digits).';
  },
  insuranceType: (v) => (v ? '' : 'Please choose an insurance type.'),
};

const FIELD_ORDER = ['name', 'email', 'phone', 'insuranceType'];

function QuoteForm() {
  const [values, setValues] = useState({ name: '', email: '', phone: '', insuranceType: '' });
  const [errors, setErrors] = useState({});
  const { status, quote, error, submit, retry } = useQuoteRequest();

  const nameRef = useRef(null);
const emailRef = useRef(null);
const phoneRef = useRef(null);
const insuranceTypeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate[name](value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate[name](value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    FIELD_ORDER.forEach((n) => {
      const msg = validate[n](values[n]);
      if (msg) newErrors[n] = msg;
    });
    setErrors(newErrors);

    const firstInvalid = FIELD_ORDER.find((n) => newErrors[n]);
if (firstInvalid) {
  const refs = {
    name: nameRef,
    email: emailRef,
    phone: phoneRef,
    insuranceType: insuranceTypeRef,
  };
  refs[firstInvalid].current.focus();
  return;
}
    submit(values);
  };

  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    required: true,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': `${name}-error`,
    className: errors[name] ? styles.invalid : undefined,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name">Full name</label>
        <input type="text" autoComplete="name" ref={nameRef} {...fieldProps('name')} />
        <p id="name-error" className={styles.error} role="alert">{errors.name}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input type="email" autoComplete="email" ref={emailRef} {...fieldProps('email')} />
        <p id="email-error" className={styles.error} role="alert">{errors.email}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Phone</label>
        <input type="tel" autoComplete="tel" ref={phoneRef} {...fieldProps('phone')} />
        <p id="phone-error" className={styles.error} role="alert">{errors.phone}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="insuranceType">Insurance type</label>
        <select ref={insuranceTypeRef} {...fieldProps('insuranceType')}>
          <option value=""> Select a type</option>
          <option value="health">Health</option>
          <option value="auto">Auto</option>
          <option value="home">Home</option>
          <option value="life">Life</option>
        </select>
        <p id="insuranceType-error" className={styles.error} role="alert">{errors.insuranceType}</p>
      </div>

      <button type="submit" className={styles.button} disabled={status === 'pending'}>
        {status === 'pending' ? 'Sending...' : 'Get my quote'}
      </button>

      <QuoteResult status={status} quote={quote} error={error} onRetry={retry} />
    </form>
  );
}

export default QuoteForm;