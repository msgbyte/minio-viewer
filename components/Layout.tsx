import React from "react"

export const Layout = React.memo((props) => {
  return (
    <>
      {/* <Navbar /> */}
      <main>{props.children}</main>
      {/* <Footer /> */}
    </>
  )
})
Layout.displayName = 'Layout'
