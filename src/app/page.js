import Banner from "@/components/pages/home/Bannar";
import CommunityHighlights from "@/components/pages/home/CommunityHighlights";
import FeaturedOpportunities from "@/components/pages/home/FeaturedOpportunities";
import FeaturedStartUps from "@/components/pages/home/FeaturedStartUps";
import WhyJoin from "@/components/pages/home/WhyJoin";


const HomePage = () => (
    <main>
        <Banner />
        <FeaturedStartUps />
        <FeaturedOpportunities />
        <WhyJoin />
        <CommunityHighlights />
    </main>
);

export default HomePage;