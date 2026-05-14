import { useState } from "react";
import { getImageUrl } from "../../utils/imageHelper";

function AdminPosterPreview({ posterUrl }) {
  const [imageError, setImageError] = useState(false);

  if (!posterUrl) return null;

  const imageUrl = imageError ? "https://via.placeholder.com/128x192?text=Error" : getImageUrl(posterUrl);

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2">Poster Preview</h4>
      <img
        src={imageUrl}
        alt="Poster Preview"
        className="w-32 h-48 object-cover rounded-lg border"
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
      {imageError && <p className="text-red-500 text-sm mt-2">Invalid image URL</p>}
    </div>
  );
}

export default AdminPosterPreview;