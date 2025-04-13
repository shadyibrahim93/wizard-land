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
  showShop
}) => {
  return (
    <header>
      <div className='mq-header-container'>
        {homePage && (
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
              showModal={undefined}
              title='INVENTORY'
            />
          </>
        )}
        {backTarget && (
          <Link
            to={backTarget}
            className='mq-back-arrow'
          >
            ← Games
          </Link>
        )}
        <h1>{title}</h1>
        {!homePage && <h2 className='mq-level'>Level {level}</h2>}
        {homePage && (
          <MenuItem
            imgSrc='about.png'
            onHoverImgSrc='about_active.png'
            onClick={undefined}
            title='ABOUT'
          />
        )}
        {homePage &&
          (userId ? (
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
          ))}
      </div>
    </header>
  );
};

export default HeaderContent;
