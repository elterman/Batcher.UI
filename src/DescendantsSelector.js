import { useContext } from 'react';
import { StoreContext } from './Store';
import _ from 'lodash';
import { SET_DESCENDANTS_SELECTOR_OPEN, SET_SELECTED_ATOMS } from './reducer';
import { TAB_BATCH, TAB_CYTO } from './const';

const DescendantsSelector = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { elements, batchNodes, selectedAtoms, selectedTab } = state;
  const options = ['Add Immediate Children', 'Add All Descendants'];

  const off = document.getElementById('descendants-selector-button')?.getBoundingClientRect();

  if (!off) {
    return null;
  }

  const handleModalClick = (e) => {
    if (typeof e.target.className === 'string' && e.target.className.includes('modal-screen')) {
      dispatch({ type: SET_DESCENDANTS_SELECTOR_OPEN, open: false });
    }
  };

  const handleSelection = (i) => {
    dispatch({ type: SET_DESCENDANTS_SELECTOR_OPEN, open: false });

    let aids = _.map(selectedAtoms, (a) => a.id);
    aids = findDescendants(aids, elements, i);
    const nodes = _.filter(batchNodes, (n) => aids.includes(n.data.id));
    const atoms = _.uniqBy([...selectedAtoms, ..._.map(nodes, (n) => n.data)], (a) => a.id);

    dispatch({ type: SET_SELECTED_ATOMS, atoms });
  };

  const width = 185;
  const left = selectedTab === TAB_CYTO ? `${off?.left}px` : `${off?.right - width}px`;
  const top = selectedTab === TAB_BATCH ? off?.top - 60 : off?.bottom + 5;

  return (
    <div className="modal-screen" style={{ background: 'none' }} onClick={handleModalClick}>
      <div className="dropdown root-scroll" style={{ width: `${width}px`, left, top: `${top}px` }}>
        {_.map(options, (op, i) => {
          return (
            <div key={i} className="dropdown-item" onClick={() => handleSelection(i)}>
              {op}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const findDescendants = (aids, elements, recurse, descendants) => {
  if (_.isEmpty(descendants)) {
    var once = true;
    elements = _.filter(elements, (e) => e.group === 'edges');

    descendants = new Set();
  }

  _.each(aids, (id) => {
    const aid = `${id}`;

    _.each(elements, (e) => {
      if (Number(e.data.source) !== Number(aid)) {
        return;
      }

      if (descendants.has(e.data.target)) {
        return;
      }

      descendants.add(e.data.target);

      if (recurse) {
        findDescendants([e.data.target], elements, true, descendants);
      }
    });
  });

  return once ? [...descendants] : descendants;
};

export default DescendantsSelector;
