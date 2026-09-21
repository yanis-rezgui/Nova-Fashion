import HeroSlider from "./HeroComponents/HeroSlide"
import SecondHeroCards from "./HeroComponents/SecondHeroCards";


const Hero = () => {

    return(
        <section className="w-full flex flex-col justify-center items-center bg-gray-100 py-15">
        
                {/* INTRO HERO */}
    <div className="flex flex-col items-center text-center gap-2 mb-8 px-4">
        <p className="text-[#B89B72] text-[15px] font-semibold tracking-[0.25em] uppercase">
            Nova Fashion
        </p>

        <h1 className="text-[#171717] text-[2.2rem] font-bold">
            Votre style, votre signature.
        </h1>

        <p className="text-gray-500 text-[15px] max-w-[550px]">
            Découvrez une sélection de vêtements pensée pour allier
            style, confort et simplicité.
        </p>
    </div>

            <div className="flex flex-row items-center gap-5  max-[1000px]:flex-col
            
            ">
            <HeroSlider/>
            <SecondHeroCards/>
            </div>
        </section>
    )
}

export default Hero;


