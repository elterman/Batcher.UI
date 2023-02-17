import { useContext, useEffect } from 'react';
import { StoreContext } from './Store';
import _ from 'lodash';
import SvgScale from './ICONS/SvgScale';
import { useTooltip } from './Tooltip';
import { SCALE_UP, SCALE_DOWN, SCALE_XY } from './const';
import { doScale, getAutoScale, getScales, highlightSelected } from './Graph';
import { SET_ATOM_SEARCH, SET_GRAPH_SCROLL_POS } from './reducer';
import SearchPanel from './SearchPanel';
import { getMatches } from './AtomSelector';
import ResetBar from './ResetBar';
import { useRecoilValue } from 'recoil';
import { light_theme } from './_atoms';

const GraphBar = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { graphScale, graphSize, graphScrollPos, atomSearch, originalGraphSvg, selectedAtoms, batchNodes } = state;
  const tooltip = useTooltip();
  const invert = useRecoilValue(light_theme);

  const SCALE_OPS = [
    'Fit Horizontally',
    'Fit Vertically',
    'Fit All (Esc)',
    'Zoom Out by 50%\n(with Ctrl – by 10%)',
    '100%',
    'Zoom In by 50%\n(with Ctrl – by 10%)',
  ];

  const handleScale = (e, op) => doHandleScale(op, { graphSize, graphScale, graphScrollPos }, dispatch, e.ctrlKey);

  const matches = getMatches(batchNodes, atomSearch);

  useEffect(() => originalGraphSvg && highlightSelected(originalGraphSvg, selectedAtoms, batchNodes, atomSearch, dispatch, invert),
    [originalGraphSvg, selectedAtoms, batchNodes, atomSearch, dispatch, invert]);

  const tip =
    'Right-click (or Ctrl-click) and drag to select zoom area.\nClick and drag to pan.\nAlt-click to select atom.\nCtrl-Alt-click to select more atoms, or to unselect.\nAlt-click on empty space to unselect all.\nShift-click to copy atom text.';

  return (
    <div className="graph-bar">
      <SearchPanel
        searchType={SET_ATOM_SEARCH}
        placeholder="search by name"
        height="30px"
        matches={matches}
        style={{ margin: '0 0 0 4px', width: '321px' }}
      />
      <div className="bar-separator"></div>
      {_.map(SCALE_OPS, (op, i) => {
        return (
          <div
            key={i}
            className="graph-scale-option"
            onClick={(e) => handleScale(e, i)}
            onMouseEnter={(e) => tooltip.show({ store, e, text: op })}
            onMouseLeave={tooltip.hide}>
            <SvgScale op={i} width={24} />
          </div>
        );
      })}
      {graphScale > 0 && <span>{`${Math.round(graphScale * 100)}%`}</span>}
      <div className="info-box" onMouseEnter={(e) => tooltip.show({ store, e, text: tip })} onMouseLeave={tooltip.hide}>
        i
      </div>
      <div className="bar-separator"></div>
      <ResetBar style={{ background: 'initial' }} />
    </div>
  );
};

export const doHandleScale = (op, info, dispatch, ctrl) => {
  const { graphScale, graphSize, graphScrollPos } = info;

  let scale = 1;

  if (op === SCALE_XY) {
    scale = getAutoScale(graphSize);
  } else if (op < SCALE_XY) {
    const scales = getScales(graphSize);
    scale = scales[op];
  } else {
    scale = Math.round(graphScale * 10) / 10;
    const delta = ctrl && (op === SCALE_DOWN || op === SCALE_UP) ? 0.1 : 0.5;
    scale = op === SCALE_DOWN ? scale - delta : op === SCALE_UP ? scale + delta : 1;
  }

  scale = doScale(scale, graphScale, dispatch);

  if (scale === graphScale) {
    return;
  }

  const x = (graphScrollPos.x / graphScale) * scale;
  const y = (graphScrollPos.y / graphScale) * scale;

  dispatch({ type: SET_GRAPH_SCROLL_POS, pos: { x, y } });
};

export default GraphBar;
