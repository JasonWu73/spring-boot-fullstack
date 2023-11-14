import React from 'react'

function useTitle(title: string) {
  React.useEffect(() => {
    const prevTitle = document.title

    title && (document.title = title)

    return () => {
      document.title = prevTitle
    }
  }, [title])
}

export { useTitle }
