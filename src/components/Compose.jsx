import { Component } from 'react'

import { Endpoint } from '../decorators/Endpoint'
import { BasicPluginRenderer } from '../decorators/BasicPluginRenderer'
import { Map } from '../Map/index'

/**
* Compose a bunch of component in regard of their contexts.
*
* ````jsx
* <Compose name="endpoints.name">
*   ...
* </Compose>
* ````
*/
@BasicPluginRenderer
@Endpoint
export class Compose extends Component {
  renderPlugins (plugins) {
    if (plugins == null) {
      plugins = []
    }

    if (!Array.isArray(plugins)) {
      plugins = [plugins]
    }

    return this.compose(plugins)
  }

  compose (components) {
    let result = this.props.children || null

    for (let index = 1; index <= components.length; ++index) {
      result = components[components.length - index]({}, result)
    }

    return result
  }
}

Compose.defaultProps = {
  'map': Map.toComponentFactory
}
