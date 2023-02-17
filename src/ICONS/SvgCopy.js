const Icon = ({ style = {}, width, color = 'white', viewBox = '0 0 100 100' }) => {
  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polyline points="32,14 32,9 89,9 89,77 79,77" />
        <polyline points="12,24 12,92 69,92 69,24 12,24" />
      </g>
    </svg>
  );
};

export default Icon;
