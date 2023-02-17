import BatchSelector  from './BatchSelector';
import AtomSelector from './AtomSelector';

const BatchView = (props) => {
  const { style } = props;

  return (
    <div className="batch-view" style={{ ...style }}>
      <BatchSelector />
      <AtomSelector />
    </div>
  );
};

export default BatchView;
