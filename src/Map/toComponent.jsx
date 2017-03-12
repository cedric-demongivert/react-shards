import React from 'react'

/**
* Transform each element into a component.
*
* Accept :
*  - **Raw component** : MyComponent
*  - **Created component** : <MyComponent />
*  - **Factory** : function (props, children) => element
*
* @param {Raw component|Created component|Factory} element - Element to transform.
*
* @return {element} a React element.
*/
export const toComponent = (Element) => {
  if (React.isValidElement(Element)) {
    return Element
  } else if (typeof Element === 'function') {
    try {
      return Element(null, null)
    } catch (e) {
      return (<Element />)
    }
  }
}
