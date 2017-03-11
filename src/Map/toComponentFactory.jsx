import React from 'react'

/**
* Transform each element into a component factory.
*
* You can call each factory with new properties and children, each factory will
* make / clone it's wrapped component and return a customized react element.
*
* Accept :
*  - **Raw component** : MyComponent
*  - **Created component** : <MyComponent />
*  - **Factory** : function (props, children) => element
*
* @param {Raw component|Created component|Factory} element - Element to transform.
*
* @return {Function} a factory that create this element.
*/
export const toComponentFactory = (Element) => {
  if (React.isValidElement(Element)) {
    return function (props, children) {
      return React.cloneElement(Element, props, children)
    }
  } else if (typeof Element === 'function') {
    try {
      Element(null, null)
      return Element
    } catch (e) {
      return function (props, children) {
        return (<Element {...props}>{children}</Element>)
      }
    }
  }
}
