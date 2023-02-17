import { useContext, useEffect, useState } from 'react';
import { StoreContext } from './Store';
import _ from 'lodash';
import { SET_REFRESH_INTERVAL } from './reducer';
import { REFRESH_INTERVAL_KEY, OPTIONS_WIDTH, REFRESH_INTERVALS, LIGHT_THEME } from './const';
import copy from 'copy-text-to-clipboard';
import SvgCopy from './ICONS/SvgCopy';
import { singleSelectedAtom } from './AtomSelector';
import { light_theme, options_open } from './_atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import CheckBox from './CheckBox';

const Options = () => {
  const setOptionsOpen = useSetRecoilState(options_open);
  const [invert, setInvert] = useRecoilState(light_theme);

  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { refreshInterval, selectedBatch, selectedAtoms, selectedHistoryItem, atomHistory } = state;
  const selectedAtom = singleSelectedAtom(selectedAtoms);
  const [link, setLink] = useState();
  const [copying, setCopying] = useState();

  useEffect(() => {
    let origin = window.location === window.parent.location ? `${window.location.origin}/` : document.referrer;

    const i = origin.indexOf('/?');

    if (i > 0) {
      origin = origin.substr(0, i + 1);
    }

    let url = `${origin}?bid=${selectedBatch?.id}`;

    if (selectedAtom) {
      url += `&aid=${selectedAtom?.id}`;
    }

    if (selectedHistoryItem?.logid) {
      url += `&lid=${selectedHistoryItem?.logid}`;
    }

    setLink(url);
  }, [selectedBatch, selectedAtom, selectedHistoryItem, atomHistory]);

  const off = document.getElementById('hamburger')?.getBoundingClientRect();

  if (!off) {
    return null;
  }

  const handleModalClick = (e) => {
    if (typeof e.target.className === 'string' && e.target.className.includes('modal-screen')) {
      setOptionsOpen(false);
    }
  };

  const setRefreshInterval = (secs) => {
    if (secs !== refreshInterval) {
      dispatch({ type: SET_REFRESH_INTERVAL, secs });
      localStorage.setItem(REFRESH_INTERVAL_KEY, secs);

      setTimeout(() => setOptionsOpen(false), 300);
    }
  };

  const copyLink = () => {
    setCopying(true);
    copy(link);

    setTimeout(() => setCopying(false), 500);
  };

  const style = {
    padding: '20px',
    background: '#272F37',
    width: `${OPTIONS_WIDTH}px`,
    left: `${off?.left + 20 - OPTIONS_WIDTH}px`,
    top: `${off?.bottom + 15}px`,
  };

  const opacity = copying ? 0.5 : 1;

  return (
    <div className="modal-screen" onClick={handleModalClick}>
      <div className="dropdown" style={style}>
        <div className="intervals-box">
          <div style={{ marginRight: '10px' }}>Refresh every</div>
          {_.map(REFRESH_INTERVALS, (i) => {
            const selected = i === refreshInterval;
            const cursor = selected ? 'initial' : 'pointer';
            const classes = `interval-option ${selected ? 'interval-option-selected' : ''}`;
            return (
              <div key={i} className={classes} style={{ cursor }} onClick={() => setRefreshInterval(i)}>
                {i}
              </div>
            );
          })}
          <div style={{ marginLeft: '10px' }}>seconds</div>
        </div>
        <div className="columns link-box">
          <div style={{ opacity }}> {link}</div>
          <div className="copy-link" onClick={copyLink}>
            <SvgCopy width={20} style={{ opacity }} />
          </div>
        </div>
        <CheckBox checked={invert} label='Light Theme' style={{ marginTop: '20px', justifySelf: 'start' }}
          handleToggle={(on) => {
            setInvert(on); on ? localStorage.setItem(LIGHT_THEME, true) : localStorage.removeItem(LIGHT_THEME);
            setOptionsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Options;
