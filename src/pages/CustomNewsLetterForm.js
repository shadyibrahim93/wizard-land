function CustomNewsletterForm({ status, message, onValidated }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    email && email.indexOf('@') > -1 && onValidated({ EMAIL: email });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='newsletter-form'
    >
      <input
        type='email'
        placeholder='Your email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type='submit'>Notify Me</button>

      {status === 'sending' && <div className='status-msg'>Sending...</div>}
      {status === 'error' && (
        <div
          className='status-msg'
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === 'success' && (
        <div className='status-msg success'>
          🎉 You're on the list! See you at launch.
        </div>
      )}
    </form>
  );
}
