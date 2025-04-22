import MenuItem from '../menu/menuItem';
import {
  playChest,
  playEquip,
  playLogInOut,
  playPageFlip,
  playDoor
} from '../../hooks/useSound';
import { useNavigate } from 'react-router-dom';

const HeaderContent = ({
  userId,
  onSignIn,
  onLogout,
  showShop,
  showInventory,
  showAbout
}) => {
  const navigate = useNavigate();

  return (
    <header>
      <div className='mq-header-container'>
        <>
          <MenuItem
            imgSrc='home.png'
            onHoverImgSrc='home_active.png'
            onClick={() => navigate('/')}
            playHoverSound={playDoor}
            title='GAMES'
          />
          <MenuItem
            imgSrc='shop.png'
            onHoverImgSrc='shop_active.png'
            onClick={showShop}
            playHoverSound={playChest}
            title='SHOP'
          />
          <MenuItem
            imgSrc='inventory.png'
            onHoverImgSrc='inventory_active.png'
            onClick={showInventory}
            playHoverSound={playEquip}
            title='STASH'
          />
          <MenuItem
            imgSrc='about.png'
            onHoverImgSrc='about_active.png'
            onClick={showAbout}
            playHoverSound={playPageFlip}
            title='ABOUT'
          />
          {userId ? (
            <MenuItem
              imgSrc='logout.png'
              onHoverImgSrc='logout_active.png'
              onClick={onLogout}
              playHoverSound={playLogInOut}
              title='LOGOUT'
            />
          ) : (
            <MenuItem
              imgSrc='login.png'
              onHoverImgSrc='login_active.png'
              onClick={onSignIn}
              playHoverSound={playLogInOut}
              title='LOGIN'
            />
          )}
        </>
      </div>
    </header>
  );
};

export default HeaderContent;
