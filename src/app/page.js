import Banner from "@/components/pages/home/Bannar";
import FeaturedOpportunities from "@/components/pages/home/FeaturedOpportunities";
import FeaturedStartUps from "@/components/pages/home/FeaturedStartUps";
import WhyJoin from "@/components/pages/home/WhyJoin";


const HomePage = () => (
    <main>
        <Banner />
        <FeaturedStartUps />
        <FeaturedOpportunities />
        <WhyJoin />
    </main>
);

export default HomePage;