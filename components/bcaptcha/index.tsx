const BCaptcha: React.FC = () => {
  return (
    <iframe
      src="https://bcaptcha.vercel.app"
      width="200"
      height="50"
      className="border-border rounded-md bg-background"
      title="BCaptcha"
      sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      aria-label="Please click on the button to prove that you are not a robot"
    />
  );
};

export default BCaptcha;
