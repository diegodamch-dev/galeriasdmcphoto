import Image from 'next/image';
import Link from 'next/link';

export default function GalleryPreview() {
  const images = [
  { src: '/images/landing/articles-611946_thumbnail.jpg', alt: 'Foto 1' },
  { src: '/images/landing/articles-612587_thumbnail.jpg', alt: 'Foto 2' },
  { src: '/images/landing/articles-612596_thumbnail.jpg', alt: 'Foto 3' },
  { src: '/images/landing/EMBUDO.jpg', alt: 'Foto 4' },
];

  return (
    <section className="gallery-preview" id="galeria-destacada">
      <div className="gallery-preview-container">
        <h2 className="gallery-preview-title">Galería destacada</h2>
        <p className="gallery-preview-subtitle">Una muestra de mi trabajo más reciente</p>
        <div className="gallery-preview-grid">
          {images.map((img, index) => (
            <div key={index} className="gallery-preview-card">
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={300}
                className="gallery-preview-image"
              />
              <div className="gallery-preview-overlay">
                <p className="gallery-preview-caption">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="gallery-preview-button-wrapper">
          <Link href="/galeria" className="btn btn-outline">
            Ver todas las fotos
          </Link>
        </div>
      </div>
    </section>
  );
}