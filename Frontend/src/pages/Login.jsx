import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UtensilsCrossed,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", form);

      loginUser(data.user, data.token);

      toast.success("Login successful!");

      if (data.user?.role === "student") {
        navigate("/");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fff7ed] text-[#171717]">
      {/* NAVBAR */}
      <header className="relative z-20 h-[58px] w-full bg-gradient-to-r from-[#ff5a00] to-[#ff7900] text-white">
        <div className="mx-auto flex h-full max-w-[1250px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/login" className="flex items-center gap-2.5">
            <UtensilsCrossed size={27} strokeWidth={2.6} />

            <span className="text-[23px] font-extrabold tracking-tight">
              KhanaQuick
            </span>
          </Link>

          <nav className="flex items-center gap-5">
            <Link
              to="/login"
              className="text-sm font-semibold transition hover:text-orange-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#f45b0b] transition hover:bg-orange-50"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN BACKGROUND */}
      <main className="relative isolate flex min-h-[calc(100vh-58px)] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#fffaf2] via-[#fff4e6] to-[#ffedd8] lg:h-[calc(100vh-58px)] lg:min-h-0">
        {/* DECORATIVE BACKGROUND SHAPES */}
        <div className="pointer-events-none absolute -left-[170px] -top-[180px] -z-10 h-[430px] w-[430px] rounded-full bg-[#ffd39a]/70" />

        <div className="pointer-events-none absolute -bottom-[240px] left-[22%] -z-10 h-[530px] w-[530px] rounded-full bg-[#ffbd70]/55" />

        <div className="pointer-events-none absolute -right-[180px] top-[30%] -z-10 h-[450px] w-[450px] rounded-full bg-[#ffdcad]/65" />

        {/* CENTERED CONTENT */}
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 items-center gap-7 px-5 py-8 sm:px-8 lg:h-full lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:px-10 lg:py-3">
          {/* LEFT HERO SECTION */}
          <section className="relative left-0 flex min-w-0 flex-col justify-center lg:-translate-y-2 lg:-translate-x-6">
            <div className="mb-4 w-fit rounded-full bg-[#ffe8d0] px-4 py-2 text-sm font-bold text-[#b84b09]">
              Fresh <span className="mx-2 text-[#ff6500]">•</span>
              Fast <span className="mx-2 text-[#ff6500]">•</span>
              Delicious
            </div>

    <h1 className="text-[46px] font-black leading-[1.06] tracking-tight sm:text-[56px] lg:text-[60px] xl:text-[68px]">
  <span className="block">Good food.</span>

  <span className="mt-1 block text-[#ff5c0a]">
    Great mood.
  </span>
</h1>
            <p className="mt-4 max-w-[430px] text-base leading-relaxed text-[#626773] sm:text-lg">
              Your campus cravings, delivered with a tap.
            </p>

            {/* FOOD IMAGE */}
            <div className="relative z-10 h-full w-full -translate-x-12 origin-center scale-[1.05] object-contain object-center drop-shadow-[0_14px_18px_rgba(90,45,10,0.16)] sm:-translate-x-14 sm:scale-[1.15] lg:-translate-x-16 lg:scale-[1.3]">
              <div className="pointer-events-none absolute bottom-0 left-[20%] h-[260px] w-[260px] rounded-full bg-[#ffb85e]/70 sm:h-[300px] sm:w-[300px] lg:h-[320px] lg:w-[320px]" />

              <img
                src="/images/khanaquick-food.png"
                alt="Burger, fries and cold drink"
className="relative z-10 h-full w-full -translate-x-10 origin-center scale-[0.85] object-contain object-center drop-shadow-[0_14px_18px_rgba(90,45,10,0.16)] sm:-translate-x-12 sm:scale-[0.95] lg:-translate-x-14 lg:scale-[1.05]"              />

              <div className="pointer-events-none absolute right-[10%] top-[42%] z-10 flex rotate-[-25deg] gap-2">
                <span className="h-5 w-1.5 rounded-full bg-[#ff7900]" />
                <span className="mt-3 h-4 w-1.5 rounded-full bg-[#ff7900]" />
              </div>
            </div>
          </section>

          {/* RIGHT LOGIN CARD */}
          <section className="flex w-full items-center justify-center lg:justify-end">
            <div className="w-full max-w-[460px] rounded-[24px] border border-white/90 bg-white/95 px-7 py-6 shadow-[0_20px_60px_rgba(150,85,35,0.13)] sm:px-8 sm:py-7 lg:px-9 lg:py-7">
              {/* CARD LOGO */}
              <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#fff0dc]">
                <UtensilsCrossed
                  size={30}
                  strokeWidth={2.4}
                  className="text-[#ff6500]"
                />
              </div>

              {/* WELCOME TEXT */}
              <div className="mt-3 text-center">
                <h2 className="text-[32px] font-extrabold leading-tight tracking-tight">
                  Welcome back!
                </h2>

                <p className="mt-2 text-sm text-[#9299a8]">
                  Log in to order your food
                </p>
              </div>

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[15px] font-semibold text-[#252525]"
                  >
                    Email
                  </label>

                  <div className="flex h-[54px] items-center gap-3 rounded-lg border border-[#dfe2e8] bg-white px-4 transition focus-within:border-[#ff7900] focus-within:ring-2 focus-within:ring-orange-100">
                    <Mail
                      size={18}
                      className="shrink-0 text-[#687386]"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@college.edu"
                      autoComplete="email"
                      required
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-[#a0a7b5]"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[15px] font-semibold text-[#252525]"
                  >
                    Password
                  </label>

                  <div className="flex h-[54px] items-center gap-3 rounded-lg border border-[#dfe2e8] bg-white px-4 transition focus-within:border-[#ff7900] focus-within:ring-2 focus-within:ring-orange-100">
                    <LockKeyhole
                      size={18}
                      className="shrink-0 text-[#687386]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-[#a0a7b5]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="shrink-0 text-[#687386] transition hover:text-[#ff6500]"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-[#ff9418] to-[#ff3d0a] text-base font-bold text-white shadow-sm transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Login"}

                  {!loading && <ArrowRight size={20} />}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="mt-6 border-t border-[#eeeeee]" />

              {/* REGISTER LINK */}
              <p className="mt-5 text-center text-sm text-[#737987]">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#ff5c0a] transition hover:text-[#e94b00] hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}