import _ from 'lodash';
import { useEffect, useContext } from 'react';
import { SET_GRAPH_AUTO_SCALE, SET_GRAPH_SCALE, SET_GRAPH_SIZE, SET_GRAPH_SVG, SET_ORIGINAL_GRAPH_SVG } from './reducer';
import { StoreContext } from './Store';
import { doFetch } from './Batcher.Api';
import { DARKBLUE, DARKGREEN, DARKRED, DIMGRAY, PALEBLUE, PALEGRAY, PALEGREEN, PALERED, RED, SEARCHED_HIGHLIGHT, SELECTED_HIGHLIGHT, YELLOW } from './const';
import { isSearchMatch } from './AtomSelector';
import { invertHex } from './utils';
import { useRecoilValue } from 'recoil';
import { light_theme } from './_atoms';

const Graph = () => {
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { graphSvg, graphSize, graphScale, graphAutoScale } = state;
  const invert = useRecoilValue(light_theme);

  useEffect(() => {
    const ob = document.getElementById('graph-svg');

    if (!graphSvg || !ob) {
      return;
    }

    const w = graphSize.width;
    const h = graphSize.height;

    let svg = graphSvg.replace(`"${w}pt"`, `"${w * graphScale}pt"`).replace(`"${h}pt"`, `"${h * graphScale}pt"`);

    if (invert) {
      svg = svg.replaceAll(DARKGREEN.toLowerCase(), invertHex(PALEGREEN));
      svg = svg.replaceAll(DARKBLUE.toLowerCase(), invertHex(PALEBLUE));
      svg = svg.replaceAll(DIMGRAY.toLowerCase(), invertHex(PALEGRAY));
      svg = svg.replaceAll(DARKRED.toLowerCase(), invertHex(PALERED));
      svg = svg.replaceAll(RED.toLowerCase(), invertHex('#FF0000'));
    }

    ob.innerHTML = svg;
  }, [graphSvg, graphSize, graphScale, invert]);

  useEffect(() => {
    if (!graphAutoScale || !graphSvg || !graphSize.width) {
      return;
    }

    const scale = getAutoScale(graphSize);
    doScale(Math.min(1, scale), graphScale, dispatch);

    dispatch({ type: SET_GRAPH_AUTO_SCALE, auto: false });
  }, [graphSvg, graphSize, graphScale, graphAutoScale, dispatch]);

  if (graphAutoScale) {
    return null;
  }

  return <div id="graph-svg" />;
};

export const getScales = (graphSize) => {
  const rect = document.getElementById('graph-container')?.getBoundingClientRect();
  const scaleX = (rect.width - 20) / (graphSize.width * (4 / 3));
  const scaleY = (rect.height - 20) / (graphSize.height * (4 / 3));

  return [scaleX, scaleY];
};

export const getAutoScale = (graphSize) => {
  const scales = getScales(graphSize);
  return Math.min(scales[0], scales[1]);
};

export const doScale = (scale, graphScale, dispatch) => {
  scale = Math.min(5, Math.max(scale, 0.1));

  if (scale !== graphScale) {
    dispatch({ type: SET_GRAPH_SCALE, scale });
  }

  return scale;
};

export const highlightSelected = (svg, selectedAtoms, nodes, atomSearch, dispatch, invert) => {
  const doHighlight = (atoms, searched) => {
    _.each(atoms, (atom) => {
      let i = svg.indexOf(`id=${atom.id} `);
      const attr = searched ? 'fill' : 'fill';
      i = svg.indexOf(`${attr}="#`, i);
      const j = svg.indexOf('"', i + 7);

      let color = searched ? (invert ? invertHex('#EE82EE') : SEARCHED_HIGHLIGHT) : (invert ? invertHex(YELLOW) : SELECTED_HIGHLIGHT);

      let insert = `${color}"${searched ? ' stroke-width="2"' : ''}`;
      svg = svg.slice(0, i + attr.length + 2) + `${insert}` + svg.slice(j + 1);
    });
  };

  if (!_.isEmpty(atomSearch)) {
    let matches = _.filter(nodes, (n) => isSearchMatch(n.data, atomSearch));
    matches = _.map(matches, (n) => n.data);
    doHighlight(matches, true);
  }

  if (!_.isEmpty(selectedAtoms)) {
    doHighlight(selectedAtoms, false);
  }

  dispatch({ type: SET_GRAPH_SVG, svg });
};

export const loadGraph = (auth, batch, selectedAtoms, nodes, atomSearch, dispatch, reportError, invert) => {
  const url = `batch_graph?batch_name=${batch}`;

  doFetch(
    url,
    auth,
    (res) => {
      if (res.ok) {
        const xml = res.data;
        let svg = xml.slice(xml.indexOf('<svg')).trimEnd().replaceAll('<!-- ', '{"').replaceAll(' -->', '"}');

        const parts = svg.split('pt"');
        const extract = (i) => parts[i].slice(parts[i].indexOf('"') + 1);
        dispatch({ type: SET_GRAPH_SIZE, size: { width: extract(0), height: extract(1) } });

        dispatch({ type: SET_ORIGINAL_GRAPH_SVG, svg });

        highlightSelected(svg, selectedAtoms, nodes, atomSearch, dispatch, invert);
      } else {
        reportError(res);
      }
    },
    true
  );
};

export default Graph;
