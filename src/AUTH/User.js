import { useRecoilValue } from 'recoil';
import SvgUser from '../ICONS/SvgUser';
import { my_auth } from '../_atoms';

const User = () => {
  const auth = useRecoilValue(my_auth);
  const { user } = auth || {};
  const { avatar, displayName } = user || {};

  return (
    <>
      <div id="user-name" className="user" style={{ marginRight: '60px' }}>
        {displayName}
      </div>
      <div id="user-avatar" className="user" style={{ marginRight: '8px' }}>
        {avatar ? <img src={avatar} alt="user" style={{ width: '32px', borderRadius: '50%' }} /> : <SvgUser width={32} />}
      </div>
    </>
  );
};

export default User;
