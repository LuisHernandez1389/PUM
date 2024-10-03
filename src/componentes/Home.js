import Carrusel from "./Home/Carrrusel";
import CardsSection from "./Home/CardsSection";
import Banner from "./Home/Banner";
import CardVideo from "./Home/CardVideo";
import HPaquetes from "./Home/HPaquetes";
import MasVendido from "./Home/MasVendido";
import HbannerL from "./Home/HbanerL";

const Home = () => {
  return (
    <div style={styles.pageWrapper}>
    {/* Hero Section */}
    <Carrusel></Carrusel>
    {/* Cards Section */}
    <CardsSection></CardsSection>
    {/* Banner de Ventas Especiales */}
    <Banner></Banner>
    {/* Extra Card Section */}
    <CardVideo></CardVideo>
    {/* Mas Vendido */}
    <MasVendido></MasVendido>
    {/* HPaquetes */}
    <HPaquetes></HPaquetes>
    {/* Banner con logo */}
    <HbannerL></HbannerL>
    </div>
  );
};

// Estilos personalizados para darle un diseño más moderno y elegante
const styles = {
  pageWrapper: {
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#343a40',
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
  },
  cardImage: {
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
  },
  cardButton: {
    backgroundColor: '#ff4500',
    borderRadius: '30px',
  },
 
};



export default Home;
