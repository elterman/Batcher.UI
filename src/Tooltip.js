import _ from 'lodash';
import { useRecoilValue, useRecoilState } from 'recoil';
import { my_tooltip } from './_atoms';
import { useSpring, animated } from 'react-spring';

const Tooltip = () => {
  const info = useRecoilValue(my_tooltip);
  const show = info.text || info.renderCallback;
  const { opacity } = useSpring({ opacity: `${info.text ? 1 : 0}`, delay: info.delay, immediate: !info.text });

  if (!show) {
    return null;
  }

  const { x, y, text, renderCallback, style } = info;

  const display = show ? 'initial' : 'none';
  const left = `${x}px`;
  const top = `${y}px`;

  return (
    <animated.div className="tooltip" style={{ display, left, top, opacity, ...style }}>
      {renderCallback ? renderCallback() : _.map(text?.split('\n'), (l, i) => <div key={i}>{l}</div>)}
    </animated.div>
  );
};

export default Tooltip;

export const useTooltip = () => {
  const [info, setInfo] = useRecoilState(my_tooltip);

  const show = (props) => {
    const { e, text, renderCallback, anchor = 'target', style } = props;

    const dx = props.dx || 0;
    const dy = props.dy || 35;
    const delay = props.delay || 200;

    if (e) {
      let point = { x: e.clientX, y: e.clientY };

      if (anchor !== 'pointer') {
        const r = e.target.getBoundingClientRect();
        point = { x: r?.x, y: r?.y };
      }

      setInfo(text || renderCallback ? { text, renderCallback, x: point.x + dx, y: point.y + dy, delay, style } : {});
    } else if (!_.isEmpty(info)) {
      setInfo({});
    }
  };

  const hide = () => show({});

  return { show, hide };
};
