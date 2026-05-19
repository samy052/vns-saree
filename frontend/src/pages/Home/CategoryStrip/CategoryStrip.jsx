import { useNavigate } from "react-router-dom";
import chiffonImg from "../../../assets/fabric/chiffon.png";
import cottonSilkImg from "../../../assets/fabric/cotton_silk.png";
import georgetteImg from "../../../assets/fabric/georgette.png";
import katanSilkImg from "../../../assets/fabric/katan_silk.png";
import khaddiImg from "../../../assets/fabric/khaddi.png";
import organzaImg from "../../../assets/fabric/organza.png";
import satinSilkImg from "../../../assets/fabric/satan_silk.png";
import tissueImg from "../../../assets/fabric/tissue.png";
import "./CategoryStrip.css";

const FABRIC_CATEGORIES = [
  { name: "Katan Silk", image: katanSilkImg },
  { name: "Organza", image: organzaImg },
  { name: "Tissue", image: tissueImg },
  { name: "Chiffon", image: chiffonImg },
  { name: "Georgette", image: georgetteImg },
  { name: "Khaddi", image: khaddiImg },
  { name: "Cotton Silk", image: cottonSilkImg },
  { name: "Satin Silk", image: satinSilkImg },
];

const CategoryStrip = () => {
  const navigate = useNavigate();
  const marqueeCategories = [...FABRIC_CATEGORIES, ...FABRIC_CATEGORIES];
  const selectFabric = (name) => {
    navigate(`/collection?fabric=${encodeURIComponent(name)}`);
  };

  return (
  <div className="bk-category-strip">
    <div className="bk-category-grid bk-category-grid-desktop">
      {FABRIC_CATEGORIES.map((cat) => (
        <button
          type="button"
          key={cat.name}
          className="bk-category-item"
          onClick={() => selectFabric(cat.name)}
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
          type="button"
          key={`${cat.name}-${index}`}
          className="bk-category-item"
          onClick={() => selectFabric(cat.name)}
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
};

export default CategoryStrip;
