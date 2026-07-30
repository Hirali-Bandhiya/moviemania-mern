import MovieCard from "./MovieCard";

function MovieGrid({
  movies = [],
  className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6",
  onRemoveFromContinue,
}) {
  if (!movies || !Array.isArray(movies) || movies.length === 0) return null;

  const validMovies = movies.filter((m) => m && typeof m === "object");
  if (validMovies.length === 0) return null;

  return (
    <div className={className}>
      {validMovies.map((movie, index) => {
        const key = movie._id || movie.id || `movie-${index}`;
        return (
          <MovieCard
            key={key}
            movie={movie}
            requirePlanForAccess={movie?.requirePlanForAccess}
            onRemoveFromContinue={
              onRemoveFromContinue
                ? () => onRemoveFromContinue(key)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

export default MovieGrid;
