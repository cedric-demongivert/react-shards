import React from 'react'
import { byDependencies } from './byDependencies'

/**
* Resolve the component composition order and return it.
*
* Configuration :
*  - **getDependencies** : function(element) => Array<String>, return dependencies of the element.
*  - **getServices** : function(element) => Array<String>, return services exposed by the element.
*
* @param {Object} configuration - Configuration of the sorter.
* @param {Array<any>} elements - Elements to sort.
*
* @return {Array<any>} Elements sorted in regard of their dependencies.
*/
export const byContextDependencies = (elements) => byDependencies(
  { getDependencies, getServices }, elements
)

function getServices (element) {
  let componentType = getType(element)
  let result = []

  if (componentType.childContextTypes) {
    for (let exposed in componentType.childContextTypes) {
      if (
        componentType.contextTypes == null ||
        !(exposed in componentType.contextTypes)
      ) {
        result.push(exposed)
      }
    }
  }

  return result
}

function getDependencies (element) {
  let result = []

  for (let key in getType(element).contextTypes) {
    result.push(key)
  }

  return result
}

function getType (element) {
  if (React.isValidElement(element)) {
    return element.type
  } else {
    return element().type
  }
}
