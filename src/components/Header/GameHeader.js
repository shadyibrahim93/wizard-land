import { Link } from 'react-router-dom';

const HeaderContent = ({ title, backTarget, level, homePage }) => {
  return (
    <header>
      <div className='mq-header-container'>
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
      </div>
    </header>
  );
};

export default HeaderContent;
