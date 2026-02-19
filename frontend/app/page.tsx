import { CareerGuide } from '@/components/career-guide'
import Hero from '@/components/hero'
import { ResumeAnalyzerPage } from '@/components/resume-analyzer'

import React from 'react'

const Home = () => {
  return (
    <div>
      <Hero/>
      <CareerGuide/>
      <ResumeAnalyzerPage/>

    </div>
  )
}

export default Home