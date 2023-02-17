import { useContext } from 'react';
import { StoreContext } from './Store';
import LogSelector from './LogSelector';
import { NO_LOG, WHITE_CIRCLE } from './const';
import { singleSelectedAtom } from './AtomSelector';
import Spinner from './Spinner';

const AtomView = () => {
  const store = useContext(StoreContext);
  const { state } = store;
  const { selectedHistoryItem, fetchingLogs, selectedAtoms } = state;
  const selectedAtom = singleSelectedAtom(selectedAtoms);

  let log = selectedHistoryItem?.log;
  let classes = 'root-scroll log-view';
  const nolog = log === NO_LOG;
  let opacity = 1;
  let transform;

  if (nolog) {
    log = WHITE_CIRCLE;
    classes += ' no-log';
    opacity = 0.35;
    transform = 'translate(4px, -15px)';
  }

  return (
    <div className="atom-view">
      <div className="atom-description-panel">
        <div className="ellipsis">{selectedAtom?.description}</div>
      </div>
      <LogSelector />
      <div className={classes}>
        <div style={{ gridArea: '1/1', opacity, transform }}>{log}</div>
        {fetchingLogs && <Spinner />}
      </div>
    </div>
  );
};

export default AtomView;
