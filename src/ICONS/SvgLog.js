const Icon = ({ style = {}, width, color = '#FFFA', viewBox = '0 0 100 100' }) => {
  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <path strokeWidth={10} stroke={color} strokeLinecap="round" fill="none" d="M18,22 H62 M18,50 H82 M18,78 H72" />
    </svg>
  );
};

export default Icon;
