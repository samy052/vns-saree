const CategoryStrip = ({ categories, marqueeCategories, onSelectFabric }) => (
  <div className="bk-category-strip">
    <div className="bk-category-grid bk-category-grid-desktop">
      {categories.map((cat) => (
        <button
          key={cat.name}
          type="button"
          className="bk-category-item"
          onClick={() => onSelectFabric(cat.name)}
        >
          <span className="bk-category-swatch">
            <img src={cat.image} alt={cat.name} />
          </span>
          <span className="bk-category-label">{cat.name}</span>
        </button>
      ))}
    </div>
    <div className="bk-category-grid bk-category-grid-mobile">
      {marqueeCategories.map((cat, index) => (
        <button
          key={`${cat.name}-${index}`}
          type="button"
          className="bk-category-item"
          onClick={() => onSelectFabric(cat.name)}
        >
          <span className="bk-category-swatch">
            <img src={cat.image} alt={cat.name} />
          </span>
          <span className="bk-category-label">{cat.name}</span>
        </button>
      ))}
    </div>
  </div>
);

export default CategoryStrip;
