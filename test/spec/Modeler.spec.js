import { expect } from 'chai';

import Modeler from 'bpmn-js/lib/Modeler';

import TestContainer from 'mocha-test-container-support';

import {
  setBpmnJS,
  clearBpmnJS,
  enableLogging,
  insertBpmnStyles
} from '../TestHelper';

import CanvasLockModule from '../../lib';

import diagramXML from '../fixtures/simple.bpmn';


var singleStart = window.__env__ && window.__env__.SINGLE_START === 'modeler';


describe('Modeler', function() {

  var container;

  var modeler;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(insertBpmnStyles);

  function createModeler(xml) {

    clearBpmnJS();

    modeler = new Modeler({
      container: container,
      additionalModules: [
        CanvasLockModule
      ]
    });

    setBpmnJS(modeler);

    enableLogging(modeler, singleStart);

    return modeler.importXML(xml).then(function(result) {
      return { error: null, warnings: result.warnings, modeler: modeler };
    }).catch(function(err) {
      return { error: err, warnings: err.warnings, modeler: modeler };
    });
  }


  (singleStart ? it.only : it)('should import simple process', function() {
    return createModeler(diagramXML).then(function(result) {

      expect(result.error).not.to.exist;

      if (singleStart) {
        var canvasLock = modeler.get('canvasLock');

        var button = document.createElement('button');
        button.textContent = 'Toggle Lock';
        button.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 10; padding: 8px 16px; cursor: pointer;';

        button.addEventListener('click', function() {
          if (canvasLock.isLocked()) {
            canvasLock.unlock();
            button.textContent = 'Lock';
          } else {
            canvasLock.lock();
            button.textContent = 'Unlock';
          }
        });

        document.body.appendChild(button);
      }
    });
  });

});
