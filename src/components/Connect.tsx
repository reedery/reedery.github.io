import './Connect.css';

type SocialLink = {
  href: string;
  className: string;
  label: string;
  target?: string;
};

const Connect = () => {
  const socialLinks: SocialLink[] = [
    {
      href: "mailto:reede.ryan@gmail.com",
      className: "fa fa-envelope",
      label: "Email"
    },
    {
      href: "https://www.linkedin.com/in/ryreede/",
      className: "fa fa-linkedin",
      label: "LinkedIn",
      target: "_blank"
    },
    {
      href: "https://github.com/reedery",
      className: "fa fa-github",
      label: "GitHub",
      target: "_blank"
    },
    {
      href: "https://vimeo.com/user715423",
      className: "fa fa-vimeo",
      label: "Vimeo",
      target: "_blank"
    },
    {
      href: "https://on.soundcloud.com/pPy9atwTA8FYMGSq6",
      className: "fa fa-soundcloud",
      label: "SoundCloud",
      target: "_blank"
    }
  ];

  return (
    <div className="connect-section">
      <div className="social-title">Connect with Ryan</div>
      
      <div className="social-icons">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className={link.className}
            target={link.target}
            rel={link.target ? "noopener noreferrer" : undefined}
            aria-label={link.label}
          />
        ))}
      </div>
    </div>
  );
};

export default Connect; 