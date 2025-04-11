const CustomLink = ({ className, onClick, Icon, text }) => {
  return (
    <a
      className={`mq-link ${className}`}
      onClick={onClick}
    >
      {text} {Icon}
    </a>
  );
};

export default CustomLink;
