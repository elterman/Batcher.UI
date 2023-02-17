import { useEffect, useCallback, useRef } from 'react';
import useStore, { StoreContext } from './Store';
import './App.css';
import CytoView from './CytoView';
import { SET_RELOAD, SET_BATCH_NODES, SET_FETCHING_STATUS, SET_ELEMENTS } from './reducer';
import { useInterval } from './utils';
import { doFetch } from './Batcher.Api';
import TitleBar from './TitleBar';
import TabBar from './TabBar';
import TimeburgerPanel from './TimeburgerPanel';
import _ from 'lodash';
import AtomView from './AtomView';
import BatchView from './BatchView';
import { TAB_CYTO, TAB_ATOM, TAB_BATCH, TAB_GRAPH } from './const';
import Options from './Options';
import Tooltip from './Tooltip';
import { selectAtom } from './AtomSelector';
import { sort } from './BatchSelector';
import LayoutSelector from './LayoutSelector';
import RefreshSelector from './RefreshSelector';
import DescendantsSelector from './DescendantsSelector';
import GraphView from './GraphView';
import { loadHistory } from './LogSelector';
import { loadGraph } from './Graph';
import { useRecoilState, useRecoilValue } from 'recoil';
import AuthProvider from './AUTH/AuthProvider';
import { light_theme, my_auth, options_open, timer_ticks } from './_atoms';
import Toaster from './Toaster';
import { useReportError } from './hooks';

const App = () => {
  const auth = useRecoilValue(my_auth);
  const [ticks, setTicks] = useRecoilState(timer_ticks);
  const optionsOpen = useRecoilValue(options_open);
  const invert = useRecoilValue(light_theme);

  const store = useStore();
  const { state, dispatch } = store;
  const { layoutSelectorOpen, refreshSelectorOpen, descendantsSelectorOpen } = state;
  const { selectedTab, selectedBatch, batches, batchSort, selectedAtoms, atomSearch } = state;
  const { reload, refreshInterval, query, pauseRefresh } = state;
  const reportError = useReportError();
  const _this = useRef(null);

  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();
    window.addEventListener('contextmenu', disableContextMenu);
    return () => window.removeEventListener('contextmenu', disableContextMenu);
  }, [_this]);

  const doReload = useCallback(
    (clearInterval) => {
      if (!selectedBatch) {
        return;
      }

      if (clearInterval) {
        setTicks(null);
      }

      // get cyto elements
      dispatch({ type: SET_ELEMENTS, elements: [] });

      let url = `cyto_elements?batch_name=${selectedBatch.name}`;
      doFetch(url, auth, (res) => {
        if (!res.ok) {
          reportError(res);
          return;
        }

        const els = res.data.value;
        dispatch({ type: SET_ELEMENTS, elements: els });

        const nodes = _.filter(els, (e) => e.group === 'nodes');
        const props = ['state_sort', 'id', 'name', 'running', 'success', 'error', 'description', 'log', 'long_label', 'short_label'];
        _.each(nodes, (node) => (node.data = _.pick(node.data, props)));

        dispatch({ type: SET_BATCH_NODES, nodes });

        // selected a node from query, if any
        if (query.aid) {
          const node = _.find(nodes, (node) => node.data.id === query.aid);

          if (node) {
            selectAtom(auth, node.data, dispatch, reportError);
          }

          delete query.aid;
        }

        if (selectedTab === TAB_ATOM) {
          loadHistory(auth, query, selectedAtoms, dispatch, reportError);
        } else if (selectedTab === TAB_GRAPH) {
          loadGraph(auth, selectedBatch?.name, selectedAtoms, nodes, atomSearch, dispatch, reportError);
        }

        if (!pauseRefresh) {
          setTicks(0);
        }
      });

      // get status
      dispatch({ type: SET_FETCHING_STATUS, fetching: true });

      url = `atom_state_by_batch`;
      doFetch(url, auth, (res) => {
        if (res.ok) {
          const obs = res.data;
          _.each(batches, (b) => {
            const ob = obs[b.id];
            const ok = !_.isEmpty(ob);
            b.date = ok ? _.last(_.keys(ob)) : '';
            const counts = ok ? ob[b.date].rsed : [0, 0, 0, 0];
            b.running = ok ? counts[0] : '';
            b.success = ok ? counts[1] : '';
            b.error = ok ? counts[2] : '';
            b.todo = ok ? counts[3] : '';
            b.total = ok ? _.sum(counts) : '';
          });

          dispatch({ type: SET_FETCHING_STATUS, fetching: false });
          sort(batches, batchSort, dispatch);
        } else {
          reportError(res);
        }
      });
    },
    [selectedBatch, dispatch, auth, setTicks, query, selectedTab, pauseRefresh, reportError, selectedAtoms, atomSearch, batches, batchSort]
  );

  useEffect(() => {
    if (reload) {
      doReload(true);
      dispatch({ type: SET_RELOAD, reload: false });
    }
  }, [reload, doReload, dispatch]);

  const onTick = () => {
    const tix = ticks + 1;

    if (tix === refreshInterval) {
      doReload(true);
    } else {
      setTicks(tix);
    }
  };

  useInterval(onTick, ticks === null ? null : 1000);

  return (
    <AuthProvider>
      <StoreContext.Provider value={store}>
        <div style={{ display: 'grid' }}>
          <div ref={_this} id="app" className="App">
            <TitleBar style={{ gridArea: '1/1' }} />
            <TabBar style={{ gridArea: '2/1' }} />
            <TimeburgerPanel style={{ gridArea: '2/1', justifySelf: 'end', alignSelf: 'center' }} />
            {selectedTab === TAB_BATCH ? (
              <BatchView />
            ) : selectedTab === TAB_CYTO ? (
              <CytoView />
            ) : selectedTab === TAB_GRAPH ? (
              <GraphView />
            ) : selectedTab === TAB_ATOM ? (
              <AtomView />
            ) : null}
            {layoutSelectorOpen && <LayoutSelector />}
            {refreshSelectorOpen && <RefreshSelector />}
            {descendantsSelectorOpen && <DescendantsSelector />}
            {optionsOpen && <Options />}
            <Tooltip />
          </div>
          {invert && <div className='invert-screen' />}
          <Toaster />
        </div>
      </StoreContext.Provider>
    </AuthProvider>
  );
};

export default App;
