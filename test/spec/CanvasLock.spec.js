import {
  bootstrapModeler,
  inject,
  insertBpmnStyles
} from '../TestHelper.js';

import { expect } from 'chai';

import CanvasLockModule from '../../lib/index.js';

import diagramXML from '../fixtures/simple.bpmn';


describe('CanvasLock', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    additionalModules: [
      CanvasLockModule
    ]
  }));

  beforeEach(insertBpmnStyles);


  it('should be unlocked by default', inject(function(canvasLock) {

    // then
    expect(canvasLock.isLocked()).to.be.false;
  }));


  it('should lock', inject(function(canvasLock) {

    // when
    canvasLock.lock();

    // then
    expect(canvasLock.isLocked()).to.be.true;
  }));


  it('should unlock', inject(function(canvasLock) {

    // given
    canvasLock.lock();

    // when
    canvasLock.unlock();

    // then
    expect(canvasLock.isLocked()).to.be.false;
  }));


  it('should be idempotent on lock', inject(function(canvasLock, eventBus) {

    // given
    canvasLock.lock();

    var callCount = 0;
    eventBus.on('canvasLock.changed', function() {
      callCount++;
    });

    // when
    canvasLock.lock();

    // then
    expect(callCount).to.equal(0);
  }));


  it('should be idempotent on unlock', inject(function(canvasLock, eventBus) {

    // given
    var callCount = 0;
    eventBus.on('canvasLock.changed', function() {
      callCount++;
    });

    // when
    canvasLock.unlock();

    // then
    expect(callCount).to.equal(0);
  }));


  it('should add CSS class on lock', inject(function(canvasLock, canvas) {

    // when
    canvasLock.lock();

    // then
    var container = canvas.getContainer();
    expect(container.classList.contains('djs-canvas-locked')).to.be.true;
  }));


  it('should remove CSS class on unlock', inject(function(canvasLock, canvas) {

    // given
    canvasLock.lock();

    // when
    canvasLock.unlock();

    // then
    var container = canvas.getContainer();
    expect(container.classList.contains('djs-canvas-locked')).to.be.false;
  }));


  it('should fire canvasLock.changed on lock', inject(function(canvasLock, eventBus) {

    // given
    var event;
    eventBus.on('canvasLock.changed', function(e) {
      event = e;
    });

    // when
    canvasLock.lock();

    // then
    expect(event).to.exist;
    expect(event.locked).to.be.true;
  }));


  it('should fire canvasLock.changed on unlock', inject(function(canvasLock, eventBus) {

    // given
    canvasLock.lock();

    var event;
    eventBus.on('canvasLock.changed', function(e) {
      event = e;
    });

    // when
    canvasLock.unlock();

    // then
    expect(event).to.exist;
    expect(event.locked).to.be.false;
  }));

});
