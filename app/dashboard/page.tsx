'use client'

import { withAuth } from '../utils/withAuth';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Add content for the authenticated dashboard */}
    </div>
  )
}

export default withAuth(Dashboard, '');