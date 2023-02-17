import { useState, useEffect, useContext } from 'react';
import { SET_ATOM_SEARCH } from './reducer';
import { StoreContext } from './Store';

const SearchPanel = (props) => {
  const { searchType, height, matches, placeholder } = props;
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { atomSearch } = state;
  const selectorSearch = searchType === SET_ATOM_SEARCH ? atomSearch : null;
  const [filter, setFilter] = useState('');
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    setFilter(selectorSearch ? selectorSearch[1] : '');
  }, [selectorSearch]);

  const handleChange = (e) => {
    clearTimeout(timer);

    const f = e.target.value;
    setFilter(f);

    const fupper = f?.toUpperCase();

    if (selectorSearch?.[0] !== fupper) {
      setTimer(setTimeout(() => dispatch({ type: searchType, filter: f ? [fupper, f] : {} }), 500));
    }
  };

  const handleBlur = () => {
    if (!selectorSearch) {
      setFilter('');
    }
  };

  const handleX = () => {
    if (!filter) {
      return;
    }

    setFilter('');
    dispatch({ type: searchType, filter: {} });
  };

  if (!selectorSearch) {
    return null;
  }

  const style = { height, borderRadius: 0, background: '#0009' };

  return (
    <div className="search-panel" style={props.style}>
      <input
        className="search-box"
        style={{ ...style }}
        type="text"
        placeholder={placeholder || 'search'}
        spellCheck="false"
        onChange={handleChange}
        onBlur={handleBlur}
        value={filter || ''}
      />
      <div className="search-matches" style={{ ...style }}>
        {matches}
      </div>
      <div className={`search-x ${filter ? 'search-x-enabled' : ''}`} style={{ ...style }} onClick={handleX}>
        <div>×</div>
      </div>
    </div>
  );
};

export default SearchPanel;
