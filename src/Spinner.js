import SvgSpinner from './ICONS/SvgSpinner';

const Spinner = (props) => {
  const { style } = props;

  return (
    <div className="spinner-host" style={style}>
      <SvgSpinner />
    </div>
  );
};

export default Spinner;
