'use client'

import { withAuth } from '../utils/withAuth';

function ProPlan() {
    return (
      <div>
        <h1>Pro Plan Dashboard</h1>
        {/* Add content specific to the pro plan */}
      </div>
    )
}

export default withAuth(ProPlan, 'Pro');