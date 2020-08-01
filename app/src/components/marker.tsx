/* eslint-disable react/require-default-props */
import React from 'react'

// eslint-disable-next-line react/no-unused-prop-types
const Marker = ({ color, name }: { lat?: number; lng?: number; name: string; color?: string }) => {
  return <div className={`marker marker-${color ?? 'grey'}`}>{name}</div>
}

export default Marker
