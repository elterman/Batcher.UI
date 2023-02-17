import { sameAtom } from './AtomSelector';

export const SET_BATCHES = 'SET_BATCHES';
export const SET_SELECTED_TAB = 'SET_SELECTED_TAB';
export const SET_SELECTED_BATCH = 'SET_SELECTED_BATCH';
export const SET_SELECTED_ATOMS = 'SET_SELECTED_ATOMS';
export const SET_SELECTED_HISTORY_ITEM = 'SET_SELECTED_HISTORY_ITEM';
export const SET_SELECTED_LAYOUT = 'SET_SELECTED_LAYOUT';
export const SET_LAYOUT_SELECTOR_OPEN = 'SET_LAYOUT_SELECTOR_OPEN';
export const SET_REFRESH_SELECTOR_OPEN = 'SET_REFRESH_SELECTOR_OPEN';
export const SET_DESCENDANTS_SELECTOR_OPEN = 'SET_DESCENDANTS_SELECTOR_OPEN';
export const SET_RELOAD = 'SET_RELOAD';
export const SET_ATOM_HISTORY = 'SET_ATOM_HISTORY';
export const SET_BATCH_NODES = 'SET_BATCH_NODES';
export const SET_REFRESH_INTERVAL = 'SET_REFRESH_INTERVAL';
export const SET_FETCHING_STATUS = 'SET_FETCHING_STATUS';
export const SET_FETCHING_ATOMS = 'SET_FETCHING_ATOMS';
export const SET_FETCHING_HISTORY = 'SET_FETCHING_HISTORY';
export const SET_FETCHING_LOGS = 'SET_FETCHING_LOGS';
export const SET_BATCH_SORT = 'SET_BATCH_SORT';
export const SET_ATOM_SORT = 'SET_ATOM_SORT';
export const SET_LOG_SORT = 'SET_LOG_SORT';
export const SET_BATCH_SCROLL_POS = 'SET_BATCH_SCROLL_POS';
export const SET_ATOM_SCROLL_POS = 'SET_ATOM_SCROLL_POS';
export const SET_LOG_SCROLL_POS = 'SET_LOG_SCROLL_POS';
export const SET_GRAPH_SCROLL_POS = 'SET_GRAPH_SCROLL_POS';
export const SET_SORTED_BATCHES = 'SET_SORTED_BATCHES';
export const SET_SORTED_NODES = 'SET_SORTED_NODES';
export const SET_SORTED_LOGS = 'SET_SORTED_LOGS';
export const SET_RESET_TO = 'SET_RESET_TO';
export const SET_ATOM_SEARCH = 'SET_ATOM_SEARCH';
export const SET_SHOW_SEARCH_MATCHES_ON_TOP = 'SET_SHOW_SEARCH_MATCHES_ON_TOP';
export const SET_ELEMENTS = 'SET_ELEMENTS';
export const SET_PAUSE_REFRESH = 'SET_PAUSE_REFRESH';
export const SET_USE_ID_FOR_LABEL = 'SET_USE_ID_FOR_LABEL';
export const SET_GRAPH_SVG = 'SET_GRAPH_SVG';
export const SET_ORIGINAL_GRAPH_SVG = 'SET_ORIGINAL_GRAPH_SVG';
export const SET_GRAPH_SIZE = 'SET_GRAPH_SIZE';
export const SET_GRAPH_SCALE = 'SET_GRAPH_SCALE';
export const SET_GRAPH_AUTO_SCALE = 'SET_GRAPH_AUTO_SCALE';
export const SET_ATOM_STATE_RESET = 'SET_ATOM_STATE_RESET';

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_BATCHES:
      return { ...state, batches: action.batches };
    case SET_SELECTED_TAB:
      return { ...state, selectedTab: action.tab };
    case SET_SELECTED_BATCH:
      return {
        ...state,
        selectedBatch: action.batch,
        batchNodes: null,
        selectedAtoms: [],
        atomScrollPos: 0,
        sortedNodes: null,
        reload: Boolean(action.batch),
        originalGraphSvg: null,
        graphSvg: null,
        graphScale: 0,
        graphAutoScale: true,
        graphScrollPos: { x: 0, y: 0 },
      };
    case SET_SELECTED_ATOMS:
      let newState = { ...state, selectedAtoms: action.atoms };
      if (action.atoms.length === 1) {
        if (state.selectedAtoms.length !== 1 || !sameAtom(state.selectedAtoms[0], action.atoms[0])) {
          newState = { ...newState, atomHistory: null, selectedHistoryItem: null, logScrollPos: 0, sortedLogs: null };
        }
      } else {
        newState.atomHistory = null;
      }
      return newState;
    case SET_SELECTED_HISTORY_ITEM:
      return { ...state, selectedHistoryItem: action.item, fetchingLogs: false };
    case SET_SELECTED_LAYOUT:
      return { ...state, selectedLayout: action.layout };
    case SET_LAYOUT_SELECTOR_OPEN:
      return { ...state, layoutSelectorOpen: action.open };
    case SET_REFRESH_SELECTOR_OPEN:
      return { ...state, refreshSelectorOpen: action.open };
    case SET_DESCENDANTS_SELECTOR_OPEN:
      return { ...state, descendantsSelectorOpen: action.open };
    case SET_RELOAD:
      return { ...state, reload: action.reload };
    case SET_ATOM_HISTORY:
      return { ...state, atomHistory: action.data };
    case SET_BATCH_NODES:
      return { ...state, batchNodes: action.nodes, fetchingAtoms: false };
    case SET_REFRESH_INTERVAL:
      return { ...state, refreshInterval: action.secs, reload: !state.pauseRefresh };
    case SET_FETCHING_STATUS:
      return { ...state, fetchingStatus: state.fetchingStatus + (action.fetching ? 1 : -1) };
    case SET_FETCHING_ATOMS:
      return { ...state, fetchingAtoms: action.fetching };
    case SET_FETCHING_HISTORY:
      return { ...state, fetchingHistory: action.fetching };
    case SET_FETCHING_LOGS:
      return { ...state, fetchingLogs: action.fetching };
    case SET_BATCH_SORT:
      return { ...state, batchSort: action.sort, sortedBatches: null };
    case SET_ATOM_SORT:
      return { ...state, atomSort: action.sort, sortedNodes: null };
    case SET_LOG_SORT:
      return { ...state, logSort: action.sort, sortedLogs: null };
    case SET_BATCH_SCROLL_POS:
      return { ...state, batchScrollPos: action.pos };
    case SET_ATOM_SCROLL_POS:
      return { ...state, atomScrollPos: action.pos };
    case SET_LOG_SCROLL_POS:
      return { ...state, logScrollPos: action.pos };
    case SET_GRAPH_SCROLL_POS:
      return { ...state, graphScrollPos: action.pos };
    case SET_SORTED_BATCHES:
      return { ...state, sortedBatches: action.items };
    case SET_SORTED_NODES:
      return { ...state, sortedNodes: action.nodes };
    case SET_SORTED_LOGS:
      return { ...state, sortedLogs: action.logs };
    case SET_RESET_TO:
      return { ...state, resetTo: action.to };
    case SET_ATOM_SEARCH:
      return { ...state, atomSearch: action.filter };
    case SET_SHOW_SEARCH_MATCHES_ON_TOP:
      return { ...state, showSearchMatchesOnTop: action.top };
    case SET_ELEMENTS:
      return { ...state, elements: action.elements };
    case SET_PAUSE_REFRESH:
      return { ...state, pauseRefresh: action.pause };
    case SET_USE_ID_FOR_LABEL:
      return { ...state, useIdForLabel: action.on };
    case SET_ORIGINAL_GRAPH_SVG:
      return { ...state, originalGraphSvg: action.svg };
    case SET_GRAPH_SVG:
      return { ...state, graphSvg: action.svg };
    case SET_GRAPH_SIZE:
      return { ...state, graphSize: action.size };
    case SET_GRAPH_SCALE:
      return { ...state, graphScale: action.scale };
    case SET_GRAPH_AUTO_SCALE:
      return { ...state, graphAutoScale: action.auto };
    case SET_ATOM_STATE_RESET:
      return { ...state, atomStateReset: action.reset };
    default:
      return state;
  }
};
