import { useRecoilValue } from "recoil";
import { BLUE } from "../const";
import { invertHex } from "../utils";
import { light_theme } from "../_atoms";

const Icon = ({ style = {}, width, color = BLUE, viewBox = '0 0 100 100' }) => {
  const invert = useRecoilValue(light_theme);

  if (invert) {
    color = invertHex('#0040F0');
  }
  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g fill={color}>
        <circle id="dot" cx="50" cy="8" r="8" />
        <use href="#dot" transform="rotate(45,50,50)" />
        <use href="#dot" transform="rotate(-45,50,50)" />
        <use href="#dot" transform="rotate(90,50,50)" />
        <use href="#dot" transform="rotate(-90,50,50)" />
        <use href="#dot" transform="rotate(135,50,50)" />
        <use href="#dot" transform="rotate(-135,50,50)" />
        <use href="#dot" transform="rotate(180,50,50)" />
      </g>
    </svg>
  );
};

export default Icon;
