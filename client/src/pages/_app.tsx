// pages/_app.tsx

import _app from '@/pages/_app';
// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Toast from '@/components/common/feedback/Toast';
import React from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import Head from 'next/head';
import Layout from '../components/Layout';
import { ThemeProvider } from '../context/ThemeContext';
import { UserProvider } from '../context/UserContext';
import { LoadingProvider } from '../context/LoadingContext';
import ErrorBoundary from '../components/ErrorBoundary';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
    },
  },
});

// Meta information for SEO
const defaultMeta = {
  title: 'Resume Builder - Create Professional Resumes',
  description: 'Create professional resumes easily with our resume builder. Choose from multiple templates and customize your resume in minutes.',
  keywords: 'resume builder, cv maker, professional resume, job application',
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [mounted, setMounted] = React.useState(false);

  // After mounting, we have access to the theme
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <ThemeProvider>
            <UserProvider>
              <LoadingProvider>
                <Head>
                  <title>{defaultMeta.title}</title>
                  <meta name="description" content={defaultMeta.description} />
                  <meta name="keywords" content={defaultMeta.keywords} />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <link rel="icon" href="/favicon.ico" />
                  
                  {/* PWA primary color */}
                  <meta name="theme-color" content="#000000" />
                  
                  {/* Open Graph / Facebook */}
                  <meta property="og:type" content="website" />
                  <meta property="og:title" content={defaultMeta.title} />
                  <meta property="og:description" content={defaultMeta.description} />
                  <meta property="og:image" content="/og-image.png" />
                  
                  {/* Twitter */}
                  <meta property="twitter:card" content="summary_large_image" />
                  <meta property="twitter:title" content={defaultMeta.title} />
                  <meta property="twitter:description" content={defaultMeta.description} />
                  <meta property="twitter:image" content="/twitter-image.png" />
                </Head>

                {mounted && (
                  <Layout>
                    <Component {...pageProps} />
                    
                    {/* Toast Container for notifications */}
                    <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                    />

                    {/* Version and last updated info */}
                    <div className="fixed bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-75 rounded px-2 py-1">
                      <p>Version: 1.0.0</p>
                      <p>Last updated by Vishalsnw at 2025-06-07 20:11:54</p>
                    </div>
                  </Layout>
                )}
              </LoadingProvider>
            </UserProvider>
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// API middleware configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Initialize performance monitoring
  if (typeof window !== 'undefined') {
    // Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
}

export default MyApp;
