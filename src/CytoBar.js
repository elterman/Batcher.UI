import { useContext } from 'react';
import { LAYOUT_SELECTOR_WIDTH, BLUE } from './const';
import { SET_ATOM_SEARCH, SET_LAYOUT_SELECTOR_OPEN, SET_USE_ID_FOR_LABEL } from './reducer';
import { StoreContext } from './Store';
import SvgCyto from './ICONS/SvgCyto';
import SearchPanel from './SearchPanel';
import _ from 'lodash';
import ResetBar from './ResetBar';
import CheckBox from './CheckBox';
import { getMatches } from './AtomSelector';

const CytoBar = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { elements, selectedLayout, atomSearch, useIdForLabel } = state;

  const openLayoutSelector = () => dispatch({ type: SET_LAYOUT_SELECTOR_OPEN, open: true });

  const toggleUseIdForLabel = () => {
    const on = !useIdForLabel;
    dispatch({ type: SET_USE_ID_FOR_LABEL, on });
    localStorage.setItem(SET_USE_ID_FOR_LABEL, on);
  };

  const matches = getMatches(
    _.filter(elements, (e) => e.group === 'nodes'),
    atomSearch
  );

  return (
    <div className="cyto-bar">
      <SearchPanel
        searchType={SET_ATOM_SEARCH}
        placeholder="search by name"
        height="30px"
        matches={matches}
        style={{ margin: '0 10px 0 4px' }}
      />
      <ResetBar style={{ background: 'initial', margin: '0 5px' }} />
      <CheckBox label="Use IDs for labels" checked={useIdForLabel} handleToggle={toggleUseIdForLabel} style={{ margin: '0 20px' }} />
      <div
        id="layout-selector-button"
        className="selector-button layout-selector-button"
        style={{ width: LAYOUT_SELECTOR_WIDTH }}
        onClick={openLayoutSelector}>
        <SvgCyto width={22} color={BLUE} />
        <div>{selectedLayout}</div>
      </div>
    </div>
  );
};

export default CytoBar;
