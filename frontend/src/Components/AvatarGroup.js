import React from 'react'
import PropTypes from 'prop-types'

const AvatarGroup = (props = {}) => {
  return (
    <div>
      {this.props.children}
    </div>
  )
}

AvatarGroup.defaultProps = {
  children: []
}

AvatarGroup.propTypes = {
  children: PropTypes.array,
}

export default AvatarGroup
