import logo from '../assets/logo.svg';
import './Home.css';

export default function Home() {
  return (
    <main className="home">
      <section className="banner">
        <img src={logo} alt="SafeHands logo" className="banner-logo" />
        <h1 className="banner-title">Welcome to SafeHands</h1>
        <p className="banner-text">Your trusted hands, always here to help.</p>
      </section>
    </main>
  );
}
