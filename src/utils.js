import { useEffect, useRef } from 'react';
// import dayjs from 'dayjs';
import _ from 'lodash';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const syncScroll = (id, pos) => {
  let ob = document.getElementById(id);
  ob?.scrollTo(pos, 0);
};

export const formatDate = (date) => {
  if (date?.length > 6) {
    date = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
  }

  return date;

  // return !date
  //   ? ''
  //   : date.length > 6
  //   ? dayjs(date).format('MMM D, YYYY')
  //   : dayjs(`${date.substr(2, 4)}-${date.substr(0, 2)}-01`, 'YYYY-MM-DD').format('MMMM YYYY');
};

export const windowSize = () => {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight;

  return { x, y };
};

export const textWidth = (text, font) => {
  const canvas = document.getElementById('canvas');
  const context = canvas?.getContext('2d');

  if (!context) {
    return 0;
  }

  context.font = font || '13px Roboto';
  const tm = context.measureText(text);

  return tm.width + 5;
};

export const formatNumeric = (val, precision, separateThousands) => {
  const numeric = _.isNumber(val);
  let value = precision === undefined || !numeric ? val : val.toFixed(precision);

  if (numeric && separateThousands) {
    var parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    value = parts.join('.');
  }

  return value;
};

export const getPrecision = (column, metadata) => _.get(metadata, `${column}.precision`);

export const getSeparateThousands = (column, metadata) => _.get(metadata, `${column}.thousandsSeparator`);

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // set up the interval
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const parseQuery = () => {
  const params = new URLSearchParams(window.location.search);

  const bid = params.get('bid');
  const aid = params.get('aid');
  const lid = params.get('lid');

  const res = {};

  if (bid) {
    res.bid = Number(bid);
  }

  if (aid) {
    res.aid = Number(aid);
  }

  if (lid) {
    res.lid = Number(lid);
  }

  return res;
};

export const invertHex = (hex) => '#' + (Number(`0x1${hex.slice(1)}`) ^ 0xFFFFFF).toString(16).slice(1).toUpperCase();

export const theme = (color, invert, altHex) => invert ? invertHex(altHex) : color;