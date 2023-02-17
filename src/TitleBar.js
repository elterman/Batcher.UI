import SvgLogo from './ICONS/SvgLogo';
import User from './AUTH/User';
import { GREEN } from './const';

const TitleBar = () => {
  const SAND = '#B8AF8F'

  return (
    <div className="title-bar">
      <div className="app-logo">
        <SvgLogo width={54} shadow style={{ gridArea: '1/1', transform: 'translate(2px, 2px)' }} />
        <SvgLogo width={54} style={{ gridArea: '1/1', zIndex: 1 }} />
      </div>
      <div className="title">
        <span style={{color: SAND}}>GEDI</span>
        <span style={{color: GREEN}}>BATCHER</span>
        <span style={{color: SAND}}>DASHBOARD</span>
      </div>
      <User />
    </div>
  );
};

export default TitleBar;
