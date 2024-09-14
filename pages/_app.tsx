import { AuthProvider } from '../src/contexts/AuthContext';
import Navbar from '../src/components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;