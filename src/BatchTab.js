import { useContext } from 'react';
import { StoreContext } from './Store';
import { formatDate } from './utils';
import SvgBatch from './ICONS/SvgBatch';
import { BULLET } from './const';

const BatchTab = () => {
  const store = useContext(StoreContext);
  const { state } = store;
  const { selectedBatch } = state;

  const date = selectedBatch?.date;

  return (
    <div className="icon-text">
      <SvgBatch width={22} style={{ marginTop: '-1px' }} />
      {selectedBatch && <div>{`${selectedBatch.name} ${BULLET} ${date ? formatDate(date) : 'No active job'}`}</div>}
    </div>
  );
};

export default BatchTab;
