import CanvasLock from './CanvasLock';
import CanvasLockBehavior from './CanvasLockBehavior';

export default {
  __init__: [ 'canvasLock', 'canvasLockBehavior' ],
  canvasLock: [ 'type', CanvasLock ],
  canvasLockBehavior: [ 'type', CanvasLockBehavior ]
};
