import classNames from "classnames";

type TMessageType = "error" | "warning" | "info" | "success";

type TCustomMessageProps = {
    msg: string;
    type?: TMessageType;
};

const CustomMessage = ({ msg, type = "warning" }: TCustomMessageProps) => {
    return (
        <div className="text-center w-full p-5">
            <p
                className={`text-xl  font-semibold ${classNames({
                    "text-yellow-500": type === "warning",
                    "text-red-500": type === "error",
                    "text-primary": type === "info",
                    "text-green-500": type === "success",
                })}`}
            >
                {msg}
            </p>
        </div>
    );
};

export default CustomMessage;
