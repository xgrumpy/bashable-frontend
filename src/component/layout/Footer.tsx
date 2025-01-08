import Link from "next/link";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="px-4 md:px-8">
                <div className="inner flex justify-center lg:justify-between flex-wrap lg:flex-nowrap gap-x-8 gap-y-4 py-6">
                    <p className="flex justify-center lg:justify-start w-full text-center gap-x-10 flex-wrap">
                        <Link
                            href="/"
                            className="text-black dark:text-white hover:text-primary transition-all duration-200 font-bold"
                        >
                            Bashable.art
                        </Link>
                        <Link
                            href="/blogs/welcome-to-bashable.art"
                            className="text-black dark:text-white hover:text-primary transition-all duration-200"
                        >
                            About
                        </Link>
                        <Link
                            href="/blogs/how-do-i-contact-support"
                            className="text-black dark:text-white hover:text-primary transition-all duration-200"
                        >
                            Support
                        </Link>
                        <Link
                            href="/terms-conditions"
                            className="text-black dark:text-white hover:text-primary transition-all duration-200"
                        >
                            Terms & Conditions
                        </Link>
                    </p>
                    <p className="text-center lg:text-right w-full text-bodylight dark:text-body">
                        &copy; 2023 Bashable.art, All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
