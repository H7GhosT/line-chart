Array.prototype.last = function() {  // eslint-disable-line
  if(!this.length) return undefined;
  return this[this.length - 1];
};
