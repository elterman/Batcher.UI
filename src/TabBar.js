import { useContext, useState, useEffect } from 'react';
import { StoreContext } from './Store';
import _ from 'lodash';
import { SET_SELECTED_TAB } from './reducer';
import { BULLET, TAB_BATCH, TAB_CYTO, TAB_GRAPH, TAB_ATOM } from './const';
import SvgCyto from './ICONS/SvgCyto';
import SvgGraph from './ICONS/SvgGraph';
import SvgLog from './ICONS/SvgLog';
import BatchTab from './BatchTab';
import { loadHistory } from './LogSelector';
import { singleSelectedAtom } from './AtomSelector';
import { loadGraph } from './Graph';
import { light_theme, my_auth } from './_atoms';
import { useRecoilValue } from 'recoil';
import { useReportError } from './hooks';
import { atomColor } from './AtomSelector';

const TabBar = (props) => {
  const { style } = props;
  const auth = useRecoilValue(my_auth);
  const reportError = useReportError();
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { selectedTab, selectedAtoms, query, selectedBatch, batchNodes, atomSearch } = state;
  const selectedAtom = singleSelectedAtom(selectedAtoms);
  const [tabs, setTabs] = useState();
  const invert = useRecoilValue(light_theme);

  useEffect(() => {
    const tabs = ['', 'Cyto Graph', 'Vector Graph'];

    if (selectedAtom) {
      const date = selectedAtom?.log && selectedAtom?.date ? ` ${BULLET} ${selectedAtom.date.replace(' ', ` ${BULLET} `)}` : '';
      tabs.push(`${selectedAtom.id} ${BULLET} ${selectedAtom.name.replace('|', ` ${BULLET} `)}${date}`);
    }

    setTabs(tabs);
  }, [selectedAtom, selectedAtoms, setTabs]);

  const selectTab = (i) => {
    dispatch({ type: SET_SELECTED_TAB, tab: i });

    if (i === TAB_ATOM) {
      loadHistory(auth, query, selectedAtoms, dispatch, reportError);
    } else if (i === TAB_GRAPH) {
      loadGraph(auth, selectedBatch?.name, selectedAtoms, batchNodes, atomSearch, dispatch, reportError, invert);
    }
  };

  return (
    <div style={{ display: 'grid', ...style }}>
      <div className="tabs-border"></div>
      <div className="tabs">
        {_.map(tabs, (_, i) => {
          const classes = `tab ${i === selectedTab ? 'tab-selected' : ''}`;
          const borderWidth = i < selectedTab ? '1px 0 0 1px' : i > selectedTab ? '1px 1px 0 0' : '1px 1px 0 1px';
          const color = atomColor(selectedAtom, invert);
          return (
            <div id={`tab-${i}`} key={i} className={classes} style={{ borderWidth }} onClick={() => selectTab(i)}>
              {i === TAB_BATCH ? (
                <BatchTab />
              ) : i === TAB_CYTO ? (
                <SvgCyto width={30} style={{ marginTop: '-1px' }} />
              ) : i === TAB_GRAPH ? (
                <SvgGraph width={24} style={{ marginTop: '-1px' }} />
              ) : i === TAB_ATOM ? (
                <div className="icon-text">
                  {selectedAtom?.log && <SvgLog width={18} color={color} />}
                  <div style={{ color }}>{tabs[i]}</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabBar;
