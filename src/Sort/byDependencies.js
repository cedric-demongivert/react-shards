const STATUS_UNRESOLVED = 0
const STATUS_RESOLVING = 1
const STATUS_RESOLVED = 2

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
export function byDependencies ({getDependencies, getServices}, elements) {
  let result = []
  let status = elements.map(() => STATUS_UNRESOLVED)
  let services = getServiceMap(getServices, elements)

  for (let index in elements) {
    visit(index, {
      elements, status, services, result, getDependencies
    })
  }

  return result
}

/**
* Return an object with exposed services as key, and a list of
* element's index that expose these services as value.
*
* @param {Function} getServices - Return a list of services for a specific element.
* @param {Array<any>} elements - A list of elements.
*
* @return {Object} A service map.
*/
function getServiceMap (getServices, elements) {
  let result = {}

  for (let index in elements) {
    let element = elements[index]
    for (let exposed of getServices(element)) {
      if (exposed in result) {
        result[exposed].push(index)
      } else {
        result[exposed] = [index]
      }
    }
  }

  return result
}

/**
* Visit an element and sort it.
*
* **context** :
*  - _elements_ : List of elements to sort.
*  - _status_ : If elements are visited or not.
*  - _services_ : A service map.
*  - _result_ : Sorted array.
*  - _getDependencies_ : Return a list of dependencies for a specific element.
*
* @param {Number} index - Index of the element to visit.
* @param {Object} context - Context object.
*
* @return void
*/
function visit (index, context) {
  if (context.status[index] === STATUS_UNRESOLVED) {
    context.status[index] = STATUS_RESOLVING

    for (let dependency of context.getDependencies(
      context.elements[index], index, context.elements
    )) {
      if (dependency in context.services) {
        for (let providerIndex of context.services[dependency]) {
          visit(providerIndex, context)
        }
      }
    }

    context.status[index] = STATUS_RESOLVED
    context.result.push(context.elements[index])
  } else if (context.status[index] === STATUS_RESOLVING) {
    throw new Error(
      'Unable to sort elements : invalid dependency tree,',
      'have-you a circular dependency somewhere ?'
    )
  }
}

// getExposedServices (component) {
//   let componentType = this.getComponentType(component)
//   let result = []
//
//   if (componentType.childContextTypes) {
//     for (let exposed in componentType.childContextTypes) {
//       if (
//         componentType.contextTypes == null ||
//         !(exposed in componentType.contextTypes)
//       ) {
//         result.push(exposed)
//       }
//     }
//   }
//
//   if (result.length <= 0) {
//     result.push('none')
//   }
//
//   return result
// }
//
// getComponentType (component) {
//   component = this.props.mapper(component, {}, null)
//   return component.type
// }
//
// getDependencies (component) {
//   return this.getComponentType(component).contextTypes || {}
// }
