import { Link } from 'react-router-dom';
import MenuItem from '../menu/menuItem';

const HeaderContent = ({
  title,
  backTarget,
  level,
  homePage,
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
            title='SHOP'
          />
          <MenuItem
            imgSrc='inventory.png'
            onHoverImgSrc='inventory_active.png'
            onClick={showInventory}
            title='INVENTORY'
          />
        </>
        <h1>{title}</h1>
        <MenuItem
          imgSrc='about.png'
          onHoverImgSrc='about_active.png'
          onClick={undefined}
          title='ABOUT'
        />
        {userId ? (
          <MenuItem
            imgSrc='logout.png'
            onHoverImgSrc='logout_active.png'
            onClick={onLogout}
            title='LOGOUT'
          />
        ) : (
          <MenuItem
            imgSrc='login.png'
            onHoverImgSrc='login_active.png'
            onClick={onSignIn}
            title='LOGIN'
          />
        )}
      </div>
    </header>
  );
};

export default HeaderContent;
