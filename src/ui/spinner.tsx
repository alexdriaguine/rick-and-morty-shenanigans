import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const Spinner = styled.div<{
  width?: number
  height?: number
  color?: string
  borderWidth?: number
}>`
  width: ${(props) => `${props.width}px;`};
  height: ${(props) => `${props.height}px;`};
  border-top-color: ${(props) => `${props.color}`};
  border-left-color: ${(props) => `${props.color}`};
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-style: solid;
  border-width: ${(props) => `${props.borderWidth}px;`};
  border-radius: 50%;
  animation: ${spin} 400ms linear infinite;
`

Spinner.defaultProps = {
  width: 24,
  height: 24,
  color: 'tomato',
  borderWidth: 2,
}
