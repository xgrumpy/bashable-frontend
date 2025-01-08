const settings = {
    GENERATION_SIZES: [
        {
            id: 1,
            value: "512*512",
            ratio: "1:1",
        },
        {
            id: 2,
            value: "768*768",
            ratio: "1:1",
        },
        // {
        //   id: 3,
        //   value: "1024*1024",
        //   ratio: "1:1",
        // },
        {
            id: 3,
            value: "640*360",
            ratio: "16:9",
        },
        {
            id: 4,
            value: "1024*576",
            ratio: "16:9",
        },
        // {
        //   id: 6,
        //   value: "1280*720",
        //   ratio: "16:9",
        // },
        {
            id: 5,
            value: "384*768",
            ratio: "1:2",
        },
        {
            id: 6,
            value: "512*1024",
            ratio: "1:2",
        },
        // {
        //   id: 9,
        //   value: "640*1280",
        //   ratio: "1:2",
        // },
    ],
    CONTROLNET_ITEMS: [
        {
            name: "Canny",
            value: "canny",
        },
        {
            name: "Depth",
            value: "depth_midas",
        },
        {
            name: "LineArt",
            value: "lineart_realistic",
        },
        {
            name: "Reference",
            value: "reference_only",
        },
        {
            name: "OpenPose",
            value: "openpose",
        },
        {
            name: "OpenPoseFace",
            value: "openpose_faceonly",
        },
        {
            name: "Soft Edges",
            value: "softedge_hed",
        },
    ],
    QUICK_BUY_PACKAGES: [
        {
            id: 1,
            credits: 50,
            usd: 4.99,
            approxgen: 1500,
        },
        {
            id: 2,
            credits: 165,
            usd: 14.99,
            approxgen: 5000,
        },
        {
            id: 3,
            credits: 600,
            usd: 49.99,
            approxgen: 18000,
        },
    ],
    DEFAULT_MODEL_VALUE: "deliberate_v2.safetensors",
};

export default settings;
