import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Imágenes de ejemplo para el carrusel
const exampleImages = [
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Gestión de Activos de TI</span>
          <span className="block text-indigo-600">Simplificada</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-xl text-gray-500 md:max-w-3xl">
          Controla, optimiza y asegura el ciclo de vida de tus activos
          tecnológicos con nuestra solución integral.
        </p>
        <ImageCarousel images={exampleImages} />
      </main>
      <Footer />
    </div>
  );
};

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          ITAM
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} IT Asset Management. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
};

// Componente del carrusel de imágenes
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Inicia un temporizador que se ejecuta cada 5 segundos
    const timer = setInterval(() => {
      // Llama a la función para pasar a la siguiente imagen
      goToNext();
    }, 5000); // 5000 milisegundos

    // Limpia el temporizador cuando el componente se desmonta
    // para evitar fugas de memoria.
    return () => clearInterval(timer);
  }, [currentIndex]); // El efecto se reinicia cada vez que cambia la imagen

  if (!images || images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="relative mx-auto mt-12 max-w-3xl">
      <div className="overflow-hidden rounded-lg shadow-xl">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full"
        />
      </div>
      <button
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};
