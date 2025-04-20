import ClientSessionProvider from '../components/ClientSessionProvider';  // Import the Client-side wrapper
import HomePage from '../components/HomePage';  

export default function Page() {
  return (
    <ClientSessionProvider>
      <HomePage />
    </ClientSessionProvider>
  );
}
