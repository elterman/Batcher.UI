import { useContext } from 'react';
import { SET_REFRESH_SELECTOR_OPEN } from './reducer';
import { StoreContext } from './Store';
import SvgReload from './ICONS/SvgReload';
import _ from 'lodash';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { light_theme, options_open, timer_ticks } from './_atoms';

const TimeburgerPanel = (props) => {
  const ticks = useRecoilValue(timer_ticks);
  const invert = useRecoilValue(light_theme);
  const setOptionsOpen = useSetRecoilState(options_open);

  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { refreshInterval, pauseRefresh } = state;

  const openOptions = () => setOptionsOpen(true);

  const openRefreshSelector = () => dispatch({ type: SET_REFRESH_SELECTOR_OPEN, open: true });

  const timeout = pauseRefresh ? '0:00' : new Date((refreshInterval - (ticks || 0)) * 1000).toISOString().substr(15, 4);
  const classes = `timer${invert ? '-inverted' : ''} ${pauseRefresh ? (invert ? 'timer-inverted-paused' : 'timer-paused') : ''}`;

  return (
    <div className="timeburger-panel" style={props.style}>
      <div id="refresh-selector-button" className="selector-button timer" onClick={openRefreshSelector}>
        <SvgReload width={18} />
        <div className={classes}>{timeout}</div>
      </div>
      <div id="hamburger" className="hamburger" onClick={openOptions}>
        {_.map([0, 1, 2], (i) => (
          <div key={i} className="dash" style={{ width: '20px', margin: `${i === 1 ? '4px 0' : 0}` }} />
        ))}
      </div>
    </div>
  );
};

export default TimeburgerPanel;
