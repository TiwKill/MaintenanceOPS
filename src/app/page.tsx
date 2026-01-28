import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Technology from '@/components/landing/technology';
import Showcase from '@/components/landing/showcase';
import Ecosystem from '@/components/landing/ecosystem';
import CTA from '@/components/landing/cta';
import Footer from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="technology">
        <Technology />
      </div>
      <div id="showcase">
        <Showcase />
      </div>
      <Ecosystem />
      <CTA />
      <Footer />
    </main>
  );
}
