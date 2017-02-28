import React from 'react'

/**
* @type A plugin store like service / component.
*/
export const PluginStoreType = React.PropTypes.shape({
  /**
  * Allow to plug arbitrary values into an endpoint.
  *
  * @param {String} endpoint - Where we have to plug values.
  * @param {any} ...values - Values to plug into the endpoint.
  */
  'plugin': React.PropTypes.func.isRequired,

  /**
  * Allow to remove plugged values from an endpoint.
  *
  * @param {String} endpoint - Where we have to remove values.
  * @param {any} ...values - Values to remove.
  */
  'plugout': React.PropTypes.func.isRequired,

  /**
  * Allow to remove plugged values from an endpoint that not fullfill a predicate.
  *
  * @param {String} endpoint - Where we have to filter values.
  * @param {Function} predicate - Predicate to fullfill.
  */
  'filter': React.PropTypes.func.isRequired,

  /**
  * Allow to remove all plugged values from an endpoint.
  *
  * @param {String} endpoint - Where we have to filter values.
  */
  'clear': React.PropTypes.func.isRequired,

  /**
  * @param {String} endpoint - Endpoint to fetch.
  *
  * @return {Array<any>} Values pluged into the endpoint.
  */
  'get': React.PropTypes.func.isRequired,

  /**
  * @return {Array<String>} A list of endpoints that have registered values.
  */
  'getEndpoints': React.PropTypes.func.isRequired,

  /**
  * @param {String} endpoint - Endpoint to fetch.
  *
  * @return {Boolean} True if the endpoint has registered values.
  */
  'hasEndpoint': React.PropTypes.func.isRequired,

  /**
  * Same methods than before, but ignore namespaces.
  */
  'absolute': React.PropTypes.shape({
    'plugin': React.PropTypes.func.isRequired,
    'plugout': React.PropTypes.func.isRequired,
    'filter': React.PropTypes.func.isRequired,
    'clear': React.PropTypes.func.isRequired,
    'get': React.PropTypes.func.isRequired,
    'endpoints': React.PropTypes.func.isRequired,
    'hasEndpoint': React.PropTypes.func.isRequired
  }).isRequired
})
