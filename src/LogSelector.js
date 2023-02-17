import { useEffect, useContext, useState, useRef } from 'react';
import { StoreContext } from './Store';
import { OFF_WHITE, GREEN, RED, YELLOW, WHITE, HOVERED_HIGHLIGHT, LOG_SELECTOR, SELECTED_HIGHLIGHT } from './const';
import { SET_SELECTED_HISTORY_ITEM, SET_ATOM_HISTORY, SET_FETCHING_LOGS } from './reducer';
import { SET_LOG_SCROLL_POS, SET_SORTED_LOGS, SET_FETCHING_HISTORY } from './reducer';
import { doFetch } from './Batcher.Api';
import _ from 'lodash';
import SvgCheck from './ICONS/SvgCheck';
import SvgX from './ICONS/SvgX';
import dayjs from 'dayjs';
import HeaderCell from './HeaderCell';
import { singleSelectedAtom } from './AtomSelector';
import { light_theme, my_auth } from './_atoms';
import { useRecoilValue } from 'recoil';
import Spinner from './Spinner';
import { theme } from './utils';

const LogSelector = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { selectedAtoms, atomHistory, selectedHistoryItem, logSort, logScrollPos, sortedLogs, fetchingHistory } = state;
  const selectedAtom = singleSelectedAtom(selectedAtoms);
  const rowStyle = { grid: 'auto / 55px 80px 80px 55px 40px 150px 150px 75px' };
  const [hovered, setHovered] = useState();
  const l = useRef({}).current;
  const auth = useRecoilValue(my_auth);
  const invert = useRecoilValue(light_theme);

  useEffect(() => {
    dispatch({ type: SET_FETCHING_LOGS, fetching: true });

    setTimeout(() => {
      const logs = _.orderBy(
        atomHistory?.data,
        (log) => {
          switch (logSort.column) {
            default:
            case 'status':
              return log[0];
            case 'log id':
              return log[1];
            case 'session id':
              return log[2];
            case 'job id':
              return log[3];
            // case 'day':
            //   return log[4];
            case 'start':
              return log[5];
            case 'end':
              return log[6];
            case 'run time':
              return log[7];
          }
        },
        logSort.asc ? 'asc' : 'desc'
      );

      dispatch({ type: SET_SORTED_LOGS, logs: (l.logs = logs) });
      dispatch({ type: SET_FETCHING_LOGS, fetching: false });
    });
  }, [atomHistory?.data, logSort.asc, logSort.column, dispatch, l]);

  useEffect(() => (l.scrollPos = logScrollPos), [l, logScrollPos]);

  useEffect(() => l.grid?.scrollTo(0, l.scrollPos || 0), [l, sortedLogs]);

  const handleScroll = (e) => dispatch({ type: SET_LOG_SCROLL_POS, pos: (l.scrollPos = e.target.scrollTop) });

  const handleClick = (i) => {
    const lid = sortedLogs[i][1];

    if (lid !== selectedHistoryItem?.logid) {
      selectLog(auth, dispatch, sortedLogs[i], selectedAtom);
    }
  };

  return (
    <>
      <div className="table" style={{ gridArea: '1 / 1 / span2 / 1' }}>
        <div className="table-header" style={{ ...rowStyle, color: WHITE }}>
          <HeaderCell selector={LOG_SELECTOR} column="status" />
          <HeaderCell selector={LOG_SELECTOR} column="log id" />
          <HeaderCell selector={LOG_SELECTOR} column="session id" />
          <HeaderCell selector={LOG_SELECTOR} column="job id" />
          <HeaderCell selector={LOG_SELECTOR} column="day" nosort />
          <HeaderCell selector={LOG_SELECTOR} column="start" />
          <HeaderCell selector={LOG_SELECTOR} column="end" />
          <HeaderCell selector={LOG_SELECTOR} column="run time" />
        </div>
        <div className="root-scroll table-body" ref={(e) => (l.grid = e)} onScroll={handleScroll}>
          {_.map(l.logs, (log, i) => {
            const selected = log[1] === selectedHistoryItem?.logid;
            const color = `${log[0] === 'SUCCESS' ? (theme(GREEN, invert, '#306A4D')) :
              log[0] === 'ERROR' ? (theme(RED, invert, '#DB3B51')) : theme(OFF_WHITE, invert, '#505050')}`;
            return (
              <div
                key={i}
                className="table-row"
                style={{
                  ...rowStyle,
                  height: '23px',
                  border: `1px solid ${selected ? theme(YELLOW, invert, SELECTED_HIGHLIGHT) : '#0000'}`,
                  background: `${i === hovered ? HOVERED_HIGHLIGHT : i % 2 ? '#FFFFFF08' : '#0000'}`,
                  color,
                }}
                onClick={() => handleClick(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}>
                <div className="cell center">
                  {log[0] === 'SUCCESS' ? (
                    <SvgCheck width={18} />
                  ) : log[0] === 'ERROR' ? (
                    <SvgX width={18} />
                  ) : (
                    <div style={{ fontSize: '18px' }}>?</div>
                  )}
                </div>
                <div className="cell center">{log[1]}</div>
                <div className="cell center">{log[2]}</div>
                <div className="cell center">{log[3]}</div>
                <div className="cell center">{log[4]}</div>
                <div className="cell">{log[5]?.format('YYYY-MM-DD • HH:mm:ss')}</div>
                <div className="cell">{log[6]?.format('YYYY-MM-DD • HH:mm:ss')}</div>
                <div className="cell center">{log[7]}</div>
              </div>
            );
          })}
        </div>
      </div>
      {fetchingHistory && <Spinner style={{ gridArea: '1 / 1 / span2 / 1' }} />}
    </>
  );
};

export const loadHistory = (auth, query, selectedAtoms, dispatch, reportError) => {
  dispatch({ type: SET_FETCHING_HISTORY, fetching: true });

  const selectedAtom = singleSelectedAtom(selectedAtoms);

  const url = `atom_history?atom_name=${selectedAtom.name}`;

  doFetch(url, auth, (res) => {
    if (res.ok) {
      const logs = res.data;
      dispatch({ type: SET_ATOM_HISTORY, data: logs });

      _.each(logs.data, (log) => {
        log[5] = log[5] ? dayjs(log[5]) : null;
        log[6] = log[6] ? dayjs(log[6]) : null;
      });

      if (query.lid) {
        const row = _.find(logs.data, (row) => row[1] === query.lid);

        if (row) {
          selectLog(auth, dispatch, row, selectedAtom);
        }

        delete query.lid;
      }
    } else {
      reportError(res);
    }

    dispatch({ type: SET_FETCHING_HISTORY, fetching: false });
  });
};

export const selectLog = (auth, dispatch, row, atom) => {
  const lid = row[1];

  if (true) {
    dispatch({ type: SET_SELECTED_HISTORY_ITEM, item: { logid: lid } });
  } else {
    dispatch({ type: SET_FETCHING_LOGS, fetching: true });

    const ts = row[5];
    const url = `atom_log?atom_name=${atom.name}&timestamp=${ts}`;
    doFetch(
      url,
      auth,
      (res) => dispatch({ type: SET_SELECTED_HISTORY_ITEM, item: { logid: lid, log: res.ok ? res.data : res.data?.ErrorMessage } }),
      true
    );
  }
};

export default LogSelector;
