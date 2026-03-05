import React from 'react'

export default function About({ profileImg }) {
  return (
    <section id="about" className="mt-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={profileImg}
              alt="subway"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-600 border-2 border-white rounded-full animate-pulse"
            aria-label="Available"
          ></span>
        </div>
        <div>
          <h1 className="text-base font-medium text-gray-900">subway</h1>
          <p className="text-xs text-gray-500">Design Engineer</p>
        </div>
      </div>
      <p className="text-[15px] text-gray-600 text-pretty">
        I'm a design engineer focused on building tools and experiences that make a difference. 
        I've been shipping software for years and have founded multiple companies — all acquired.
      </p>
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="tabular-nums">00:00</span>
            <span className="text-gray-400">UTC</span>
          </div>
          <span className="text-gray-200">·</span>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"></path>
            </svg>
            <span className="tabular-nums">10,000</span>
            <span className="text-gray-400">steps</span>
          </div>
        </div>
      </div>
    </section>
  )
}
