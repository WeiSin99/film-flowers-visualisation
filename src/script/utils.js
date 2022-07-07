const calculateGridPos = (i) => {
  const width = 1152;
  const pathWidth = 120;
  const perRow = Math.floor(width / pathWidth);

  return [
    ((i % perRow) + 0.5) * pathWidth,
    (Math.floor(i / perRow) + 0.5) * pathWidth,
  ];
};

export { calculateGridPos };
