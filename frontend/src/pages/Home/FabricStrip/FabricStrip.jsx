import { useNavigate } from "react-router-dom";
import chiffonImg from "../../../assets/fabric/chiffon.png";
import cottonSilkImg from "../../../assets/fabric/cotton_silk.png";
import georgetteImg from "../../../assets/fabric/georgette.png";
import katanSilkImg from "../../../assets/fabric/katan_silk.png";
import khaddiImg from "../../../assets/fabric/khaddi.png";
import organzaImg from "../../../assets/fabric/organza.png";
import satinSilkImg from "../../../assets/fabric/satan_silk.png";
import tissueImg from "../../../assets/fabric/tissue.png";
import "./FabricStrip.css";

const FABRICS = [
  { name: "Katan Silk", image: katanSilkImg },
  { name: "Organza", image: organzaImg },
  { name: "Tissue", image: tissueImg },
  { name: "Chiffon", image: chiffonImg },
  { name: "Georgette", image: georgetteImg },
  { name: "Khaddi", image: khaddiImg },
  { name: "Cotton Silk", image: cottonSilkImg },
  { name: "Satin Silk", image: satinSilkImg },
];

const FabricStrip = () => {
  const navigate = useNavigate();
  const marqueeFabrics = [...FABRICS, ...FABRICS];
  const selectFabric = (name) => {
    navigate(`/collection?fabric=${encodeURIComponent(name)}`);
  };

  return (
  <div className="bk-fabric-strip">
    <div className="bk-fabric-grid bk-fabric-grid-desktop">
      {FABRICS.map((fabric) => (
        <button
          type="button"
          key={fabric.name}
          className="bk-fabric-item"
          onClick={() => selectFabric(fabric.name)}
        >
          <span className="bk-fabric-swatch">
            <img src={fabric.image} alt={fabric.name} />
          </span>
          <span className="bk-fabric-label">{fabric.name}</span>
        </button>
      ))}
    </div>
    <div className="bk-fabric-grid bk-fabric-grid-mobile">
      {marqueeFabrics.map((fabric, index) => (
        <button
          type="button"
          key={`${fabric.name}-${index}`}
          className="bk-fabric-item"
          onClick={() => selectFabric(fabric.name)}
        >
          <span className="bk-fabric-swatch">
            <img src={fabric.image} alt={fabric.name} />
          </span>
          <span className="bk-fabric-label">{fabric.name}</span>
        </button>
      ))}
    </div>
  </div>
  );
};

export default FabricStrip;
