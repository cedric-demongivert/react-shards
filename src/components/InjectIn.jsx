import React, { Component } from 'react'

export class InjectIn extends Component {
  render () { return this.props.children }
}

InjectIn.defaultProps = {
  'inject': 'all'
}

InjectIn.propTypes = {
  'children': React.PropTypes.element.isRequired,
  'inject': React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.oneOf(['all'])
  ])
}
