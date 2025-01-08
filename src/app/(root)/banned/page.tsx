import Link from "next/link";

const BannedPage = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-center items-center min-h-screen w-full flex-col gap-4 text-center">
                <h5 className="font-medium text-black dark:text-white text-xl">
                    You are banned! This IP has been banned. If you think this was a mistake then
                    please <Link href="/blogs/how-do-i-contact-support">contact the support.</Link>
                </h5>
                <Link href="/" className="btn">
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default BannedPage;
