import React from 'react'

/**
* @type A plugin store like service / component.
*/
export const PluginStoreType = React.PropTypes.shape({
  /**
  * Allow to plug arbitrary values into an endpoint.
  *
  * ````es6
  * pluginStore.push('path.to.the.endpoint', 1, 2, 3)
  * pluginStore.push(['path', 'to', 'the', 'endpoint'], ...values)
  * ````
  *
  * @param {String|Array<String>} endpoint - Where we have to push values.
  * @param {any} ...values - Values to push into the endpoint.
  *
  * @return {PluginStoreType} This store.
  */
  'push': React.PropTypes.func.isRequired,

  /**
  * Allow to remove plugged values from an endpoint.
  *
  * ````es6
  * pluginStore.delete('path.to.the.endpoint', 1, 2)
  * pluginStore.delete(['path', 'to', 'the', 'endpoint'])
  * ````
  *
  * @param {String|Array<String>} endpoint - Where we have to remove values.
  * @param {any} [...values = undefined] - Values to remove, if no value are passed, this method will remove all values attached to the endpoint.
  *
  * @return {PluginStoreType} This store.
  */
  'delete': React.PropTypes.func.isRequired,

  /**
  * Allow to remove plugged values from an endpoint that not fullfill a predicate.
  *
  * ````es6
  * pluginStore.filter('path.to.the.endpoint', (element) => element > 2)
  * pluginStore.filter(['path', 'to', 'the', 'endpoint'], (element) => element > 2)
  * ````
  *
  * @param {String|Array<String>} endpoint - Where we have to filter values.
  * @param {Function} predicate - Predicate to fullfill.
  *
  * @return {PluginStoreType} This store.
  */
  'filter': React.PropTypes.func.isRequired,

  /**
  * Return the value of an endpoint.
  *
  * ````es6
  * pluginStore.get('path.to.the.endpoint')
  * pluginStore.get(['path', 'to', 'the', 'endpoint'])
  * ````
  *
  * @param {String|Array<String>} endpoint - Endpoint to fetch.
  *
  * @return {any} Values pluged into the endpoint or null if the value do not exists.
  */
  'get': React.PropTypes.func.isRequired,

  /**
  * Replace or set the value of an endpoint.
  *
  * ````es6
  * pluginStore.set('path.to.the.endpoint', 5)
  * pluginStore.set(['path', 'to', 'the', 'endpoint'], "something")
  * ````
  *
  * @param {String} endpoint - Where we have to set values.
  * @param {any} [value = undefined] - Value to set. A null-like value will delete the node if necessary.
  *
  * @return {PluginStoreType} This store.
  */
  'set': React.PropTypes.func.isRequired,

  /**
  * @param {String|Array<String>} [endpoint = undefined] - Parent endpoint, if this attribute is null, this method will use the root endpoint.
  *
  * ````es6
  * pluginStore.endpoints()
  * pluginStore.endpoints('path.to.the.endpoint')
  * pluginStore.endpoints(['path', 'to', 'the', 'endpoint'])
  * ````
  *
  * @return {Array<String>} A list of sub-endpoint that have registered values.
  */
  'endpoints': React.PropTypes.func.isRequired,

  /**
  * @param {String|Array<String>} endpoint - Endpoint to fetch.
  *
  * ````es6
  * pluginStore.has('path.to.the.endpoint')
  * pluginStore.has(['path', 'to', 'the', 'endpoint'])
  * ````
  *
  * @return {Boolean} True if the endpoint has registered values.
  */
  'has': React.PropTypes.func.isRequired,

  /**
  * Clear the store of its endpoint, or an endpoint of its sub-endpoints.
  *
  * ````es6
  * pluginStore.clear()
  * pluginStore.clear('path.to.the.endpoint')
  * pluginStore.clear(['path', 'to', 'the', 'endpoint'])
  * ````
  *
  * @param {String|Array<String>} [endpoint=undefined] - Endpoint to clear, if empty, this method will clear the entire store.
  *
  * @return {PluginStoreType} This store.
  */
  'clear': React.PropTypes.func.isRequired,

  /**
  * Ignore eventual sub-store.
  *
  * @return {PluginStoreType} A store with absolute scope.
  */
  'absolute': React.PropTypes.func.isRequired
})
