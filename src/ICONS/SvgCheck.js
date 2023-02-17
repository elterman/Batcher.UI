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
      <path strokeWidth={18} stroke={color} strokeLinecap="round" strokeLinejoin="round" fill="none" d="M18,53 L45,80 L85,20" />
    </svg>
  );
};

export default Icon;
