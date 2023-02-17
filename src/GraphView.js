import { useState, useEffect, useContext, useRef } from 'react';
import { StoreContext } from './Store';
import { SET_GRAPH_SCROLL_POS, SET_SELECTED_ATOMS } from './reducer';
import _ from 'lodash';
import Graph, { doScale, getAutoScale } from './Graph';
import { handleAtomClick } from './AtomSelector';
import GraphBar, { doHandleScale } from './GraphBar';
import { my_auth } from './_atoms';
import { useRecoilValue } from 'recoil';
import { useReportError } from './hooks';
import Spinner from './Spinner';
import copy from 'copy-text-to-clipboard';
import { useToaster } from './Toaster';

const GraphView = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { graphScale, graphSize, graphScrollPos, graphAutoScale, sortedNodes, selectedAtoms, atomStateReset } = state;
  const l = useRef({}).current;
  const [areaFrom, setAreaFrom] = useState();
  const [area, setArea] = useState();
  const [capture, setCapture] = useState();
  const auth = useRecoilValue(my_auth);
  const reportError = useReportError();
  const addToast = useToaster();

  useEffect(() => {
    l.scrollPos = graphScrollPos;
    l.graph?.scrollTo(graphScrollPos?.x || 0, graphScrollPos?.y || 0);
  }, [l, graphScrollPos]);

  const handleScroll = (e) => {
    const pos = { x: e.target.scrollLeft, y: e.target.scrollTop };

    if (l.panFrom) {
      l.panFrom.x += l.scrollPos.x - pos.x;
      l.panFrom.y += l.scrollPos.y - pos.y;
    }

    dispatch({ type: SET_GRAPH_SCROLL_POS, pos });
  };

  const normXY = (e) => {
    const r = l.graph.getBoundingClientRect();
    const x = Math.min(r.width - 1, Math.max(0, e.clientX - r.x));
    const y = Math.min(r.height - 1, Math.max(0, e.clientY - r.y));

    return { x, y };
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Escape') {
      e.preventDefault();

      if (areaFrom) {
        releaseCapture();
      } else {
        doHandleScale(2, { graphScale, graphSize, graphScrollPos }, dispatch);
      }
    }
  };

  useEffect(() => {
    l.graph?.focus();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const releaseCapture = () => {
    capture && l.graph.releasePointerCapture(capture);
    setCapture(null);
    setAreaFrom(null);
    setArea(null);
    l.panFrom = null;
  };

  const getNode = e => {
    let atom = null;

    const tip = e.target.parentElement.attributes['xlink:title']?.value;
    let i = tip?.indexOf(' • ');

    if (i > 0) {
      const id = tip.slice(3, i);
      atom = _.find(sortedNodes, (n) => `${n.data.id}` === id)?.data;
    }

    return atom;
  };

  const selectNode = (e) => {
    const atom = getNode(e);

    if (atom) {
      handleAtomClick(e, auth, atom, selectedAtoms, dispatch, reportError);
    } else {
      dispatch({ type: SET_SELECTED_ATOMS, atoms: [] });
    }
  };

  const copyNodeText = atom => {
    let text = atom.long_label;
    let lines = text.split('\n');

    if (lines.length === 2) {
      text = `${lines[1]}\n${lines[0]}`;
      lines = text.split('\n');
    }

    copy(text);

    addToast({
      type: 'success', duration: 2000, renderCallback: () => <>
        <div style={{ marginBottom: '10px' }}>Copied to clipboard:</div>
        {_.map(lines, (l, i) => <div key={i}>{l}</div>)}</>
    });
  };

  const handlePointerDown = (e) => {
    if (e.altKey) {
      e.button === 0 && selectNode(e);
      return;
    }

    if (e.shiftKey) {
      const atom = getNode(e);
      atom && copyNodeText(atom);

      return;
    }

    const { x, y } = normXY(e);

    if (e.ctrlKey || e.button === 2) {
      setAreaFrom({ x, y });
    } else {
      l.panFrom = { x, y };
    }

    setCapture(e.pointerId);
    l.graph.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const { x, y } = normXY(e);

    if (l.panFrom) {
      l.graph?.scrollTo(l.scrollPos.x + l.panFrom.x - x, l.scrollPos.y + l.panFrom.y - y);
      return;
    }

    if (!areaFrom) {
      return;
    }

    const x1 = Math.min(areaFrom.x, x);
    const y1 = Math.min(areaFrom.y, y);
    const x2 = Math.max(areaFrom.x, x);
    const y2 = Math.max(areaFrom.y, y);

    setArea({ x1, y1, x2, y2 });
  };

  const handlePointerUp = (e) => {
    releaseCapture();

    if (!area) {
      return;
    }

    const width = ((area.x2 - area.x1) * 3) / 4;
    const height = ((area.y2 - area.y1) * 3) / 4;

    if (width < 20 || height < 20) {
      return;
    }

    let scale = getAutoScale({ width, height }) * graphScale;
    scale = doScale(scale, graphScale, dispatch);

    if (scale === graphScale) {
      return;
    }

    const x = ((graphScrollPos.x + area.x1) / graphScale) * scale;
    const y = ((graphScrollPos.y + area.y1) / graphScale) * scale;
    dispatch({ type: SET_GRAPH_SCROLL_POS, pos: { x, y } });
  };

  return (
    <div className="graph-view">
      <GraphBar />
      <div
        id="graph-container"
        className="graph-container root-scroll"
        ref={(e) => (l.graph = e)}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}>
        <Graph />
      </div>
      {area && (
        <div
          className="zoom-area"
          style={{ transform: `translate(${area.x1}px, ${area.y1}px)`, width: `${area.x2 - area.x1}px`, height: `${area.y2 - area.y1}px` }}
        />
      )}
      {(graphAutoScale || atomStateReset) && <Spinner style={{ gridArea: '2/1' }} />}
    </div>
  );
};

export default GraphView;
