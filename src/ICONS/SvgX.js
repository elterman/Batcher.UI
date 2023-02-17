import { RED } from "../const";
import { useRecoilValue } from "recoil";
import { invertHex } from "../utils";
import { light_theme } from "../_atoms";

const Icon = ({ style = {}, width, color = RED, viewBox = '0 0 100 100' }) => {
  const invert = useRecoilValue(light_theme);

  if (invert) {
    color = invertHex(RED);
  }

  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <path strokeWidth={18} stroke={color} strokeLinecap="round" fill="none" d="M18,18 L82,82 M82,18 18,82" />
    </svg>
  );
};

export default Icon;
