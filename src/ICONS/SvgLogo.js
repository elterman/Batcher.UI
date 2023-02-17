import { DARKRED, RED } from '../const';

const Icon = ({ style = {}, width, shadow, viewBox = '0 0 100 100' }) => {
  const color = shadow ? '#0008' : '#56BF8B';
  const fill = shadow ? 'none' : '#337253';

  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth="4">
        <circle cx="50" cy="50" r="48" fill="none" />
        <g fill={fill} strokeLinecap="round" strokeLinejoin="round">
          <path d="M50,38 18,60 50,82 82,60 50,38" />
          <path d="M50,28 18,50 50,72 82,50 50,28" stroke={shadow ? color : RED} fill={shadow ? fill : DARKRED} />
          <path d="M50,18 18,40 50,62 82,40 50,18" />
        </g>
      </g>
    </svg>
  );
};

export default Icon;
