import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} subway. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
