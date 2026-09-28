import { useEffect } from 'react'

const SITE = "Og'abek Karimov"

// Browser tab title per page: "<page> — Og'abek Karimov", or the site default.
function useDocumentTitle(page) {
  useEffect(() => {
    document.title = page ? `${page} — ${SITE}` : `${SITE} — Frontend Developer`
  }, [page])
}

export default useDocumentTitle
