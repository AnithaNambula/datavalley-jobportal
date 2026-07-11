import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './globals.css';

export const metadata = {
  title: 'CareerWave | Modern Job Portal',
  description: 'Find your dream job or hire the best talents in the industry.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}
