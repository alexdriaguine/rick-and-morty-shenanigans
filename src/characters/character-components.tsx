import * as React from 'react'

export const StatusIcon = (props: { status: 'Alive' | 'Dead' | 'Unknown' }) => {
  const iconMap: Record<'Alive' | 'Dead' | 'Unknown', string> = {
    Alive: '😀',
    Dead: '💀',
    Unknown: '❓',
  }

  const icon = iconMap[props.status] || iconMap['Unknown']
  return (
    <span role="img" aria-label="status-icon">
      {icon}
    </span>
  )
}
