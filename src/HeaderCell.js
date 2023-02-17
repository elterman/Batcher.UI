import { useContext } from 'react';
import { StoreContext } from './Store';
import SvgSort from './ICONS/SvgSort';
import { ATOM_SELECTOR, BATCH_SELECTOR, LOG_SELECTOR } from './const';
import { SET_ATOM_SORT, SET_BATCH_SORT, SET_LOG_SORT } from './reducer';

const HeaderCell = (props) => {
  const { style, selector, column, nosort, sortMargin } = props;
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { batchSort, atomSort, logSort } = state;
  const bsort = selector === BATCH_SELECTOR;
  const asort = selector === ATOM_SELECTOR;
  const lsort = selector === LOG_SELECTOR;
  const sort = bsort ? batchSort : asort ? atomSort : lsort ? logSort : null;

  if (sort === null) {
    return null;
  }

  const handleClick = () => {
    if (nosort) {
      return;
    }

    if (sort?.column === column) {
      sort.asc = !sort.asc;
    } else {
      sort.column = column;
      sort.asc = true;
    }

    dispatch({ type: bsort ? SET_BATCH_SORT : asort ? SET_ATOM_SORT : SET_LOG_SORT, sort: { ...sort } });
  };

  const classes = `cell ${sortMargin ? '' : 'center'}`;
  const sortStyle = { gridArea: '1/1', marginTop: '-8px', justifySelf: `${sortMargin ? 'start' : 'center'}`, marginLeft: sortMargin || 0 };

  return (
    <div className={classes} style={{ cursor: `${nosort ? 'initial' : 'pointer'}`, ...style }} onClick={handleClick}>
      {!nosort && column === sort?.column && <SvgSort width={8} color='yellow' asc={sort?.asc} style={sortStyle} />}
      <div style={{ gridArea: '1/1' }}>{column}</div>
    </div>
  );
};

export default HeaderCell;
