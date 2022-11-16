module.exports = ({ pendingType, successType }) => {
  return `export interface ${pendingType} {
}

export interface ${successType} {
}
`;
};
