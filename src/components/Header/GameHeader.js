import MenuItem from '../menu/menuItem';
import {
  playChest,
  playEquip,
  playHorn,
  playLogInOut,
  playPageFlip
} from '../../hooks/useSound';

const HeaderContent = ({
  title,
  userId,
  onSignIn,
  onLogout,
  showShop,
  showInventory
}) => {
  return (
    <header>
      <div className='mq-header-container'>
        <>
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
            title='INVENTORY'
          />
        </>
        <h1>{title}</h1>
        <MenuItem
          imgSrc='about.png'
          onHoverImgSrc='about_active.png'
          onClick={undefined}
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
      </div>
    </header>
  );
};

export default HeaderContent;
