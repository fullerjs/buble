'use strict';
const buble = require('buble');

module.exports = function(f, mat, options, next) {
  if (!(f.env === 'production' || options.compile)) {
    next(null, mat);
    return;
  }

  mat.getContent(content => {
    try {
      const { code } = buble.transform(content.toString());
      next(null, mat.setContent(code));
    } catch (err) {
      return next({
        message: err.message,
        line: err.loc.line,
        column: err.loc.column,
        file: mat.dst().path,
        extract: err.snippet
      });
    }
  });
};
