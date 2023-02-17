import React, { useReducer } from 'react';
import { REFRESH_INTERVALS, REFRESH_INTERVAL_KEY, TAB_BATCH } from './const';
import { reducer, SET_SHOW_SEARCH_MATCHES_ON_TOP, SET_USE_ID_FOR_LABEL } from './reducer';
import { parseQuery } from './utils';

export const StoreContext = React.createContext({ state: null, dispatch: null });

const useStore = () => {
  const matchesOnTop = localStorage.getItem(SET_SHOW_SEARCH_MATCHES_ON_TOP);
  const id4label = localStorage.getItem(SET_USE_ID_FOR_LABEL);
  const interval = Number(localStorage.getItem(REFRESH_INTERVAL_KEY));

  const initState = {
    pauseRefresh: false,
    query: parseQuery(),
    elements: [],
    selectedTab: TAB_BATCH,
    selectedLayout: 'preset',
    refreshInterval: interval || REFRESH_INTERVALS[REFRESH_INTERVALS.length - 1],
    batchSort: { column: 'id', asc: true },
    atomSort: { column: 'state', asc: true },
    logSort: { column: 'start', asc: false },
    selectedAtoms: [],
    atomSearch: {},
    showSearchMatchesOnTop: matchesOnTop !== 'false',
    useIdForLabel: id4label !== 'false',
    graphSize: { width: 0, height: 0 },
    graphScale: 0,
    tooltipInfo: {},
    fetchingStatus: 0,
  };

  const [state, dispatch] = useReducer(reducer, initState);
  return { state, dispatch };
};

export default useStore;
