import { useEffect, useContext, useState, useRef } from 'react';
import { StoreContext } from './Store';
import _ from 'lodash';
import { OFF_WHITE, GREEN, BLUE, RED, YELLOW, WHITE, ATOM_SELECTOR } from './const';
import { HOVERED_HIGHLIGHT, SEARCHED_HIGHLIGHT, HOVERED_SEARCHED_HIGHLIGHT, SELECTED_HIGHLIGHT } from './const';
import { SET_FETCHING_ATOMS, SET_SELECTED_ATOMS, SET_ATOM_SCROLL_POS } from './reducer';
import { SET_SORTED_NODES, SET_ATOM_SEARCH, SET_SHOW_SEARCH_MATCHES_ON_TOP } from './reducer';
import { syncScroll, theme } from './utils';
import { doFetch } from './Batcher.Api';
import SvgCheck from './ICONS/SvgCheck';
import SvgX from './ICONS/SvgX';
import SvgRunning from './ICONS/SvgRunning';
import SvgToDo from './ICONS/SvgToDo';
import SvgLog from './ICONS/SvgLog';
import HeaderCell from './HeaderCell';
import ResetBar from './ResetBar';
import SearchPanel from './SearchPanel';
import CheckBox from './CheckBox';
import { light_theme, my_auth } from './_atoms';
import { useRecoilValue } from 'recoil';
import { useReportError } from './hooks';
import Spinner from './Spinner';

const AtomSelector = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { showSearchMatchesOnTop } = state;
  const { batchNodes, selectedAtoms, fetchingAtoms, atomSort, atomScrollPos, sortedNodes, atomSearch } = state;
  const [hoveredAtom, setHoveredAtom] = useState();
  const l = useRef({}).current;
  const auth = useRecoilValue(my_auth);
  const invert = useRecoilValue(light_theme);
  const reportError = useReportError();

  useEffect(() => {
    dispatch({ type: SET_FETCHING_ATOMS, fetching: true });

    setTimeout(() => {
      const order = atomSort.asc ? 'asc' : 'desc';
      const nodes = _.orderBy(
        batchNodes,
        [
          (n) => !showSearchMatchesOnTop || atomSort.asc !== isSearchMatch(n.data, atomSearch),
          (n) => {
            const atom = n.data;
            switch (atomSort.column) {
              default:
              case 'state':
                return atom.state_sort;
              case 'logs':
                return atom.log;
              case 'id':
                return Number(atom.id);
              case 'atom name':
                return atom.name;
              case 'description':
                return atom.description;
            }
          },
        ],
        [order, order]
      );

      dispatch({ type: SET_SORTED_NODES, nodes: (l.nodes = nodes) });
      batchNodes && dispatch({ type: SET_FETCHING_ATOMS, fetching: false });
    });
  }, [batchNodes, atomSort.asc, atomSort.column, dispatch, l, showSearchMatchesOnTop, atomSearch]);

  useEffect(() => (l.scrollPos = atomScrollPos), [l, atomScrollPos]);

  useEffect(() => l.grid?.scrollTo(0, l.scrollPos || 0), [l, sortedNodes]);

  const handleScroll = (e) => {
    syncScroll('atom-headers', e.target.scrollLeft);
    dispatch({ type: SET_ATOM_SCROLL_POS, pos: (l.scrollPos = e.target.scrollTop) });
  };

  const toggleMatchesOnTop = () => {
    const top = !showSearchMatchesOnTop;
    dispatch({ type: SET_SHOW_SEARCH_MATCHES_ON_TOP, top });
    localStorage.setItem(SET_SHOW_SEARCH_MATCHES_ON_TOP, top);
  };

  const rowStyle = { grid: 'auto / 50px 40px 50px 570px auto' };
  const matches = getMatches(l.nodes, atomSearch);

  return (
    <div style={{ gridArea: '1/2', display: 'grid', overflow: 'hidden' }}>
      <div className="table" style={{ gridArea: '1/1', display: 'grid', grid: 'auto 1fr auto / auto' }}>
        <div id="atom-headers" className="table-header" style={{ ...rowStyle, color: WHITE }}>
          <HeaderCell selector={ATOM_SELECTOR} style={{ gridArea: '1/1' }} column="state" />
          <HeaderCell selector={ATOM_SELECTOR} style={{ gridArea: '1/2' }} column="logs" />
          <HeaderCell selector={ATOM_SELECTOR} style={{ gridArea: '1/3' }} column="id" />
          <HeaderCell selector={ATOM_SELECTOR} style={{ gridArea: '1/4' }} column="atom name" sortMargin={29} />
          <SearchPanel searchType={SET_ATOM_SEARCH} height="26px" matches={matches} style={{ gridArea: '1/4', margin: '0 160px 0 100px' }} />
          <CheckBox
            label="matches on top"
            checked={showSearchMatchesOnTop}
            handleToggle={toggleMatchesOnTop}
            style={{ gridArea: '1/4', justifySelf: 'end', marginRight: '10px' }}
          />
          <HeaderCell selector={ATOM_SELECTOR} style={{ gridArea: '1/5', width: '10000px' }} column="description" sortMargin={30} />
        </div>
        <div className="root-scroll table-body" style={{ height: '100%', overflow: 'auto' }} ref={(e) => (l.grid = e)} onScroll={handleScroll}>
          {_.map(l.nodes, (node, i) => {
            const atom = node.data;
            const selected = _.find(selectedAtoms, (a) => sameAtom(a, atom));
            const color = atomColor(atom, invert);
            const match = isSearchMatch(atom, atomSearch);
            const hovered = atom === hoveredAtom;
            const background = `${hovered && match
              ? theme(HOVERED_SEARCHED_HIGHLIGHT, invert, '#f6c0f6') :
              hovered
                ? HOVERED_HIGHLIGHT
                : match
                  ? theme(SEARCHED_HIGHLIGHT, invert, '#f8d2f8')
                  : i % 2
                    ? '#FFFFFF08'
                    : '#0000'
              }`;
            return (
              <div
                key={i}
                className={`table-row ${selected ? 'table-row-selected' : ''}`}
                style={{ ...rowStyle, border: `1px solid ${selected ? theme(YELLOW, invert, SELECTED_HIGHLIGHT) : '#0000'}`, background, color }}
                onClick={(e) => handleAtomClick(e, auth, atom, selectedAtoms, dispatch, reportError)}
                onMouseEnter={() => setHoveredAtom(atom)}
                onMouseLeave={() => setHoveredAtom(null)}>
                <div className="cell center">
                  {atom.success ? (
                    <SvgCheck width={18} />
                  ) : atom.error ? (
                    <SvgX width={18} />
                  ) : atom.running ? (
                    <SvgRunning width={18} />
                  ) : (
                    <SvgToDo width={20} />
                  )}
                </div>
                <div className="cell center">{atom.log && <SvgLog width={18} color={color} />}</div>
                <div className="cell center">{atom.id}</div>
                <div className="cell">
                  <div className="ellipsis">{atom.name}</div>
                </div>
                <div className="cell">
                  <div style={{ whiteSpace: 'nowrap' }}>{atom.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        <ResetBar />
      </div>
      {fetchingAtoms && <Spinner />}
    </div>
  );
};

export const selectAtom = (auth, atom, dispatch, reportError) => {
  if (!atom) {
    dispatch({ type: SET_SELECTED_ATOMS, atoms: [] });
    return;
  }

  dispatch({ type: SET_SELECTED_ATOMS, atoms: [atom] });
  dispatch({ type: SET_FETCHING_ATOMS, fetching: true });

  const url = `atom_time?atom_id=${atom.id}`;
  doFetch(url, auth, (res) => {
    if (res.ok) {
      atom.date = res.data.value;
      dispatch({ type: SET_SELECTED_ATOMS, atoms: [atom] });
    } else {
      reportError(res);
    }

    dispatch({ type: SET_FETCHING_ATOMS, fetching: false });
  });
};

export const singleSelectedAtom = (atoms) => (atoms?.length === 1 ? atoms[0] : null);

export const sameAtom = (a1, a2) => a1 && Number(a1?.id) === Number(a2?.id);

export const handleAtomClick = (e, auth, atom, selectedAtoms, dispatch, reportError) => {
  if (e.ctrlKey) {
    const i = _.findIndex(selectedAtoms, (a) => sameAtom(a, atom));

    if (i < 0) {
      selectedAtoms.push(atom);
    } else {
      selectedAtoms.splice(i, 1);
    }

    if (selectedAtoms.length > 1) {
      dispatch({ type: SET_SELECTED_ATOMS, atoms: [...selectedAtoms] });
      return;
    }

    if (selectedAtoms.length === 1) {
      selectAtom(auth, selectedAtoms[0], dispatch, reportError);
    } else {
      dispatch({ type: SET_SELECTED_ATOMS, atoms: [...selectedAtoms] });
    }

    return;
  }

  const selectedAtom = singleSelectedAtom(selectedAtoms);

  if (!sameAtom(atom, selectedAtom)) {
    selectAtom(auth, atom, dispatch, reportError);
  }
};

export const isSearchMatch = (atom, atomSearch) => atom?.name?.toUpperCase().includes(atomSearch[0]);

export const getMatches = (nodes, atomSearch) => {
  let matches = _.countBy(nodes, (n) => isSearchMatch(n.data, atomSearch));
  matches = matches.true ? `${matches.true} match${matches.true > 1 ? 'es' : ''}` : null;

  return matches;
};

export default AtomSelector;


export const atomColor = (atom, invert) =>
  `${atom?.success ? theme(GREEN, invert, '#006000') :
    atom?.running ? theme(BLUE, invert, '#0040F0') :
      atom?.error ? theme(RED, invert, '#DB3B51') :
        theme(OFF_WHITE, invert, '#505050')}`;
