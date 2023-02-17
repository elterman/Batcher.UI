const Icon = ({ style = {}, width, color = '#FFFA', viewBox = '0 0 100 100' }) => {
  return (
    <svg style={{ ...style, display: 'block' }} width={width} height={width} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <path strokeWidth={10} stroke={color} strokeLinecap="round" strokeLinejoin="round" fill="none" d="M18,18 H82 V82 H18 V18" />
    </svg>
  );
};

export default Icon;
