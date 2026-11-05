import SEO from '../components/SEO/Seo.jsx';
import Hero from '../components/landingpage/jsx/Hero.jsx';
import Categories from '../components/landingpage/jsx/Categories.jsx';
import Products from '../components/landingpage/jsx/Products.jsx';
import WhyChooseUs from '../components/landingpage/jsx/WhyChooseUs.jsx';

function Home() {
  return (
    <>
      <SEO
        title="Authentic Street Footwear in Nairobi"
        description="Shop authentic sneakers, Timberland boots, and office shoes in Nairobi. Real brands, real sizes, M-Pesa checkout, and same-day delivery. Step into the culture with Drip Mtaani."
        keywords="shoes Nairobi, authentic sneakers Kenya, Timberland boots Nairobi, office shoes Kenya, buy shoes online Nairobi, same day shoe delivery Nairobi"
      />
      <Hero />
      <Categories />
      <Products variant="light" />
      <WhyChooseUs />
    </>
  );
}

export default Home;