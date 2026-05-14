import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 mt-20">

      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              MOVIEMANIA
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stream unlimited movies and series anytime, anywhere.
              Experience premium entertainment like never before.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Movies</li>
              <li className="hover:text-white cursor-pointer">Series</li>
              <li className="hover:text-white cursor-pointer">Plans</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Categories
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer">Hollywood</li>
              <li className="hover:text-white cursor-pointer">Bollywood</li>
              <li className="hover:text-white cursor-pointer">Action</li>
              <li className="hover:text-white cursor-pointer">Sci-Fi</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Follow Us
            </h3>

            <div className="flex gap-4 text-gray-400">
              <Facebook className="cursor-pointer hover:text-white transition" />
              <Instagram className="cursor-pointer hover:text-white transition" />
              <Twitter className="cursor-pointer hover:text-white transition" />
              <Youtube className="cursor-pointer hover:text-white transition" />
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} MovieMania. All rights reserved.
        </div>

      </div>

    </footer>
  );
}

export default Footer;