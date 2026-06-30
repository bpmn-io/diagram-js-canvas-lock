import {
  bootstrapModeler,
  inject,
  insertBpmnStyles
} from '../TestHelper';

import { expect } from 'chai';

import CanvasLockModule from '../../lib';

import diagramXML from '../fixtures/simple.bpmn';


describe('CanvasLockBehavior', function() {

  beforeEach(bootstrapModeler(diagramXML, {
    additionalModules: [
      CanvasLockModule
    ]
  }));

  beforeEach(insertBpmnStyles);


  describe('blocked interactions', function() {

    var BLOCKED_EVENTS = [
      'drag.init',
      'contextPad.open.allowed',
      'popupMenu.open.allowed',
      'directEditing.activate.allowed'
    ];

    BLOCKED_EVENTS.forEach(function(event) {

      it('should block <' + event + '> when locked', inject(
        function(canvasLock, eventBus) {

          // given
          canvasLock.lock();

          // when
          var result = eventBus.fire(event);

          // then
          expect(result).to.be.false;
        }
      ));


      it('should not block <' + event + '> when unlocked', inject(
        function(eventBus) {

          // when
          var result = eventBus.fire(event);

          // then
          expect(result).not.to.be.false;
        }
      ));

    });

  });


  describe('editor actions', function() {

    it('should block non-navigation editor actions when locked', inject(
      function(canvasLock, eventBus) {

        // given
        canvasLock.lock();

        // when
        var result = eventBus.fire('editorActions.allowed', { action: 'undo' });

        // then
        expect(result).to.be.false;
      }
    ));


    [ 'stepZoom', 'zoom', 'moveCanvas' ].forEach(function(action) {

      it('should allow <' + action + '> while locked', inject(
        function(canvasLock, eventBus) {

          // given
          canvasLock.lock();

          // when
          var result = eventBus.fire('editorActions.allowed', { action: action });

          // then
          expect(result).not.to.be.false;
        }
      ));

    });


    it('should not block editor actions when unlocked', inject(
      function(eventBus) {

        // when
        var result = eventBus.fire('editorActions.allowed', { action: 'undo' });

        // then
        expect(result).not.to.be.false;
      }
    ));

  });


  describe('on lock', function() {

    it('should close an open context pad', inject(
      function(canvasLock, contextPad, elementRegistry) {

        // given
        var element = elementRegistry.get('StartEvent_1');

        contextPad.open(element);

        // assume
        expect(contextPad.isOpen()).to.be.true;

        // when
        canvasLock.lock();

        // then
        expect(contextPad.isOpen()).to.be.false;
      }
    ));

  });


  describe('on unlock', function() {

    it('should restore the context pad for the current selection', inject(
      function(canvasLock, contextPad, selection, elementRegistry) {

        // given
        var element = elementRegistry.get('StartEvent_1');

        selection.select(element);

        canvasLock.lock();

        // assume
        expect(contextPad.isOpen()).to.be.false;

        // when
        canvasLock.unlock();

        // then
        expect(contextPad.isOpen()).to.be.true;
      }
    ));

  });

});
