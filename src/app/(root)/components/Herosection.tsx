import HerosectionButtons from "./HerosectionButtons";
import HerosectionImage from "./HerosectionImage";

const Herosection = () => {
    return (
        <div className="herosection w-screen relative">
            <HerosectionImage />
            <div className="min-h-screen  py-32 md:py-40 lg:py-[250px] max-w-7xl mx-auto relative z-10 flex justify-center items-center">
                <div className="text-center max-w-5xl mx-auto px-0 md:px-8">
                    <span className="text-secondary block text-xl font-semibold tracking-widest mb-5"></span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] md:leading-[1.1] font-bold text-gradient mb-4">
                        Generate AI art <br className="hidden md:block"></br>
                        more affordably<br className="hidden md:block"></br>{" "}
                        than anywhere else.{" "}
                    </h1>
                    <h5 className="block text-lg md:text-xl lg:text-2xl text-bodylight dark:text-body">
                        No recurring subscription fees. Your credits never
                        expire.<br className="hidden md:block"></br>
                        Cheaper than buying a GPU or renting a cloud GPU.
                        <br className="hidden md:block"></br>
                        Don’t pay for idle time. Only pay for the processing
                        time you use.
                        <br className="hidden md:block"></br>
                        Earn credits by sharing your creations and recieving
                        tips.
                    </h5>
                    <HerosectionButtons />
                </div>
            </div>
        </div>
    );
};

export default Herosection;
