import {
  bootstrapBpmnJS,
  insertCSS
} from 'bpmn-js/test/helper/index.js';

import Modeler from 'bpmn-js/lib/Modeler.js';

import diagramCSS from 'bpmn-js/dist/assets/diagram-js.css';
import bpmnJSCSS from 'bpmn-js/dist/assets/bpmn-js.css';
import bpmnFontCSS from 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import canvasLockCSS from '../assets/canvas-lock.css';

export * from 'bpmn-js/test/helper/index.js';

export function bootstrapModeler(diagram, options, locals) {
  return bootstrapBpmnJS(Modeler, diagram, options, locals);
}

export function enableLogging(modeler, enabled) {
  if (!enabled) {
    return;
  }

  modeler.on('commandStack.changed', function() {
    modeler.saveXML({ format: true }).then(function(result) {
      console.log(result.xml);
    });
  });
}

export function insertBpmnStyles() {
  insertCSS('diagram.css', diagramCSS);

  insertCSS('bpmn-js.css', bpmnJSCSS);

  insertCSS('bpmn-font.css', bpmnFontCSS);

  insertCSS('canvas-lock.css', canvasLockCSS);
}
