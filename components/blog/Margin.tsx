export const Margin = ({
  y,
  yTop,
  yBottom,
}: {
  y?: number | string | undefined;
  yTop?: number | string | undefined;
  yBottom?: number | string | undefined;
}) => {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      style={{
        marginTop: y ? `${y}rem` : yTop ? `${yTop}rem` : "0rem",
        marginBottom: y ? `${y}rem` : yBottom ? `${yBottom}rem` : "0rem",
      }}
    />
  );
};
