import { useNavigate } from "react-router-dom";
import hero4 from "../assets/hero/hero4.jpg";
import { Play, Info } from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero4})` }}
      >
        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1440px] mx-auto px-8 lg:px-12 flex flex-col justify-end pb-24">

        <div className="max-w-2xl space-y-6">

          {/* Featured Badge */}
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-red-600/20 text-red-500 border border-red-600/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs">
              Featured Today
            </span>

            <span className="text-gray-300 text-xs">
              • 2024 • Action, Sci-Fi • 2h 45m
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
            Unlimited Movies,<br />
            TV Shows and More
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-200 max-w-xl leading-relaxed">
            Experience the next generation of streaming.
            Watch the latest blockbusters and exclusive originals
            in stunning 4K HDR quality.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">

            <button
              onClick={() => navigate("/plans")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:-translate-y-1"
            >
              <Play size={20} />
              Subscribe Now
            </button>

            <button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Info size={20} />
              Learn More
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;