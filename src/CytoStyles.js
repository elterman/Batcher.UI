import { RED, BLUE, GREEN, SEARCHED_HIGHLIGHT, PALERED, PALEBLUE, DARKGREEN } from './const';
import { theme } from './utils';

export const getCytoStyles = (search, useid, invert) => {
  const errorColor = theme('#882431', invert, PALERED);
  const runningColor = theme('#146088', invert, PALEBLUE);
  const darkgray = '#222';

  const activeStyle = {
    selector: ':active',
    style: {
      content: 'data(long_label)',
      'text-wrap': 'wrap',
      'font-size': '1.8em',
      'text-background-opacity': 0.85,
      'text-background-color': darkgray,
      color: 'gainsboro',
      'text-background-padding': '10px',
      'text-border-width': '2px',
      'text-border-color': 'gainsboro',
      'text-border-opacity': 1,
      'z-index': 999
    },
  };

  const selectedStyle = {
    selector: 'node:selected',
    style: { 'background-color': theme('orange', invert, '#D08C00'), width: '1.5em', height: '1.5em' },
  };

  const styles = [
    // group selectors
    {
      selector: 'node',
      style: {
        shape: 'ellipse',
        width: '1.5em',
        height: '1.5em',
      },
    },
    {
      selector: 'edge',
      style: { 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' },
    },
    // class selectors
    {
      selector: '[?error]',
      style: {
        'background-color': theme(RED, invert, RED),
        'line-color': 'white',
        'font-size': '1.8em',
        'text-background-opacity': 1,
        'text-background-color': errorColor,
        color: 'gainsboro',
        'text-background-padding': '10px',
        'text-margin-y': '-14px',
        width: '1.5em',
        height: '1.5em',
        content: useid ? 'data(id)' : 'data(long_label)',
        'text-wrap': 'wrap',
        'text-border-width': '2px',
        'text-border-color': 'gainsboro',
        'text-border-opacity': 1,
        'z-index': 500,
        shape: 'polygon',
        // 'shape-polygon-points': '-0.65 -1, 0 -0.35, 0.65 -1, 1 -0.65, 0.35 0, 1 0.65, 0.65 1, 0 0.35, -0.65 1, -1 0.65, -0.35 0, -1 -0.65',
        'shape-polygon-points': '-0.5 -1, 0 -0.5, 0.5 -1, 1 -0.5, 0.5 0, 1 0.5, 0.5 1, 0 0.5, -0.5 1, -1 0.5, -0.5 0, -1 -0.5',
      },
    },
    {
      selector: 'edge[?source_error]',
      style: {
        'line-color': theme(RED, invert, RED),
        'target-arrow-color': theme(RED, invert, RED),
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      },
    },
    {
      selector: '[?success]',
      style: {
        'background-color': theme(GREEN, invert, DARKGREEN),
        'line-color': 'white',
        width: '1em',
        height: '1em',
        shape: 'diamond',
      },
    },
    {
      selector: 'edge[?source_success]',
      style: {
        'line-color': theme(GREEN, invert, DARKGREEN),
        'target-arrow-color': theme(GREEN, invert, DARKGREEN),
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      },
    },
    {
      selector: '[?running]',
      style: {
        'background-color': runningColor,
        'line-color': 'white',
        'font-size': '1.8em',
        'text-background-opacity': 1,
        'text-background-color': runningColor,
        color: 'gainsboro',
        width: '1.5em',
        height: '1.5em',
        content: useid ? 'data(id)' : 'data(short_label)',
        'text-wrap': 'none',
        'text-halign': 'center',
        'text-valign': 'top',
        'text-border-width': '2px',
        'text-border-color': 'gainsboro',
        'text-border-opacity': 1,
        'text-background-padding': '8px 12px',
        'text-margin-y': '-12px', // consider text-border-width and text-background-padding
        'border-color': 'gainsboro',
        'border-opacity': 1,
        'border-width': '2px',
        'z-index': 400,
        shape: 'rectangle',
      },
    },
    {
      selector: 'edge[?source_running]',
      style: {
        'line-color': theme(BLUE, invert, BLUE),
        'target-arrow-color': theme(BLUE, invert, BLUE),
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      },
    },
    selectedStyle,
    activeStyle,
  ];

  if (!search) {
    return styles;
  }

  const searchStyles = [
    {
      selector: `[name @*= '${search}']`,
      style: {
        'background-color': theme(SEARCHED_HIGHLIGHT, invert, '#EE82EE'),
        'font-size': '1.8em',
        'text-background-opacity': 1,
        'text-background-color': theme(SEARCHED_HIGHLIGHT, invert, '#EE82EE'),
        'text-background-padding': '8px 12px',
        'text-border-width': '2px',
        'text-border-color': 'gainsboro',
        'text-border-opacity': 1,
        color: 'gainsboro',
        width: '1.8em',
        height: '1.8em',
        content: useid ? 'data(id)' : 'data(short_label)',
        'text-wrap': 'wrap',
        'text-halign': 'center',
        'text-valign': 'top',
        'text-margin-y': '-12px', // consider border and padding
        'border-color': 'gainsboro',
        'border-opacity': 1,
        'border-width': '2px',
        'z-index': 666,
      },
    },
    selectedStyle,
    activeStyle,
  ];

  return styles.concat(searchStyles);
};
