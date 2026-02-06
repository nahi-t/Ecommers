// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Home, Lock, Loader2 } from 'lucide-react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // Success → save token & user → auto-login
      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          id: data._id,
          role: data.role || 'user',
        })
      );

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-300 to-base-200 p-4 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(var(--p)/0.08),transparent_40%)] pointer-events-none" />

      <div className="card w-full max-w-lg shadow-2xl bg-base-100/70 backdrop-blur-xl border border-base-content/10 rounded-3xl overflow-hidden relative z-10">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

        <div className="card-body p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-2 text-base-content/70">
              Join us and start shopping
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-6 shadow-sm">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-6 shadow-sm">
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <User className="h-5 w-5 text-base-content/60" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="grow placeholder:text-base-content/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
              </label>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <Mail className="h-5 w-5 text-base-content/60" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="grow placeholder:text-base-content/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </label>
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <Phone className="h-5 w-5 text-base-content/60" />
                <input
                  type="tel"
                  placeholder="+251 9xx xxx xxx"
                  className="grow placeholder:text-base-content/50"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </label>
            </div>

            {/* Address */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold">Address</span>
              </label>
              <textarea
                placeholder="Your full delivery address"
                className="textarea textarea-bordered h-24 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <Lock className="h-5 w-5 text-base-content/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="grow placeholder:text-base-content/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </label>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold">Confirm Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <Lock className="h-5 w-5 text-base-content/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="grow placeholder:text-base-content/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </label>
            </div>

            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-3 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  required
                  disabled={isLoading}
                />
                <span className="label-text text-base-content/80 text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="link link-primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="link link-primary">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="divider my-8 text-base-content/60">OR SIGN UP WITH</div>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-outline rounded-xl hover:bg-red-50/10 border-base-content/20" disabled={isLoading}>
              Google
            </button>
            <button className="btn btn-outline rounded-xl hover:bg-gray-50/10 border-base-content/20" disabled={isLoading}>
              Apple
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-base-content/70">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;