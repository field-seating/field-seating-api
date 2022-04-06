const photoPathLength = require('../../constants/photo-constant');

function generatePath(newPathNumber) {
  newPathNumber = newPathNumber.toString();
  if (newPathNumber.length === 5) return newPathNumber;
  const zeroNeed = photoPathLength - newPathNumber.length;
  for (let i = zeroNeed; i > 0; i--) {
    newPathNumber = `0${newPathNumber}`;
  }
  return newPathNumber;
}

module.exports = generatePath;
