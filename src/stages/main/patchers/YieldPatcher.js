import NodePatcher from './../../../patchers/NodePatcher.js';
import type { Node, ParseContext, Editor } from './../../../patchers/types.js';

export default class YieldPatcher extends NodePatcher {
  expression: NodePatcher;
  
  constructor(node: Node, context: ParseContext, editor: Editor, expression: NodePatcher) {
    super(node, context, editor);
    this.expression = expression;
  }

  /**
   * 'yield' EXPRESSION
   */
  patchAsExpression({ needsParens=true }={}) {
    this.expression.patch({ needsParens });
    this.yields();
  }
}
