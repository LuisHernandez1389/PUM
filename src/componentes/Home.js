import Carrusel from "../Home/Carrrusel";
import CardsSection from "../Home/CardsSection";
import Banner from "../Home/Banner";
import CardVideo from "../Home/CardVideo";
import HPaquetes from "../Home/HPaquetes";
import MasVendido from "../Home/MasVendido";
import HbannerL from "../Home/HbanerL";
import '../estilos/Home.css';
import { useEffect } from "react";

const Home = () => {

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          } else {
            entry.target.classList.remove('show');
          }
        });
      },
      { threshold: 0.1 } // Elementos se animan cuando el 10% sea visible
    );

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);


  return (
    <div className="pageWrapper">
      <div className="hidden section">
    {/* Hero Section */}
    <Carrusel></Carrusel>
    </div>
    <div className="hidden section">
    {/* Cards Section */}
    <CardsSection></CardsSection>
    </div>
    <div className="hidden section">
    {/* Banner de Ventas Especiales */}
    <Banner></Banner>
    </div>
    <div className="hidden section">
    {/* Extra Card Section */}
    <CardVideo></CardVideo>
    </div>
    <div className="hidden section">
    {/* Mas Vendido */}
    <MasVendido></MasVendido>
    </div>
    <div className="hidden section">
    {/* HPaquetes */}
    <HPaquetes></HPaquetes>
    </div>
    <div className="hidden section">
    {/* Banner con logo */}
    <HbannerL></HbannerL>
    </div>
    </div>
  );
};


export default Home;
