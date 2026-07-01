import CanvasLock from './CanvasLock.js';
import CanvasLockBehavior from './CanvasLockBehavior.js';

/**
 * @type { import('didi').ModuleDeclaration }
 */
export default {
  __init__: [ 'canvasLock', 'canvasLockBehavior' ],
  canvasLock: [ 'type', CanvasLock ],
  canvasLockBehavior: [ 'type', CanvasLockBehavior ]
};
