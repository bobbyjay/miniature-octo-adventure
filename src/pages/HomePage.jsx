import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <h1>Welcome to Your App</h1>
        <p>Discover events, place bets, and manage your account easily.</p>
      </section>
    </>
  );
}