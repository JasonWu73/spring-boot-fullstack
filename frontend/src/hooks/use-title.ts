import React from 'react'

function usePageTitle(title: string) {
  React.useEffect(() => {
    const prevTitle = document.title

    if (title) {
      document.title = title
    }

    return () => {
      document.title = prevTitle
    }
  }, [title])
}

export { usePageTitle }
