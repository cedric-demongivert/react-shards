import React, { Component } from 'react'

export class InjectSlot extends Component {
  render () { return null }
}

InjectSlot.defaultProps = {
  'inject': 'all'
}

InjectSlot.propTypes = {
  'inject': React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.oneOf(['all'])
  ])
}
