import Link from "next/link";

const DeletePage = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-center items-center min-h-screen w-full flex-col gap-4 text-center">
                <h5 className="font-medium text-black dark:text-white text-xl">
                    Your account was deleted!
                </h5>
                <Link href="/" className="btn">
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default DeletePage;
