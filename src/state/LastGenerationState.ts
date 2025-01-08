import { atom } from "recoil";

export interface IGenerateProps {
    negative_prompt: string;
    steps: number;
    seed: number;
    cfg_scale: number;
    image?: string | null;
    width?: number;
    height?: number;
    module: string;
    preprocessor?: boolean;
    prompt: string;
    model: string;
    private: boolean;
}

export const stateLastGeneration = atom<IGenerateProps>({
    key: "stateLastGeneration",
    default: {} as IGenerateProps,
});
