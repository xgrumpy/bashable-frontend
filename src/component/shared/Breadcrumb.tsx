interface IBreadcrumbProps {
  title: string;
}

const Breadcrumb = ({ title }: IBreadcrumbProps) => {
  return (
    <div className="breadcrumb bg-gradient-to-tr from-primary to-secondary relative">
      <span className="overlay absolute inset-0 bg-white dark:bg-dark bg-opacity-75 dark:bg-opacity-90"></span>
      <div className="max-w-7xl mx-auto relative z-10 pt-10 md:pt-0">
        <div className="inner text-center py-20 md:py-28">
          <h2 className="font-semibold text-black dark:text-white text-4xl">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
