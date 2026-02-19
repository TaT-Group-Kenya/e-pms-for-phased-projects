import React, { useEffect } from 'react'
import type { NextPage } from 'next'
import Layout from '../../components/dashboard/Layout'
import { useRouter } from 'next/router'
import { useAppSelector } from '../../store/hooks'

const Dashboard: NextPage = () => {
  const router = useRouter()
  const accessToken = useAppSelector((s) => s.auth.accessToken)

  useEffect(() => {
    if (!accessToken) {
      void router.replace('/sign-in')
    }
  }, [accessToken, router])

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-card dark:bg-primary-dark p-6 rounded-lg shadow"> 
          <h3 className="text-xl font-semibold mb-4">Overview</h3>
          <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded">{/* mock chart area */}</div>
        </div>

        <div className="bg-card dark:bg-primary-dark p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Quick stats</h3>
          <ul className="space-y-3">
            <li className="flex justify-between"><span>Active projects</span><strong>12</strong></li>
            <li className="flex justify-between"><span>Open invoices</span><strong>8</strong></li>
            <li className="flex justify-between"><span>Overdue</span><strong>1</strong></li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
