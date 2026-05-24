import Hero from '@/componentes/Hero';
import About from '@/componentes/About';
import GalleryPreview from '@/componentes/GalleryPreview';
import Carousel from '@/componentes/Carousel';
import ContactForm from '@/componentes/ContactForm';
import Footer from '@/componentes/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Carousel />      {/* Reemplaza a GalleryPreview */}
      <ContactForm />
      <Footer />
    </main>
  );
}