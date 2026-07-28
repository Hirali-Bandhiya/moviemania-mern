import MovieCard from "./MovieCard";

function MovieGrid({
  movies = [],
  className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6",
  onRemoveFromContinue,
}) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className={className}>
      {movies.map((movie) => {
        const key = movie._id || movie.id;
        return (
          <MovieCard
            key={key}
            movie={movie}
            requirePlanForAccess={movie.requirePlanForAccess}
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
