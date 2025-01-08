import ConfirmationModal from "@root/src/component/shared/ConfirmationModal";
import Modal from "@root/src/component/shared/Modal";
import {
    useClearOffence,
    useKickUser,
    useToggleBan,
    useToggleMute,
} from "@root/src/hooks/admin/useDiscordUser";
import { TConvictedUser } from "@root/src/interfaces/adminDiscord";
import React, { useState } from "react";
import UserDetails from "./UserDetails";

type TUserItemProps = {
    data: TConvictedUser;
};

export default function UserItem({ data }: TUserItemProps) {
    const {
        available,
        banned,
        discordConnected,
        discordUserName,
        firstOffenseAt,
        id,
        lastBanedAt,
        lastMutedAt,
        lastOffenseAt,
        muteCount,
        muted,
        offenseCount,
    } = data;

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isBannedModalOpen, setIsBannedModalOpen] = useState(false);
    const [isKickModalOpen, setIsKickModalOpen] = useState(false);
    const [isMuteModalOpen, setIsMuteModalOpen] = useState(false);
    const [isOffenceModalOpen, setIsOffenceModalOpen] = useState(false);

    const { mutate: toggleBan, isLoading: isLoadingBan } = useToggleBan();
    const { mutate: toggleMute, isLoading: isLoadingMute } = useToggleMute();
    const { mutate: kickUser, isLoading: isLoadingKick } = useKickUser();
    const { mutate: clearOffence, isLoading: isLoadingOffence } = useClearOffence();

    const handleKickUser = () => {
        kickUser(
            {
                id,
            },
            {
                onSuccess: () => {
                    setIsKickModalOpen(false);
                },
            }
        );
    };

    const handleMuteUser = () => {
        toggleMute(
            {
                id,
            },
            {
                onSuccess: () => {
                    setIsMuteModalOpen(false);
                },
            }
        );
    };

    const handleBanUser = () => {
        toggleBan(
            {
                id,
            },
            {
                onSuccess: () => {
                    setIsBannedModalOpen(false);
                },
            }
        );
    };

    const handleClearOffence = () => {
        clearOffence(
            {
                id,
            },
            {
                onSuccess: () => {
                    setIsOffenceModalOpen(false);
                },
            }
        );
    };

    return (
        <React.Fragment>
            <Modal state={isDetailsModalOpen} closeHandler={() => setIsDetailsModalOpen(false)}>
                <div className="max-w-5xl border border-border mx-auto bg-grey dark:bg-light p-5 md:p-10 rounded-2xl w-full">
                    <UserDetails id={id} />
                </div>
            </Modal>
            <ConfirmationModal
                state={isKickModalOpen}
                closeHandler={() => setIsKickModalOpen(false)}
                acceptHandler={handleKickUser}
                declineHandler={() => setIsKickModalOpen(false)}
                disabled={isLoadingKick}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure you want to kick the user?
                </h5>
            </ConfirmationModal>
            <ConfirmationModal
                state={isBannedModalOpen}
                closeHandler={() => setIsBannedModalOpen(false)}
                acceptHandler={handleBanUser}
                declineHandler={() => setIsBannedModalOpen(false)}
                disabled={isLoadingBan}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure you want to ban the user?
                </h5>
            </ConfirmationModal>
            <ConfirmationModal
                state={isMuteModalOpen}
                closeHandler={() => setIsMuteModalOpen(false)}
                acceptHandler={handleMuteUser}
                declineHandler={() => setIsMuteModalOpen(false)}
                disabled={isLoadingMute}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure you want to mute the user?
                </h5>
            </ConfirmationModal>
            <ConfirmationModal
                state={isOffenceModalOpen}
                closeHandler={() => setIsOffenceModalOpen(false)}
                acceptHandler={handleClearOffence}
                declineHandler={() => setIsOffenceModalOpen(false)}
                disabled={isLoadingOffence}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure you want to clear offence from the user?
                </h5>
            </ConfirmationModal>
            <div className="border border-borderlight dark:border-border py-2 gap-y-4 rounded-md flex items-center justify-between flex-wrap lg:flex-nowrap">
                <div className="info border-0 border-borderlight dark:border-border lg:border-r space-y-1 px-4 lg:flex-1">
                    <p>
                        Discord Username:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {discordUserName}
                        </span>
                    </p>
                    <p>
                        Discord Connected:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {discordConnected ? "YES" : "NO"}
                        </span>
                    </p>
                    <p>
                        Available:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {available ? "YES" : "NO"}
                        </span>
                    </p>
                </div>
                <div className="offence border-0 border-borderlight dark:border-border lg:border-r space-y-1 px-4 lg:flex-1">
                    <p>
                        Total Offences:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {offenseCount} times
                        </span>
                    </p>
                    <p>
                        First Offense At:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {lastOffenseAt ? new Date(firstOffenseAt).toLocaleString() : "Never"}
                        </span>
                    </p>
                    <p>
                        Last Offense At:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {lastOffenseAt ? new Date(lastOffenseAt).toLocaleString() : "Never"}
                        </span>
                    </p>
                </div>
                <div className="muted border-0 border-borderlight dark:border-border lg:border-r space-y-1 px-4 lg:flex-1">
                    <p>
                        Banned:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {banned ? "YES" : "NO"}
                        </span>
                    </p>
                    <p>
                        Muted:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {muted ? "YES" : "NO"}
                        </span>
                    </p>
                    <p>
                        Total Mutes:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {muteCount} times
                        </span>
                    </p>
                    <p>
                        Last Muted At:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {lastMutedAt ? new Date(lastMutedAt).toLocaleString() : "Never"}
                        </span>
                    </p>
                    <p>
                        Last Banned At:{" "}
                        <span className="text-black dark:text-white font-semibold">
                            {lastBanedAt ? new Date(lastBanedAt).toLocaleString() : "Never"}
                        </span>
                    </p>
                </div>
                <div className="muted flex flex-col justify-center items-center space-y-2 px-4 w-full max-w-[200px]">
                    <button
                        className="btn btn-sm block w-full text-center btn-outline"
                        onClick={() => setIsDetailsModalOpen(true)}
                    >
                        View Details
                    </button>
                    {!banned && available ? (
                        <button
                            className="btn btn-sm block w-full text-center !bg-yellow-500 !text-black"
                            onClick={() => setIsBannedModalOpen(true)}
                        >
                            Ban User
                        </button>
                    ) : null}
                    {banned ? (
                        <button
                            className="btn btn-sm block w-full text-center !bg-yellow-500 !text-black"
                            onClick={handleBanUser}
                        >
                            Unban User
                        </button>
                    ) : null}
                    {!muted && available ? (
                        <button
                            className="btn btn-sm block w-full text-center !bg-yellow-500 !text-black"
                            onClick={() => setIsMuteModalOpen(true)}
                        >
                            Mute User
                        </button>
                    ) : null}
                    {muted && available ? (
                        <button
                            className="btn btn-sm block w-full text-center !bg-yellow-500 !text-black"
                            onClick={handleMuteUser}
                        >
                            Unmute User
                        </button>
                    ) : null}
                    <button
                        className="btn btn-sm block w-full text-center !bg-yellow-500 !text-black"
                        onClick={() => setIsOffenceModalOpen(true)}
                    >
                        Clear Offence
                    </button>
                    {available ? (
                        <button
                            className="btn btn-sm block w-full text-center !bg-red-500"
                            onClick={() => setIsKickModalOpen(true)}
                        >
                            Kick User
                        </button>
                    ) : null}
                </div>
            </div>
        </React.Fragment>
    );
}

// ban : not banned + available
// unban: banned
// mute : not muted + available
// unmute: muted + available
// kick: available
