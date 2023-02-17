import { SCALE_UP, SCALE_DOWN, SCALE_100, SCALE_X, SCALE_XY, SCALE_Y } from "../const";

const Icon = ({ style = {}, width, viewBox = '0 0 100 100', color = 'silver', op }) => {
  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      {/* <rect width="100%" height="100%" fill="#0000" stroke="none" /> */}
      <g stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6">
        {op === SCALE_X && (
          <g>
            <path d="M10,20 H90 V80 H10 V20" />
            <path d="M25,50 H75" />
            <path d="M35,40 L25,50 35,60" />
            <path d="M65,40 L75,50 65,60" />
          </g>
        )}
        {op === SCALE_Y && (
          <g>
            <path d="M20,10 V90 H80 V10 H20" />
            <path d="M50,25 V75" />
            <path d="M40,35 L50,25 60,35" />
            <path d="M40,65 L50,75 60,65" />
          </g>
        )}
        {op === SCALE_XY && (
          <g>
            <path d="M10,10 V90 H90 V10 H10" />
            <path d="M50,25 V75" />
            <path d="M40,35 L50,25 60,35" />
            <path d="M40,65 L50,75 60,65" />
            <path d="M25,50 H75" />
            <path d="M35,40 L25,50 35,60" />
            <path d="M65,40 L75,50 65,60" />
          </g>
        )}
        {op === SCALE_DOWN && <path d="M25,50 H75" />}
        {op === SCALE_100 && <circle cx={50} cy={50} r={20} />}
        {op === SCALE_UP && <path d="M50,20 V80 M20,50 H80" />}
      </g>
    </svg>
  );
};

export default Icon;
