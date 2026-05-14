function ActorList({ actors = [] }) {
  if (!actors || actors.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {actors.map((actor, index) => (
          <div
            key={index}
            className="bg-white/10 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center"
          >
            <img
              src={actor.image}
              alt={actor.name}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <p className="text-white font-semibold">{actor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActorList;