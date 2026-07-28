function SectionHeader({
  title,
  highlight,
  subtitle,
  level = 2,
  className = "",
  titleClassName = "",
}) {
  const renderTitleContent = () => {
    if (!highlight || !title.includes(highlight)) {
      return title;
    }

    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="text-red-600">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  const defaultClasses =
    level === 1
      ? "text-4xl font-bold mb-10 mt-4"
      : level === 3
      ? "text-lg font-semibold mb-4 text-gray-300"
      : "text-3xl font-bold mb-8";

  const Tag = level === 1 ? "h1" : level === 3 ? "h3" : "h2";

  return (
    <div className={className}>
      <Tag className={`${defaultClasses} ${titleClassName}`}>
        {renderTitleContent()}
      </Tag>
      {subtitle && <p className="text-gray-400 mb-12">{subtitle}</p>}
    </div>
  );
}

export default SectionHeader;
