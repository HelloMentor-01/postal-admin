
import StartApolloClient from '../app/Customerdetails/apolloclient/Apolloclient'

export const metadata = {
  title: 'Customer Details',
  description: 'Hello Mentor Customer Details',
}

export default function RootLayout({ children }) {
  const Token = process.env.TOKEN
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
