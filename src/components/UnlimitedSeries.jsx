import { useNavigate } from "react-router-dom";
import seriesBg from "../assets/hero/hero4.jpg"; // You can change image if needed

function UnlimitedSeries() {
  const navigate = useNavigate();

  return (
    <section
      className="relative h-[60vh] mt-20 overflow-hidden"
      style={{
        backgroundImage: `url(${seriesBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark + Red Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-black/70 to-black/80"></div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Unlimited Series.<br />
            Endless Entertainment.
          </h2>

          <p className="text-lg text-gray-200 max-w-xl mb-8">
            Stream award-winning web series, Netflix-style originals,
            and blockbuster shows anytime, anywhere.
          </p>

          <button
            onClick={() => navigate("/plans")}
            className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-red-600/30 transition active:scale-95"
          >
            Start Watching
          </button>

        </div>
      </div>
    </section>
  );
}

export default UnlimitedSeries;