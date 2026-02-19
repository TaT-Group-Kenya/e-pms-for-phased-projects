import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const router = useRouter()
  useEffect(() => void router.replace('/sign-in'), [router])
  return null
}

export default Home
