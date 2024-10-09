'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HomePage from './home/page'


export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HomePage/>
    </div>
  )
}