/**
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 * @typedef {import('./CanvasLock').default} CanvasLock
 * @typedef {import('didi').Injector} Injector
 */

var VERY_HIGH_PRIORITY = 10000;

/**
 * Blocked interaction events.
 *
 * These are events that initiate user-driven interactions
 * but should be suppressed when the canvas lock is active.
 */
var BLOCKED_EVENTS = [

  // block any user-initiated drag, including move, create, connect, etc.
  'drag.init',

  // block any user-initiated open of context pad or popup menu
  'contextPad.open.allowed',
  'popupMenu.open.allowed',

  // block direct editing activation
  'directEditing.activate.allowed'
];

/**
 * Editor actions that are allowed while locked
 * because they only affect navigation, not diagram content.
 */
var ALLOWED_EDITOR_ACTIONS = [
  'stepZoom',
  'zoom',
  'moveCanvas'
];


/**
 * A behavior that blocks user-initiated interaction events
 * when the canvas lock is active.
 *
 * Navigation events (canvas.move, canvas.zoom) are explicitly
 * not blocked to allow pan/zoom while locked. Keyboard-triggered
 * navigation editor actions (stepZoom, zoom, moveCanvas) are also
 * allowed through.
 *
 * @param {EventBus} eventBus
 * @param {CanvasLock} canvasLock
 * @param {Injector} injector
 */
export default function CanvasLockBehavior(eventBus, canvasLock, injector) {

  BLOCKED_EVENTS.forEach(function(event) {
    eventBus.on(event, VERY_HIGH_PRIORITY, function(e) {
      if (canvasLock.isLocked()) {
        return false;
      }
    });
  });

  // block non-navigation editor actions when locked
  eventBus.on('editorActions.allowed', VERY_HIGH_PRIORITY, function(event) {
    if (canvasLock.isLocked() && !ALLOWED_EDITOR_ACTIONS.includes(event.action)) {
      return false;
    }
  });

  // close open overlays when locking; restore context pad on unlock
  eventBus.on('canvasLock.changed', function(event) {
    var contextPad = injector.get('contextPad', false);
    var directEditing = injector.get('directEditing', false);
    var dragging = injector.get('dragging', false);
    var popupMenu = injector.get('popupMenu', false);

    if (event.locked) {
      if (contextPad && contextPad.isOpen()) {
        contextPad.close();
      }

      if (directEditing && directEditing.isActive()) {
        directEditing.cancel();
      }

      if (dragging && dragging.context()) {
        dragging.cancel();
      }

      if (popupMenu && popupMenu.isOpen()) {
        popupMenu.close();
      }
    } else {

      // restore context pad for current selection
      var selection = injector.get('selection', false);

      if (contextPad && selection) {
        var selectedElements = selection.get();

        if (selectedElements.length) {
          contextPad.open(selectedElements.length === 1 ? selectedElements[0] : selectedElements);
        }
      }
    }
  });
}

CanvasLockBehavior.$inject = [ 'eventBus', 'canvasLock', 'injector' ];
