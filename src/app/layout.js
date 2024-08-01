
'use client'
import StartApolloClient from '../app/Customerdetails/apolloclient/Apolloclient'
import 'bootstrap/dist/css/bootstrap.min.css';




export default function RootLayout({ children }) {
  // Need to Add a Condition if local storage is empty it will show no error
  const Token = typeof window !== 'undefined' ? localStorage.getItem('Auth') : null;
  const  Session = typeof window !== 'undefined' ? localStorage.getItem('session') : null;

  return (
    <html lang="en">
     <head>
    <title>hellomentor</title>
    <link
  rel="icon"
  href="/favicon.ico"
  type="image/png"
 sizes="any"
/>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <body>
        <StartApolloClient accessToken={Token} sessionId={Session} >
        {children}
        </StartApolloClient>
        </body>
    </html>
  )
}
