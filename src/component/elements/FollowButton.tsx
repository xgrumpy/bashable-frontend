import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface IFollowButtonProps {
    isFollowed: boolean;
    userId: string;
    refresh?: () => void;
}

const FollowButton = ({ isFollowed, userId, refresh }: IFollowButtonProps) => {
    const [followStatus, setFollowStatus] = useState<boolean>(false);

    const { username, banned, login } = useAuthContext();
    const { changeAuthBoxStatus } = useAppContext();

    useEffect(() => {
        setFollowStatus(isFollowed);
    }, [isFollowed]);

    const followRequestHandler = () => {
        axiosReq
            .post(`/users/${userId}/follow`)
            .then((res) => {
                setFollowStatus(!followStatus);
                toast.success(res.data.message);
                refresh && refresh();
                axiosReq
                    .get("/users/login/check")
                    .then((res: any) => {
                        login(res.data);
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleFollow = () => {
        if (!username) {
            changeAuthBoxStatus("signup");
        } else {
            followRequestHandler();
        }
    };

    if (banned) return null;

    return (
        <div className="inline-block">
            {followStatus ? (
                <button className="btn" onClick={handleFollow}>
                    Unfollow
                </button>
            ) : (
                <button className="btn btn-outline" onClick={handleFollow}>
                    Follow
                </button>
            )}
        </div>
    );
};

export default FollowButton;
