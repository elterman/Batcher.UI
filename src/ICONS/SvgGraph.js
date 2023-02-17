import { useRecoilValue } from "recoil";
import { DARKGREEN, GREEN } from "../const";
import { invertHex } from "../utils";
import { light_theme } from "../_atoms";

const Icon = ({ style = {}, width, color = GREEN, viewBox = '0 0 100 100' }) => {
  const invert = useRecoilValue(light_theme);

  if (invert) {
    color = invertHex(DARKGREEN);
  }

  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" fill={color}>
        <rect x="30" y="5" width="40" height="20" />
        <rect x="0" y="40" width="40" height="20" />
        <rect x="0" y="75" width="40" height="20" />
        <rect x="60" y="60" width="40" height="20" />
      </g>
      <g stroke={color} strokeWidth={4} fill="none">
        <polyline points="65,13 15,50" />
        <polyline points="45,15 85,70" />
        <polyline points="20,50 20,80" />
      </g>
    </svg>
  );
};

export default Icon;
