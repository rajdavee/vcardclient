'use client'

import { withAuth } from '../utils/withAuth';

function PremiumPlan() {
  return (
    <div>
      <h1>Premium Plan Dashboard</h1>
      {/* Add content specific to the premium plan */}
    </div>
  )
}

export default withAuth(PremiumPlan, 'Premium');