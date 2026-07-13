import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

/* ─── Step indicators ─────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Correo' },
  { id: 2, label: 'Verificación' },
  { id: 3, label: 'Nueva clave' },
];

/* ─── OTP Input component ─────────────────────────────────────────────────── */
const OtpInput = ({ value, onChange }) => {
  const digits = 6;
  const inputs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    next[idx] = val;
    onChange(next.join(''));
    if (val && idx < digits - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits);
    onChange(pasted.padEnd(digits, '').slice(0, digits));
    inputs.current[Math.min(pasted.length, digits - 1)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: digits }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className={`w-11 h-13 text-center text-lg font-bold rounded-xl border transition-all duration-200 bg-white/5 text-white placeholder-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
            value[idx] ? 'border-indigo-400 bg-indigo-500/10' : 'border-white/15'
          }`}
        />
      ))}
    </div>
  );
};

/* ─── Main page ───────────────────────────────────────────────────────────── */
const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1
  const [email, setEmail] = useState('');

  // Step 2
  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Step 3
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Shared
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* ── Countdown for resend OTP ─────────────────────────────────────────── */
  useEffect(() => {
    if (step !== 2) return;
    setResendCountdown(30);
    setCanResend(false);

    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  /* ── Password strength ────────────────────────────────────────────────── */
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0-4
  };

  const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];
  const pwdStrength = getStrength(newPassword);

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Por favor, ingresa tu correo electrónico.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError('Ingresa un correo válido.');

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    setStep(2);
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.replace(/\s/g, '').length < 6)
      return setError('Ingresa el código completo de 6 dígitos.');

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);

    // Simulate wrong code — in real app check with backend
    if (otp !== '123456') {
      return setError('Código incorrecto. Verifica tu correo e inténtalo de nuevo.');
    }
    setStep(3);
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword)
      return setError('Por favor, completa ambos campos.');
    if (newPassword.length < 8)
      return setError('La contraseña debe tener al menos 8 caracteres.');
    if (newPassword !== confirmPassword)
      return setError('Las contraseñas no coinciden.');

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    setStep(4); // success
  };

  const handleResend = async () => {
    if (!canResend) return;
    setOtp('');
    setCanResend(false);
    setResendCountdown(30);
    // restart timer via useEffect dependency (step doesn't change, so manually trigger)
    setResendCountdown(30);
    setCanResend(false);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D2A5E] via-[#3E38A8] to-[#2B2874] flex items-center justify-center p-4 font-sans text-white">

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 pointer-events-none" />

      {/* Card */}
      <div className="relative glass-panel rounded-xl w-full max-w-md p-6 sm:p-8 shadow-2xl flex flex-col z-10 border border-white/10 my-4 sm:my-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-500 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">TaskBoard Académico</h1>
          <p className="text-xs sm:text-sm text-indigo-200">Recuperación de contraseña</p>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                      step > s.id
                        ? 'bg-indigo-500 border-indigo-500 text-white'
                        : step === s.id
                        ? 'border-indigo-400 text-indigo-300 bg-indigo-500/20'
                        : 'border-white/20 text-white/30 bg-white/5'
                    }`}
                  >
                    {step > s.id ? <CheckCircle2 size={14} /> : s.id}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium transition-colors duration-300 ${
                      step >= s.id ? 'text-indigo-200' : 'text-white/30'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 mx-1 mb-4 transition-all duration-300 ${
                      step > s.id ? 'bg-indigo-400' : 'bg-white/15'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-5 text-sm text-center">
            {error}
          </div>
        )}

        {/* ── Step 1: Email ─────────────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-5">
            <div className="text-center mb-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mb-3">
                <Mail size={22} className="text-indigo-300" />
              </div>
              <h2 className="text-base font-semibold text-white mb-1">¿Olvidaste tu contraseña?</h2>
              <p className="text-xs text-indigo-300 leading-relaxed">
                Ingresa tu correo institucional y te enviaremos un código de verificación para restablecer tu acceso.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-indigo-200 mb-1.5" htmlFor="forgot-email">
                Correo electrónico
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@escuela.edu"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><RefreshCw size={15} className="animate-spin" /> Enviando...</span>
              ) : (
                <><span>Enviar código</span><ArrowRight size={16} /></>
              )}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-xs text-indigo-300 hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft size={12} /> Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}

        {/* ── Step 2: OTP ───────────────────────────────────────────────── */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="flex flex-col gap-5">
            <div className="text-center mb-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mb-3">
                <KeyRound size={22} className="text-indigo-300" />
              </div>
              <h2 className="text-base font-semibold text-white mb-1">Revisa tu correo</h2>
              <p className="text-xs text-indigo-300 leading-relaxed">
                Hemos enviado un código de 6 dígitos a{' '}
                <span className="text-indigo-100 font-medium">{email}</span>.
                Ingrésalo a continuación.
              </p>
            </div>

            <OtpInput value={otp} onChange={setOtp} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><RefreshCw size={15} className="animate-spin" /> Verificando...</span>
              ) : (
                <><span>Verificar código</span><ArrowRight size={16} /></>
              )}
            </button>

            {/* Resend */}
            <div className="text-center text-xs text-indigo-300">
              ¿No recibiste el código?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`font-semibold transition-colors ${canResend ? 'text-indigo-200 hover:text-white cursor-pointer' : 'text-white/30 cursor-not-allowed'}`}
              >
                {canResend ? 'Reenviar código' : `Reenviar en ${resendCountdown}s`}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); setOtp(''); }}
                className="text-xs text-indigo-300 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft size={12} /> Cambiar correo
              </button>
            </div>
          </form>
        )}

        {/* ── Step 3: New password ───────────────────────────────────────── */}
        {step === 3 && (
          <form onSubmit={handleStep3} className="flex flex-col gap-5">
            <div className="text-center mb-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mb-3">
                <ShieldCheck size={22} className="text-indigo-300" />
              </div>
              <h2 className="text-base font-semibold text-white mb-1">Crea una nueva contraseña</h2>
              <p className="text-xs text-indigo-300 leading-relaxed">
                Tu nueva contraseña debe tener al menos 8 caracteres.
              </p>
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs font-semibold text-indigo-200 mb-1.5" htmlFor="new-password">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pr-10 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                  aria-label={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          pwdStrength >= level ? strengthColor[pwdStrength] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[10px] font-medium ${strengthColor[pwdStrength].replace('bg-', 'text-')}`}>
                    {strengthLabel[pwdStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-indigo-200 mb-1.5" htmlFor="confirm-password">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-lg p-3 pr-10 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:ring-1 transition-all ${
                    confirmPassword && confirmPassword !== newPassword
                      ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400'
                      : confirmPassword && confirmPassword === newPassword
                      ? 'border-green-500/60 focus:border-green-400 focus:ring-green-400'
                      : 'border-white/10 focus:border-indigo-400 focus:ring-indigo-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                  aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && confirmPassword === newPassword && (
                <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Las contraseñas coinciden
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><RefreshCw size={15} className="animate-spin" /> Guardando...</span>
              ) : (
                <><span>Restablecer contraseña</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>
        )}

        {/* ── Step 4: Success ───────────────────────────────────────────── */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center gap-5 py-2">
            {/* Animated check */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
                <div className="w-14 h-14 rounded-full bg-green-500/25 border border-green-500/40 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">¡Contraseña restablecida!</h2>
              <p className="text-sm text-indigo-200 leading-relaxed">
                Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <span>Ir al inicio de sesión</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-[10px] text-indigo-400">
          © {new Date().getFullYear()} TaskBoard Académico · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
