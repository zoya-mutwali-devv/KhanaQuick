import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  CalendarDays,
  LogOut,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/auth/profile")
      .then(({ data }) => setProfile(data.user))
      .catch((err) =>
        setError(
          err.response?.data?.message || "Could not load profile"
        )
      );
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fff7ed] px-4">
        <div className="rounded-2xl border border-red-100 bg-white px-8 py-7 text-center shadow-lg">
          <p className="font-medium text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#fff7ed]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <UtensilsCrossed size={28} />
          </div>
          <p className="font-medium text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const row =
    "flex items-center gap-4 border-b border-orange-100/80 py-4 last:border-0";

  return (
    <main className="relative min-h-[calc(100vh-58px)] overflow-hidden bg-gradient-to-br from-[#fffaf2] via-[#fff4e8] to-[#ffead5] px-4 py-10 sm:px-6 sm:py-14">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-orange-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Page Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm">
            <User size={16} />
            Your Account
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            My <span className="text-[#ff5c0a]">Profile</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage your account details in one place.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[28px] border border-white bg-white/95 shadow-[0_24px_70px_rgba(154,79,25,0.12)] md:grid-cols-[0.85fr_1.15fr]">
          {/* Left Panel */}
          <section className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#ff6b16] via-[#ff5c0a] to-[#e94800] px-6 py-10 text-center text-white sm:px-10 md:py-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-[30px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full border-[35px] border-white/10" />

            <div className="relative mb-5 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/70 bg-white text-5xl font-black text-[#ff5c0a] shadow-xl sm:h-32 sm:w-32 sm:text-6xl">
              {profile.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <h2 className="relative max-w-full break-words text-2xl font-extrabold sm:text-3xl">
              {profile.name}
            </h2>

            <p className="relative mt-2 max-w-full break-all text-sm text-orange-50">
              {profile.email}
            </p>

            <span className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold capitalize shadow-sm backdrop-blur-sm">
              <Shield size={16} />
              {profile.role}
            </span>

            <div className="relative mt-8 flex items-center gap-2 text-sm text-orange-50">
              <UtensilsCrossed size={17} />
              <span>Welcome to KhanaQuick</span>
            </div>
          </section>

          {/* Right Panel */}
          <section className="flex min-w-0 flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
            <div className="mb-5">
              <h3 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                Account Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your personal information
              </p>
            </div>

            <div className="text-sm">
              <div className={row}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#ff5c0a]">
                  <User size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Full Name
                  </p>
                  <p className="mt-1 break-words text-base font-bold text-gray-800">
                    {profile.name}
                  </p>
                </div>
              </div>

              <div className={row}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#ff5c0a]">
                  <Mail size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Email Address
                  </p>
                  <p className="mt-1 break-all text-base font-bold text-gray-800">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className={row}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#ff5c0a]">
                  <Shield size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Account Role
                  </p>
                  <p className="mt-1 text-base font-bold capitalize text-gray-800">
                    {profile.role}
                  </p>
                </div>
              </div>

              {profile.createdAt && (
                <div className={row}>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#ff5c0a]">
                    <CalendarDays size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Member Since
                    </p>
                    <p className="mt-1 text-base font-bold text-gray-800">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {user?.role === "student" && (
                <Link
                  to="/orders"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff5c0a] px-5 py-3.5 font-bold text-white shadow-md shadow-orange-200 transition duration-200 hover:-translate-y-0.5 hover:bg-[#ed4e00] hover:shadow-lg"
                >
                  <ShoppingBag size={18} />
                  My Orders
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-3.5 font-bold text-gray-700 transition duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-gray-400">
              Thank you for being part of KhanaQuick!
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}