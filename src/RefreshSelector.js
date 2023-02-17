import { useContext } from 'react';
import { StoreContext } from './Store';
import _ from 'lodash';
import { SET_PAUSE_REFRESH, SET_REFRESH_SELECTOR_OPEN, SET_RELOAD, SET_SELECTED_TAB } from './reducer';
import { TAB_CYTO } from './const';
import { useSetRecoilState } from 'recoil';
import { timer_ticks } from './_atoms';

const RefreshSelector = () => {
  const setTicks = useSetRecoilState(timer_ticks);
  
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { pauseRefresh, selectedTab } = state;
  const options = [pauseRefresh ? 'Resume' : 'Pause', 'Refresh Now'];

  const off = document.getElementById('refresh-selector-button')?.getBoundingClientRect();

  if (!off) {
    return null;
  }

  const handleModalClick = (e) => {
    if (typeof e.target.className === 'string' && e.target.className.includes('modal-screen')) {
      dispatch({ type: SET_REFRESH_SELECTOR_OPEN, open: false });
    }
  };

  const handleSelection = (op) => {
    dispatch({ type: SET_REFRESH_SELECTOR_OPEN, open: false });

    switch (op) {
      case options[0]:
        const pause = !pauseRefresh;
        dispatch({ type: SET_PAUSE_REFRESH, pause });

        if (pause) {
          setTicks(null);
        } else {
          dispatch({ type: SET_RELOAD, reload: true });
        }
        break;
      case options[1]:
        refreshNow(selectedTab, pauseRefresh, dispatch, setTicks);
        break;
      default:
    }
  };

  return (
    <div className="modal-screen" style={{ background: 'none' }} onClick={handleModalClick}>
      <div className="dropdown root-scroll" style={{ width: '140px', left: `${off?.left}px`, top: `${off?.bottom + 5}px` }}>
        {_.map(options, (op, i) => {
          return (
            <div key={i} className="dropdown-item" onClick={() => handleSelection(op)}>
              {op}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const refreshNow = (selectedTab, pauseRefresh, dispatch, setTicks) => {
  const cyto = selectedTab === TAB_CYTO;

  if (cyto) {
    dispatch({ type: SET_SELECTED_TAB, tab: null });
  }

  dispatch({ type: SET_RELOAD, reload: true });

  if (pauseRefresh) {
    setTicks(null);
  }

  if (cyto) {
    setTimeout(() => dispatch({ type: SET_SELECTED_TAB, tab: TAB_CYTO }, 100));
  }
};

export default RefreshSelector;
