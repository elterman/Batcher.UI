import { useRecoilValue } from "recoil";
import { DARKGREEN, GREEN } from "../const";
import { invertHex } from "../utils";
import { light_theme } from "../_atoms";

const Icon = ({ style = {}, width, color = GREEN, viewBox = '0 0 1000 1000' }) => {
  const invert = useRecoilValue(light_theme);

  if (invert) {
    color = invertHex(DARKGREEN);
  }

  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0000" stroke="none" />
      <g stroke={color} strokeWidth="40">
        <polyline points="500,500 138,360" />
        <polyline points="500,500 500,170" />
        <polyline points="500,500 830,500" />
        <polyline points="500,500 695,800" />
        <polyline points="500,500 270,730" />
      </g>
      <g fill={color}>
        <circle cx="50%" cy="50%" r="107" fill={color} />
        <circle cx="138" cy="360" r="61" fill={color} />
        <circle cx="500" cy="170" r="73" fill={color} />
        <circle cx="830" cy="500" r="95" fill={color} />
        <circle cx="695" cy="800" r="60" fill={color} />
        <circle cx="270" cy="730" r="92" fill={color} />
      </g>
    </svg>
  );
};

export default Icon;
