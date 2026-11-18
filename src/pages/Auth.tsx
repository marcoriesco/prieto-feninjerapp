import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Logo } from '../components/ui';
import { DEMO_ACCOUNT, useApp } from '../store';
import { FAIR } from '../data/fair';
import { maskCnpj, maskPhone } from '../utils';

function AuthHero({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`auth-hero ${compact ? 'compact' : ''}`}>
      <div className="hero-rings" aria-hidden="true" />
      <Logo light size="lg" />
      {!compact && (
        <>
          <p className="auth-edition">
            {FAIR.edition} edição · {FAIR.datesLabel}
          </p>
          <p className="auth-sub">Solicite orçamentos aos expositores, monte sua agenda e chegue preparado à feira.</p>
        </>
      )}
    </div>
  );
}

export function Login() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState(DEMO_ACCOUNT.password);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = login(email, password);
    if (err) setError(err);
    else nav('/', { replace: true });
  };

  const demo = () => {
    login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
    nav('/', { replace: true });
  };

  return (
    <div className="auth">
      <AuthHero />
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>Entrar</h1>
        <button type="button" className="btn btn-dark btn-block" onClick={demo}>
          <Sparkles size={18} /> Entrar com a conta demo
        </button>
        <div className="divider">
          <span>ou use e-mail e senha</span>
        </div>
        <label className="field">
          <span>E-mail</span>
          <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span>Senha</span>
          <div className="input-wrap">
            <input
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="input-icon" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}>
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary btn-block" type="submit">
          Entrar
        </button>
        <div className="demo-hint">
          <strong>Acesso de demonstração</strong>
          <span>
            {DEMO_ACCOUNT.email} · senha <code>{DEMO_ACCOUNT.password}</code>
          </span>
        </div>
        <p className="auth-switch">
          Ainda não tem cadastro? <Link to="/cadastro">Criar conta</Link>
        </p>
      </form>
    </div>
  );
}

export function Register() {
  const { register } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', company: '', cnpj: '', email: '', phone: '', city: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (k === 'cnpj') v = maskCnpj(v);
    if (k === 'phone') v = maskPhone(v);
    setF((s) => ({ ...s, [k]: v }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().split(' ').length < 2) er.name = 'Informe nome e sobrenome.';
    if (!f.company.trim()) er.company = 'Informe o nome da sua empresa.';
    if (f.cnpj.replace(/\D/g, '').length !== 14) er.cnpj = 'O CNPJ precisa ter 14 dígitos.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Digite um e-mail válido.';
    if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Informe um telefone com DDD.';
    if (f.password.length < 6) er.password = 'Use pelo menos 6 caracteres.';
    setErrors(er);
    if (Object.keys(er).length) return;
    const err = register({ ...f, city: f.city || '—' });
    if (err) setFormError(err);
    else nav('/', { replace: true });
  };

  const field = (k: keyof typeof f, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className={`field ${errors[k] ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <small className="field-error">{errors[k]}</small>}
    </label>
  );

  return (
    <div className="auth">
      <AuthHero compact />
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>Criar conta de visitante</h1>
        <p className="muted">Cadastro para lojistas e compradores. Leva menos de 1 minuto.</p>
        {field('name', 'Nome completo', { autoComplete: 'name' })}
        {field('company', 'Empresa / loja', { autoComplete: 'organization' })}
        {field('cnpj', 'CNPJ', { inputMode: 'numeric', placeholder: '00.000.000/0000-00' })}
        {field('email', 'E-mail', { type: 'email', inputMode: 'email', autoComplete: 'email' })}
        {field('phone', 'WhatsApp', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '(00) 00000-0000' })}
        {field('city', 'Cidade / UF (opcional)', { autoComplete: 'address-level2' })}
        {field('password', 'Senha', { type: 'password', autoComplete: 'new-password' })}
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <button className="btn btn-primary btn-block" type="submit">
          Criar conta e entrar
        </button>
        <p className="auth-switch">
          Já tem cadastro? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
