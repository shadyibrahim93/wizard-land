import { Link } from 'react-router-dom';
export default function Header({ title, backTarget, level, suppressLevel }) {
  return (
    <header>
      <div className='mq-header-container'>
        {backTarget ? (
          <Link
            to={`${backTarget}`}
            className='mq-back-arrow'
          >
            ← Games
          </Link>
        ) : null}
        <h1>{title}</h1>
        {!suppressLevel && <h2 className='mq-level'>Level {level}</h2>}
      </div>
    </header>
  );
}
