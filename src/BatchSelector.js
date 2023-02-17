import { useEffect, useContext, useState, useRef } from 'react';
import { StoreContext } from './Store';
import { DARKBLUE, DARKGREEN, DARKRED, PALEBLUE, PALEGREEN, PALERED, PALEGRAY } from './const';
import { WHITE, YELLOW, HOVERED_HIGHLIGHT, BATCH_SELECTOR, DIMGRAY, SELECTED_HIGHLIGHT } from './const';
import { SET_BATCH_SCROLL_POS, SET_FETCHING_STATUS, SET_BATCHES, SET_SELECTED_BATCH, SET_SORTED_BATCHES } from './reducer';
import _ from 'lodash';
import { formatDate, theme } from './utils';
import { doFetch } from './Batcher.Api';
import HeaderCell from './HeaderCell';
import { light_theme, my_auth } from './_atoms';
import { useRecoilValue } from 'recoil';
import { useReportError } from './hooks';
import Spinner from './Spinner';

const BatchSelector = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { batches, query, selectedBatch, fetchingStatus, batchSort, sortedBatches } = state;
  const [hovered, setHovered] = useState();
  const l = useRef({}).current;
  const auth = useRecoilValue(my_auth);
  const invert = useRecoilValue(light_theme);
  const reportError = useReportError();

  useEffect(() => {
    if (batches || !auth.user) {
      return;
    }

    doFetch('batch_names', auth, (res) => {
      if (res.ok) {
        const barr = res.data.batches;
        dispatch({ type: SET_BATCHES, batches: barr });

        sort(barr, batchSort, dispatch, l);

        let batch = barr[0];

        if (query.bid) {
          const b = _.find(barr, (b) => b.id === query.bid);

          if (b) {
            batch = b;
          }

          delete query.bid;
        }

        selectBatch(batch, selectedBatch, dispatch);
      } else {
        reportError(res);
      }
    });
  }, [l, batches, dispatch, query.bid, selectedBatch, batchSort, auth, reportError]);

  useEffect(() => {
    if (!_.isEmpty(sortedBatches)) {
      l.batches = sortedBatches;
      return;
    }

    sort(batches, batchSort, dispatch, l);
  }, [l, sortedBatches, dispatch, batchSort, batches]);

  const handleScroll = (e) => dispatch({ type: SET_BATCH_SCROLL_POS, pos: e.target.scrollTop });

  const cellStyle = (status, color) => {
    return { background: `${status ? color : 'transparent'}`, color: `${status ? WHITE : 'initial'}` };
  };

  const rowStyle = { grid: 'auto / 45px 210px 100px 55px 55px 55px 55px 55px' };

  return (
    <div style={{ display: 'grid', overflow: 'hidden' }}>
      <div className="table" style={{ gridArea: '1/1', overflow: 'hidden' }}>
        <div className="table-header" style={{ gridArea: '1/1', border: '1px solid #0000', ...rowStyle, color: WHITE }}>
          <HeaderCell selector={BATCH_SELECTOR} column="id" />
          <HeaderCell selector={BATCH_SELECTOR} column="batch" />
          <HeaderCell selector={BATCH_SELECTOR} column="date" />
          <HeaderCell
            selector={BATCH_SELECTOR}
            column="error"
            style={{ background: `${_.some(batches, (b) => b.error) ? theme(DARKRED, invert, PALERED) : 'transparent'}` }}
          />
          <HeaderCell selector={BATCH_SELECTOR} column="running" />
          <HeaderCell selector={BATCH_SELECTOR} column="to do" />
          <HeaderCell selector={BATCH_SELECTOR} column="success" />
          <HeaderCell selector={BATCH_SELECTOR} column="total" />
        </div>
        <div className="root-scroll table-body" ref={(e) => (l.grid = e)} style={{ gridArea: '2/1' }} onScroll={handleScroll}>
          {_.map(l.batches, (batch, i) => {
            const selected = batch.id === selectedBatch?.id;
            return (
              <div
                key={i}
                className={`table-row ${selected ? 'table-row-selected' : ''}`}
                style={{
                  ...rowStyle,
                  border: `1px solid ${selected ? theme(YELLOW, invert, SELECTED_HIGHLIGHT) : '#0000'}`,
                  background: `${batch === hovered ? HOVERED_HIGHLIGHT : i % 2 ? '#FFFFFF08' : '#0000'}`,
                }}
                onClick={() => selectBatch(batch, selectedBatch, dispatch)}
                onMouseEnter={() => setHovered(batch)}
                onMouseLeave={() => setHovered(null)}>
                <div className="cell center">{batch.id}</div>
                <div className="cell">{batch.name}</div>
                <div className="cell">{formatDate(batch.date)}</div>
                <div className="cell center" style={{ ...cellStyle(batch.error, theme(DARKRED, invert, PALERED)) }}>
                  {batch.error || ''}
                </div>
                <div className="cell center" style={{ ...cellStyle(batch.running, theme(DARKBLUE, invert, PALEBLUE)) }}>
                  {batch.running || ''}
                </div>
                <div className="cell center" style={{ ...cellStyle(batch.todo, theme(DIMGRAY, invert, PALEGRAY)) }}>
                  {batch.todo || ''}
                </div>
                <div className="cell center" style={{ ...cellStyle(batch.success, theme(DARKGREEN, invert, PALEGREEN)) }}>
                  {batch.success || ''}
                </div>
                <div className="cell center">{batch.total}</div>
              </div>
            );
          })}
        </div>
      </div>
      {!!fetchingStatus && <Spinner />}
    </div>
  );
};

export const selectBatch = (batch, selectedBatch, dispatch) => {
  if (batch.id !== selectedBatch?.id) {
    dispatch({ type: SET_SELECTED_BATCH, batch });
  }
};

export const sort = (batches, batchSort, dispatch, l = null) => {
  if (!batches) {
    return;
  }

  dispatch({ type: SET_FETCHING_STATUS, fetching: true });

  setTimeout(() => {
    const obs = _.orderBy(
      batches,
      (b) => {
        switch (batchSort.column) {
          default:
          case 'id':
            return b.id;
          case 'batch':
            return b.name;
          case 'date':
            return b.date;
          case 'error':
            return b.error;
          case 'running':
            return b.running;
          case 'to do':
            return b.todo;
          case 'success':
            return b.success;
          case 'total':
            return b.total;
        }
      },
      batchSort.asc ? 'asc' : 'desc'
    );

    dispatch({ type: SET_SORTED_BATCHES, items: obs });

    if (l) {
      l.batches = obs;
    }

    dispatch({ type: SET_FETCHING_STATUS, fetching: false });
  });
};

export default BatchSelector;
