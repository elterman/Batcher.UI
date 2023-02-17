import { useContext } from 'react';
import { StoreContext } from './Store';
import _ from 'lodash';
import { SET_LAYOUT_SELECTOR_OPEN, SET_RELOAD, SET_SELECTED_LAYOUT, SET_SELECTED_TAB } from './reducer';
import { LAYOUT_SELECTOR_WIDTH, TAB_CYTO } from './const';

const LayoutSelector = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { selectedLayout } = state;
  const layouts = [
    'preset',
    'breadthfirst',
    'circle',
    'cola',
    'concentric',
    'cose',
    'cose-bilkent',
    'dagre',
    'euler',
    'grid',
    'klay',
    'random',
    'spread',
  ];

  const off = document.getElementById('layout-selector-button')?.getBoundingClientRect();

  if (!off) {
    return null;
  }

  const handleModalClick = (e) => {
    if (typeof e.target.className === 'string' && e.target.className.includes('modal-screen')) {
      dispatch({ type: SET_LAYOUT_SELECTOR_OPEN, open: false });
    }
  };

  const selectLayout = (name) => {
    if (name === selectedLayout) {
      return;
    }

    dispatch({ type: SET_SELECTED_LAYOUT, layout: name });
    dispatch({ type: SET_LAYOUT_SELECTOR_OPEN, open: false });

    if (name === 'preset') {
      dispatch({ type: SET_SELECTED_TAB, tab: null });
      dispatch({ type: SET_RELOAD, reload: true });
      setTimeout(() => dispatch({ type: SET_SELECTED_TAB, tab: TAB_CYTO }, 100));
    }
  };

  return (
    <div className="modal-screen" style={{ background: 'none' }} onClick={handleModalClick}>
      <div className="dropdown root-scroll" style={{ width: LAYOUT_SELECTOR_WIDTH, left: `${off?.left}px`, top: `${off?.bottom + 5}px` }}>
        {_.map(layouts, (name, i) => {
          const classes = `dropdown-item ${name === selectedLayout ? 'dropdown-item-selected' : ''}`;
          return (
            <div key={i} className={classes} onClick={() => selectLayout(name)}>
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LayoutSelector;
