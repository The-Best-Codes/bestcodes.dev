const BCaptcha: React.FC = () => {
  return (
    <iframe
      src="/bcaptcha"
      width="200"
      height="50"
      className="border-border rounded-md bg-background"
      title="BCaptcha"
      aria-label="Please click on the button to prove that you are not a robot"
    />
  );
};

export default BCaptcha;
