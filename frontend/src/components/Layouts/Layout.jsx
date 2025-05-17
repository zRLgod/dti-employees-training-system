import React from 'react'
import Header from './Header'
import NavBar from './NavBar'
import Footer from './Footer'


export default function Layout({children}) {
  return (
    <div className="relative min-h-screen">
      {/* header */}
      <Header className="fixed top-0 left-0 right-0 z-20 bg-white shadow"/>

      {/* sidebar */}
      <aside className="fixed top-[80px] bottom-[60px] left-0 w-64 bg-gray-100 h-full">
        <NavBar />
      </aside>

      {/* main content */}
      <div className="ml-64 pt-[100px] pb-[60px] px-6 overflow-auto">
          {children}
      </div>

      {/* footer */}
      <Footer className="fixed bottom-0 left-0 right-0 z-20 bg-white shadow"/>
    </div>
  )
}
