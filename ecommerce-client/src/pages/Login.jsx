import { Link, useNavigate } from "react-router-dom"; // ← added useNavigate (better than window.location)
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // ← added error state

  const navigate = useNavigate(); // ← recommended over window.location.href

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please check your credentials.");
      }

      // Success → save token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          email: data.email,
          id: data._id,
          role: data.role,
        })
      );

      // Optional: small success toast/alert
      alert("Login successful!");

      // Redirect based on role (using navigate – SPA friendly)
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-300 to-base-200 p-4 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(var(--p)/0.08),transparent_40%)] pointer-events-none" />

      <div className="card w-full max-w-md shadow-2xl bg-base-100/60 backdrop-blur-2xl border border-base-content/5 rounded-3xl overflow-hidden relative z-10">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

        <div className="card-body p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-base-content/70">Sign in to continue</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6 text-sm">
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all duration-200">
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

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1.5">
                <span className="label-text font-semibold">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all duration-200">
                <Lock className="h-5 w-5 text-base-content/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="grow placeholder:text-base-content/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </label>

              <div className="label mt-1.5">
                <a href="#" className="label-text-alt link link-hover text-primary font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Remember me */}
            <div className="form-control">
              <label className="cursor-pointer label justify-start gap-3 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  defaultChecked
                  disabled={isLoading}
                />
                <span className="label-text text-base-content/80">Keep me signed in</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="divider my-8 text-base-content/60">OR CONTINUE WITH</div>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-outline rounded-xl hover:bg-red-50/10 border-base-content/20" disabled={isLoading}>
              Google
            </button>
            <button className="btn btn-outline rounded-xl hover:bg-gray-50/10 border-base-content/20" disabled={isLoading}>
              Apple
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-base-content/70">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;