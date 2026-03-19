import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Accommodations from '../components/Accommodations/Accommodations';
import AboutUs from '../components/AboutUs/AboutUs';
import NearbyPlaces from '../components/NearbyPlaces/NearbyPlaces';
import Gallery from '../components/Gallery/Gallery';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <Header />
            <main>
                <Hero />
                <AboutUs />
                <Accommodations />
                <NearbyPlaces />
                <Gallery />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
