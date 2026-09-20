import { memo } from "react";
import Hero from "../components/HomeComponents.tsx/Hero";



const Home = () => {

    return(
        <section>
            <Hero/>

        </section>
    )
}

export default memo(Home);