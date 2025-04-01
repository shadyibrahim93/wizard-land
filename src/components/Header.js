export default function Header({ title, backTarget, level, suppressLevel }) {
  return (
    <header>
      <div className='mq-header-container'>
        {backTarget ? (
          <a
            href={`/wizard-land${backTarget}`}
            className='mq-back-arrow'
          >
            ← Games
          </a>
        ) : null}
        <h1>{title}</h1>
        {!suppressLevel && <h2 className='mq-level'>Level {level}</h2>}
      </div>
    </header>
  );
}
