import {
  bootstrapBpmnJS,
  insertCSS
} from 'bpmn-js/test/helper';

import Modeler from 'bpmn-js/lib/Modeler';

export * from 'bpmn-js/test/helper';

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
  insertCSS(
    'diagram.css',
    require('bpmn-js/dist/assets/diagram-js.css').default
  );

  insertCSS(
    'bpmn-js.css',
    require('bpmn-js/dist/assets/bpmn-js.css').default
  );

  insertCSS(
    'bpmn-font.css',
    require('bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css').default
  );

  insertCSS(
    'canvas-lock.css',
    require('../assets/canvas-lock.css').default
  );
}
