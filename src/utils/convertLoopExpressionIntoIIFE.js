import adjustIndent from '../utils/adjustIndent';
import getFreeBinding from '../utils/getFreeBinding';
import getIndent from '../utils/getIndent';
import indentNode from '../utils/indentNode';
import isExpressionResultUsed from '../utils/isExpressionResultUsed';
import trimmedNodeRange from '../utils/trimmedNodeRange';
import type MagicString from 'magic-string';
import type { Node } from '../types';

/**
 * If the `for` loop is used as an expression we wrap it in an IIFE.
 */
export default function convertLoopExpressionIntoIIFE(node: Node, patcher: MagicString): boolean {
  if (!isExpressionResultUsed(node)) {
    return false;
  }

  const result = getFreeBinding(node.scope, 'result');

  let thisIndent = getIndent(patcher.original, node.range[0]);
  let nextIndent = adjustIndent(patcher.original, node.range[0], 1);
  patcher.insert(node.range[0], `do =>\n${nextIndent}${result} = []\n${thisIndent}`);
  indentNode(node, patcher);
  let lastStatement = node.body.statements[node.body.statements.length - 1];
  let lastStatementRange = trimmedNodeRange(lastStatement, patcher.original);
  patcher.insert(lastStatementRange[0], `${result}.push(`);
  patcher.insert(lastStatementRange[1], `)`);
  patcher.insert(trimmedNodeRange(node, patcher.original)[1], `\n${nextIndent}${result}`);

  return true;
}
