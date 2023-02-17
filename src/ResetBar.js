import { useContext } from 'react';
import { StoreContext } from './Store';
import { DARKRED, DARKBLUE, DARKGREEN, DIMGRAY, PALERED, PALEGREEN, PALEBLUE } from './const';
import { SET_ATOM_STATE_RESET, SET_DESCENDANTS_SELECTOR_OPEN, SET_RESET_TO } from './reducer';
import _ from 'lodash';
import { doFetch } from './Batcher.Api';
import { refreshNow } from './RefreshSelector';
import { findDescendants } from './DescendantsSelector';
import { light_theme, my_auth, timer_ticks } from './_atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useReportError } from './hooks';
import { theme } from './utils';

const ResetBar = (props) => {
  const auth = useRecoilValue(my_auth);
  const setTicks = useSetRecoilState(timer_ticks);
  const reportError = useReportError();
  const invert = useRecoilValue(light_theme);

  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { selectedBatch, selectedAtoms, resetTo, selectedTab, pauseRefresh, elements } = state;
  const canReset = selectedAtoms.length > 0 && resetTo;

  const handleClickResetTo = (to) => dispatch({ type: SET_RESET_TO, to: to === resetTo ? null : to });

  const handleClickApplyTo = (i) => {
    if (!canReset) {
      return;
    }

    dispatch({ type: SET_ATOM_STATE_RESET, reset: true });

    let aids = _.map(selectedAtoms, (a) => a.id);

    if (i) {
      const dids = findDescendants(aids, elements, i === 2);
      aids = [...aids, ...dids];
    }

    let url = `set_atom_state?bid=${selectedBatch.id}&state=${resetTo.slice(0, 1).toUpperCase()}&aid=`;
    _.each(aids, (id) => (url += `${id},`));

    doFetch(url, auth, (res) => {
      dispatch({ type: SET_RESET_TO, to: null });

      if (res.ok) {
        refreshNow(selectedTab, pauseRefresh, dispatch, setTicks);
      } else {
        reportError(res);
      }

      setTimeout(() => dispatch({ type: SET_ATOM_STATE_RESET, reset: false }), 500);
    });
  };

  const openDescendantsSelector = () => dispatch({ type: SET_DESCENDANTS_SELECTOR_OPEN, open: true });

  return (
    <div className="reset-bar" style={props.style}>
      <div className="reset-label">Set state to:</div>
      {_.map(['clear', 'error', 'success', 'running'], (to, i) => {
        const selected = resetTo === to;
        const background =
          to === 'clear' ? theme(DIMGRAY, invert, '#FFFFFF') :
          to === 'error' ? theme(DARKRED, invert, PALERED) :
          to === 'success' ? theme(DARKGREEN, invert, PALEGREEN) :
          to === 'running' ? theme(DARKBLUE, invert, PALEBLUE) :
          'initial';
        return (
          <div
            key={i}
            className={`reset-to ${selected ? 'reset-to-selected' : ''}`}
            style={{ background: `${selected ? background : 'initial'}` }}
            onClick={() => handleClickResetTo(to)}>
            {to}
          </div>
        );
      })}
      <div style={{ width: '10px' }}></div>
      <div className="reset-label">Apply to:</div>
      {_.map(['', ' and immediate children', ' and all descendants'], (to, i) => {
        const classes = `reset-apply-to ${canReset ? '' : 'reset-apply-to-disabled'}`;
        const margin = i === 1 ? '0 8px' : 0;
        return <div key={i} className={classes} style={{ margin }} onClick={() => handleClickApplyTo(i)}>{`selected${to}`}</div>;
      })}
      {selectedAtoms.length > 0 && (
        <div id="descendants-selector-button" className="selector-button" style={{ background: '#0006' }} onClick={openDescendantsSelector}>
          <div>{`${selectedAtoms.length} selected`}</div>
        </div>
      )}
    </div>
  );
};

export default ResetBar;
