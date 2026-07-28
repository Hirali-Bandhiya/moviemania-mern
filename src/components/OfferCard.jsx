import { getImageUrl } from "../utils/imageHelper";
import { formatDate, formatPrice } from "../utils/formatters";

function OfferCard({ offer, onClick, getCountdown }) {
  const isExpired = new Date(offer.validTill) < new Date();
  const movie = offer.movieId;

  if (!movie) return null;

  const primaryImage = movie.image || movie.posterUrl;
  const countdown = getCountdown ? getCountdown(offer.validTill) : "";

  return (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 cursor-pointer group bg-[#1e293b]/50 rounded-2xl shadow-lg border border-white/5 overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-red-500/20"
    >
      <div className="absolute top-4 -right-8 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-lg z-20 pointer-events-none">
        {offer.discountType === "percentage"
          ? `${offer.discountValue}% OFF`
          : `$${offer.discountValue} OFF`}
      </div>

      <div className="relative overflow-hidden h-72">
        <img
          src={getImageUrl(primaryImage)}
          alt={movie.title}
          className={`w-full h-full object-cover transform transition duration-500 ${
            isExpired ? "grayscale" : "group-hover:scale-110"
          }`}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90"></div>

        {isExpired ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform -rotate-12">
              EXPIRED
            </span>
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-2 py-1 rounded shadow z-10 flex items-center gap-1">
            ⏳ {countdown}
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between z-10 bg-gradient-to-b from-[#0f172a] to-[#1e293b]/50 -mt-10 pt-4 rounded-t-3xl border-t border-white/5">
        <div>
          <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate drop-shadow-md">
            {offer.title}
          </h3>
          <p className="text-gray-400 text-xs truncate mb-2">
            {movie.title} • {movie.genre}
          </p>
        </div>

        <div className="mt-2 flex items-end justify-between border-t border-white/10 pt-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(movie.price || 99)}
            </span>
            <span className="text-xl font-black text-red-500 drop-shadow-md">
              {formatPrice(offer.finalPrice)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-white bg-white/10 px-2 py-1 rounded border border-white/5">
              {formatDate(offer.validTill)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferCard;
