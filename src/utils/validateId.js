function validateId(id) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  }
}

module.exports = validateId;
