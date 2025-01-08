import { toast } from "react-hot-toast";

export const toastError = (err: any) => {
  toast.error(
    err.response?.data?.message || err?.message || err || "Something is wrong"
  );
};
