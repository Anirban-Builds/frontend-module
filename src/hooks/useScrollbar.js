import { useEffect } from 'react'

const useScrollbar = (ref, delay = 1000) => {
  useEffect(() => {
    let timeout
    const el = ref.current
    if(!el) return
    const handleScroll = () => {
      el.classList.add('scrolling')
      clearTimeout(timeout)
      timeout = setTimeout(() => el.classList.remove('scrolling'), delay)
    };
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [delay])

  return ref
}

export default useScrollbar