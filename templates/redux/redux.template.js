module.exports = ({ FileName }) => {
  return `export const foo = () => console.log('${FileName}');`;
};
