import { useRecoilValue } from "recoil";
import { DARKGREEN, GREEN } from "../const";
import { invertHex } from "../utils";
import { light_theme } from "../_atoms";

const Icon = ({ style = {}, width, color = DARKGREEN, viewBox = '0 0 100 100' }) => {
  const invert = useRecoilValue(light_theme);
  let fill = "#337253";

  if (invert) {
    color = invertHex(color);
    fill = invertHex(GREEN);
  }

  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth={9} stroke={color} strokeLinecap="round" strokeLinejoin="round" fill={fill}>
        <rect width="100%" height="100%" fill="#0000" stroke="none" />
        <path d="M50,40 6,64 50,94 94,64 50,40" />
        <path d="M50,23 6,47 50,77 94,47 50,23" />
        <path d="M50,6 6,30 50,60 94,30 50,6" />
      </g>
    </svg>
  );
};

export default Icon;
