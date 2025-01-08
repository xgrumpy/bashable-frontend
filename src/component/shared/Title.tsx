import classNames from "classnames";

interface ITitleProps {
  title: string;
  subtitle: string;
  position?: string;
}

const Title = ({ title, subtitle, position = "center" }: ITitleProps) => {
  const titleclass = classNames("title relative mb-12", {
    "text-center": position === "center",
    "text-left": position === "left",
    "text-right": position === "right",
  });
  return (
    <div className={titleclass}>
      {title && (
        <h6 className="text-secondary mb-1 text-lg font-semibold tracking-wider">
          {title}
        </h6>
      )}
      {subtitle && (
        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3 capitalize">
          {subtitle}
        </h2>
      )}
    </div>
  );
};

export default Title;
