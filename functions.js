export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const fetchColors = async () => {
  const response = await fetch('colors.json');
  const data = await response.json();
  return data.colors;
};
