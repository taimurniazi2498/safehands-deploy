import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';

const About = lazy(() => import('./pages/About'));
const Quote = lazy(() => import('./pages/Quote'));

export default function App() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<p role="status">Loading...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/quote" element={<Quote />} />
        </Routes>
      </Suspense>
    </>
  );
}