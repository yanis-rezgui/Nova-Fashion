import { memo } from "react";
import Hero from "../components/HomeComponents.tsx/Hero";

import CategoriesSection from "../components/HomeComponents.tsx/CategoriesSection";
import Nouveautes from "../components/HomeComponents.tsx/Nouveautes";
import Promotions from "../components/HomeComponents.tsx/Promotions";
import Histoire from "../components/HomeComponents.tsx/Histoire";
import Pourquoi from "../components/HomeComponents.tsx/Pourquoi";
import Avis from "../components/HomeComponents.tsx/Avis";
import Collection from "../components/HomeComponents.tsx/Collection";
import Etapes from "../components/HomeComponents.tsx/Etapes";
import Contact from "../components/HomeComponents.tsx/Contact";
import Faq from "../components/HomeComponents.tsx/Faq";



const Home = () => {

    return(
        <section>
            <Hero/>
            <CategoriesSection/>
            <Nouveautes/>
            <Promotions/>
            <Collection/>
            <Pourquoi/>
            <Avis/>
            <Etapes/>
            <Contact/>
            <Faq/>
            <Histoire/>
        </section>
    )
}

export default memo(Home);