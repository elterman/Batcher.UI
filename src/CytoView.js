import { useEffect, useContext, useRef } from 'react';
import { StoreContext } from './Store';
import CytoscapeComponent from 'react-cytoscapejs';
import { getCytoStyles } from './CytoStyles';
import CytoBar from './CytoBar';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import coseBilkent from 'cytoscape-cose-bilkent';
import euler from 'cytoscape-euler';
import spread from 'cytoscape-spread';
import klay from 'cytoscape-klay';
import { selectAtom } from './AtomSelector';
import _ from 'lodash';
import { SET_SELECTED_ATOMS } from './reducer';
import { light_theme, my_auth } from './_atoms';
import { useRecoilValue } from 'recoil';
import { useReportError } from './hooks';

cytoscape.use(cola);
cytoscape.use(dagre);
cytoscape.use(coseBilkent);
cytoscape.use(euler);
cytoscape.use(spread);
cytoscape.use(klay);

const CytoView = (props) => {
  const { style } = props;
  const store = useContext(StoreContext);
  const { state, dispatch } = store;
  const { selectedLayout, selectedAtoms, atomSearch, elements, useIdForLabel } = state;
  const l = useRef({}).current;
  const auth = useRecoilValue(my_auth);
  const reportError = useReportError();
  const invert = useRecoilValue(light_theme);

  useEffect(() => {
    const ids = _.map(selectedAtoms, (a) => a.id);
    const elems = l.cy?.filter((e) => ids.includes(e.data('id')));
    elems?.select();
  }, [selectedAtoms, l.cy]);

  if (!elements.length) {
    l.cy = null;
  }

  const subscribe = (cy) => {
    if (l.cy) {
      return;
    }

    l.cy = cy;

    const selectAtoms = () => {
      const selected = cy.$(':selected');
      const atoms = _.map(selected, (ob) => ob.data());

      if (atoms.length === 1) {
        selectAtom(auth, atoms[0], dispatch, reportError);
      } else {
        dispatch({ type: SET_SELECTED_ATOMS, atoms });
      }
    };

    cy.nodes().on('select', selectAtoms);
    cy.nodes().on('unselect', selectAtoms);
  };

  return (
    <div style={{ display: 'grid', grid: 'auto 1fr / auto', ...style }}>
      <CytoBar />
      {elements.length ? (
        <CytoscapeComponent
          layout={{ name: selectedLayout, fit: true, animate: true }}
          style={{ gridArea: '2/1', background: '#0000', padding: '10px' }}
          stylesheet={getCytoStyles(atomSearch[1], useIdForLabel, invert)}
          elements={elements}
          cy={(cy) => subscribe(cy)}
        />
      ) : null}
    </div>
  );
};

export default CytoView;
