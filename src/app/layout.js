
import StartApolloClient from '../app/Customerdetails/apolloclient/Apolloclient'

export const metadata = {
  title: 'Customer Details',
  description: 'Hello Mentor Customer Details',
}

export default function RootLayout({ children }) {
  // Need to Add a Condition if local storage is empty it will show no error
  const Token = typeof localStorage !== 'undefined' ? localStorage.getItem('Auth') : null;
  return (
    <html lang="en">
      <body>
        <StartApolloClient accessToken={Token}>
        {children}
        </StartApolloClient>
        </body>
    </html>
  )
}
