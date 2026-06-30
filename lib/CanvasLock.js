/**
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 * @typedef {import('diagram-js/lib/core/Canvas').default} Canvas
 */

/**
 * A service that allows to temporarily lock user interactions
 * while still allowing programmatic changes via modeling APIs.
 *
 * Pan/zoom (navigation) remains enabled even while locked.
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 */
export default function CanvasLock(eventBus, canvas) {
  this._eventBus = eventBus;
  this._canvas = canvas;
  this._locked = false;
}

CanvasLock.$inject = [ 'eventBus', 'canvas' ];

/**
 * Lock user interactions.
 */
CanvasLock.prototype.lock = function() {
  if (this._locked) {
    return;
  }

  this._locked = true;

  var container = this._canvas.getContainer();
  container.classList.add('djs-canvas-locked');

  this._eventBus.fire('canvasLock.changed', { locked: true });
};

/**
 * Unlock user interactions.
 */
CanvasLock.prototype.unlock = function() {
  if (!this._locked) {
    return;
  }

  this._locked = false;

  var container = this._canvas.getContainer();
  container.classList.remove('djs-canvas-locked');

  this._eventBus.fire('canvasLock.changed', { locked: false });
};

/**
 * Check whether interactions are currently locked.
 *
 * @return {boolean}
 */
CanvasLock.prototype.isLocked = function() {
  return this._locked;
};
