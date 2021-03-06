import React, { Component } from 'react'

import { Endpoint } from '../decorators/Endpoint'

@Endpoint
export class Namespace extends Component {
  render () {
    return this.props.children || null
  }
}

Namespace.propTypes = {
  'children': React.PropTypes.element
}
