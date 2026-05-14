import movies from "../data/movies";
import MovieCard from "./MovieCard";

function PopularSection() {

  // Take top 6 highest rated movies
  const popularMovies = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  return (
    <section className="px-8 lg:px-12 py-24 bg-black">

      <h2 className="text-3xl font-bold mb-12">
        Popular Movies
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
        {popularMovies.map(movie => (
          <MovieCard key={movie._id || movie.id} movie={movie} />
        ))}
      </div>

    </section>
  );
}

export default PopularSection;