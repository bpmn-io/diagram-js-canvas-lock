# diagram-js-canvas-lock

[![CI](https://github.com/bpmn-io/diagram-js-canvas-lock/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/diagram-js-canvas-lock/actions/workflows/CI.yml)

This module extends [diagram-js](https://github.com/bpmn-io/diagram-js)-based editors with a canvas lock feature.

## Features

* lock and unlock canvas programmatically

## Installation

Install via npm:

```sh
npm install diagram-js-canvas-lock
```

## Usage

Use as an extension for [bpmn-js](https://github.com/bpmn-io/bpmn-js):

```javascript
import CanvasLockModule from 'diagram-js-canvas-lock';

const modeler = new BpmnModeler({
  additionalModules: [
    CanvasLockModule
  ]
});
```

Lock and unlock the canvas through the `canvasLock` service:

```javascript
const canvasLock = modeler.get('canvasLock');

canvasLock.lock();

canvasLock.isLocked(); // true

canvasLock.unlock();
```

## Integrating with diagram-js-canvas-lock

By design, this module has no knowledge of the other diagram-js plugins running
alongside it. Instead it exposes a small, stable contract that any plugin can
integrate with. If your plugin adds interactive UI (pads, overlays, menus, ...),
respect the lock through one or more of the following.

### 1. Query the lock state (pull)

Guard your own entry points with `canvasLock.isLocked()`:

```javascript
MyPad.prototype.canOpen = function(target) {
  if (this._canvasLock.isLocked()) {
    return false;
  }

  // ...
};
```

`canvasLock` is an optional dependency – resolve it via the injector so your
plugin keeps working in editors without canvas lock:

```javascript
function MyPad(injector) {
  this._canvasLock = injector.get('canvasLock', false);
}

MyPad.prototype.isLocked = function() {
  return this._canvasLock && this._canvasLock.isLocked();
};

MyPad.$inject = [ 'injector' ];
```

### 2. React to lock changes (push)

Subscribe to the `canvasLock.changed` event to tear down or restore UI when the
lock is toggled:

```javascript
eventBus.on('canvasLock.changed', function(event) {
  if (event.locked) {
    myPad.close();
  }
});
```

### 3. Make an interaction vetoable (`*.allowed` convention)

Following the diagram-js convention, fire an `<x>.allowed` event before opening
and bail if any listener returns `false`. Canvas lock (and other features) can
then veto the interaction without knowing about your plugin:

```javascript
MyPad.prototype.open = function(target) {
  if (this._eventBus.fire('myPad.open.allowed', { target: target }) === false) {
    return;
  }

  // ...
};
```

### 4. Style locked state (CSS hook)

While locked, the canvas container carries the `djs-canvas-locked` class. Use it
to hide or dim plugin UI purely visually:

```css
.djs-canvas-locked .my-pad {
  display: none;
}
```

### Public contract summary

| Surface | Type | Description |
| --- | --- | --- |
| `canvasLock.lock()` / `unlock()` | API | Toggle the lock. |
| `canvasLock.isLocked()` | API | Query the current lock state. |
| `canvasLock.changed` | Event | Fired with `{ locked }` whenever the lock toggles. |
| `djs-canvas-locked` | CSS class | Added to the canvas container while locked. |

## Development

```sh
npm install

npm start
```


## License

MIT