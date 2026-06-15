import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowRight, BedDouble, UtensilsCrossed } from "lucide-react";
import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/8">

      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand col */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-orange-400/20 border border-orange-400/30 flex items-center justify-center">
              <span className="text-orange-300 text-sm leading-none">✦</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">BookEasy</span>
          </div>
          <p className="text-white/35 text-sm leading-relaxed mb-5">
            Platform reservasi hotel &amp; restoran terpercaya di Indonesia. Nikmati pengalaman menginap dan bersantap terbaik.
          </p>
          <div className="flex gap-2">
            {[
              { icon: FaInstagram, href: "#", label: "Instagram" },
              { icon: FaFacebook,  href: "#", label: "Facebook"  },
              { icon: FaXTwitter,  href: "#", label: "X Twitter" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Layanan col */}
        <div>
          <h3 className="text-white/80 text-sm font-semibold mb-4">Layanan</h3>
          <ul className="space-y-2.5">
            {[
              { label: "Hotel & Resort",       to: "/hotels",                   icon: BedDouble       },
              { label: "Restaurant & Dining",  to: "/restaurants",              icon: UtensilsCrossed },
              { label: "Booking Saya",         to: "/my-hotel-bookings",        icon: ArrowRight      },
              { label: "Reservasi Resto",      to: "/my-restaurant-bookings",   icon: ArrowRight      },
            ].map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className="flex items-center gap-2 text-white/35 hover:text-orange-300/80 text-sm transition-colors duration-200">
                  <Icon size={12} className="shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Informasi col */}
        <div>
          <h3 className="text-white/80 text-sm font-semibold mb-4">Informasi</h3>
          <ul className="space-y-2.5">
            {[
              { label: "Tentang Kami",        to: "#" },
              { label: "Kebijakan Privasi",   to: "#" },
              { label: "Syarat & Ketentuan",  to: "#" },
              { label: "Bantuan & FAQ",       to: "#" },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-white/35 hover:text-orange-300/80 text-sm transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact col */}
        <div>
          <h3 className="text-white/80 text-sm font-semibold mb-4">Hubungi Kami</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-orange-400/50 mt-0.5 shrink-0" />
              <p className="text-white/35 text-sm leading-relaxed">
                Jl. Pantai Indah No.88<br />Bali, Indonesia 80361
              </p>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={14} className="text-orange-400/50 shrink-0" />
              <a href="tel:+6281234567890" className="text-white/35 hover:text-orange-300/80 text-sm transition-colors">
                +62 812-3456-7890
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={14} className="text-orange-400/50 shrink-0" />
              <a href="mailto:hello@bookeasy.id" className="text-white/35 hover:text-orange-300/80 text-sm transition-colors">
                hello@bookeasy.id
              </a>
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-white/40 text-xs mb-2">Dapatkan penawaran terbaik:</p>
            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 bg-white/6 border border-white/10 rounded-lg px-3 py-2 text-white/60 placeholder-white/20 text-xs outline-none focus:border-orange-400/40 transition-colors"
              />
              <button className="bg-orange-500/70 hover:bg-orange-500/90 text-white px-3 py-2 rounded-lg transition-colors">
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">
            © 2025 BookEasy · Hotel &amp; Restaurant. All rights reserved.
          </p>
          <p className="text-white/15 text-xs">Made with ♥ in Indonesia</p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;