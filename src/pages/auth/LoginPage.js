import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login, navigate } = useAuth();
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [role, setRole]       = useState('student');
  const [err, setErr]         = useState('');

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    if (!login(email, password, role)) setErr('Invalid credentials');
  };

  /* paste the full JSX form you already wrote,
     swapping handleSubmit → submit, etc. */
}
