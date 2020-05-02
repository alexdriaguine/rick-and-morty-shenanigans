import React from 'react'

export const useIntersection = (): [
  boolean,
  React.RefObject<HTMLDivElement>,
] => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [intersecting, setIntersecting] = React.useState(false)
  const [observer] = React.useState(() => {
    return new IntersectionObserver(
      (entries) => {
        const [e] = entries
        setIntersecting(e.isIntersecting)
      },
      {
        threshold: 1,
        root: null,
        rootMargin: '0px',
      },
    )
  })

  React.useEffect(() => {
    const node = ref.current
    node && observer.observe(node)
    return () => {
      node && observer.unobserve(node)
    }
  })

  return [intersecting, ref]
}
