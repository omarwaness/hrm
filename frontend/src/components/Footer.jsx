import React from 'react'

function Footer() {
  return (
    <footer className="mt-16 text-center text-muted-foreground">
    <p className="mb-2">Want to see our team? Click  <a href="/about">here</a> < b className="text-primary hover:underline">About Us.</b></p>
    <p>&copy; {new Date().getFullYear()} JN Team. All rights reserved.</p>
  </footer>
  )
}

export default Footer