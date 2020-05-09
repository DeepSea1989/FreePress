const { emoji } = require('@freepress/util');
const visit = require('unist-util-visit');

module.exports = ({ markdownAST }) => {
  visit(markdownAST, 'text', function(node) {
    node.value = emoji(node.value);
  });
};
