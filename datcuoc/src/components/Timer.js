const Timer = ({ timeLeft }) => (
  <p style={{ color: timeLeft <= 5 ? "red" : "inherit", fontWeight: "bold" }}>
    {`Còn ${timeLeft} giây`}
  </p>
);

export default Timer;