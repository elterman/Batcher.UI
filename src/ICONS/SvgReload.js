import { OFF_WHITE } from '../const';

const Icon = ({ style = {}, width, color = OFF_WHITE, viewBox = '0 0 100 100' }) => {
  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth={11} stroke={color} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* <circle cx='50' cy='55' r='35' stroke='pink'/> */}
        <path d="M85,55 A 35 35 0 1 1 80,37" />
        <polyline fill={color} points="80,15 80,37 58,37 80,15" />
      </g>
    </svg>
  );
};

export default Icon;
