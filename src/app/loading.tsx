const Loading = () => {
    return (
        <div className="relative z-50 h-screen w-screen inset-0 flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-borderlight dark:border-border"></div>
        </div>
    );
};

export default Loading;
