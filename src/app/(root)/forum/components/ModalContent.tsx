"use client";

import { IImageData } from "@/interfaces/general";
import { ChangeEvent, useState } from "react";
import { HiPhoto } from "react-icons/hi2";
import InfiniteGenerations from "./InfiniteGeneration";

interface IModalContentProps {
  modalCloser: () => void;
  selectedImage: IImageData | null;
  setSelectedImage: (arg0: IImageData | null) => void;
  uploadedImage: File | null;
  setUploadedImage: (arg0: File | null) => void;
}

const ModalContent = ({
  selectedImage,
  uploadedImage,
  modalCloser,
  setSelectedImage,
  setUploadedImage,
}: IModalContentProps) => {
  const [currentTab, setCurrentTab] = useState<string>("select");
  const [uploadedImageError, setUploadedImageError] = useState<string>("");

  const handleSelectImage = (imageData: IImageData) => {
    setSelectedImage(imageData);
    setUploadedImage(null);
    modalCloser();
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (e.target.files[0].size > MAX_FILE_SIZE) {
        setUploadedImageError("File size is larger than 5MB");
      } else {
        setUploadedImageError("");
        setUploadedImage(e.target.files[0]);
        setSelectedImage(null);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-3 md:p-5 lg:p-8 border border-borderlight dark:border-border rounded-lg bg-grey dark:bg-light">
      <h4 className="text-xl font-medium text-black dark:text-white text-center mb-6">
        Choose Image
      </h4>
      <div className="flex gap-2 flex-wrap">
        <button
          className={`btn ${currentTab === "select" ? "" : "btn-outline"}`}
          onClick={() => setCurrentTab("select")}
        >
          Select Image
        </button>
        <button
          className={`btn ${currentTab === "upload" ? "" : "btn-outline"}`}
          onClick={() => setCurrentTab("upload")}
        >
          Upload Image
        </button>
      </div>
      <div className="tabcontent mt-6">
        {currentTab === "select" && (
          <InfiniteGenerations
            selectedImage={selectedImage}
            handleSelectImage={handleSelectImage}
          />
        )}
        {currentTab === "upload" && (
          <div className="uploadbox">
            <label
              htmlFor="uploadedImage"
              className="block max-w-[386px] mx-auto text-center"
            >
              <div className="relative inline-flex text-center overflow-hidden w-full max-w-[386px] aspect-square justify-center items-center rounded-lg border border-borderlight dark:border-border">
                {uploadedImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="upload image"
                      title="Click to change image"
                      className="object-contain"
                    />
                  </>
                ) : (
                  <div className="text-center">
                    <HiPhoto className="text-3xl text-bodylight dark:text-body inline-block" />
                    <p className="text-sm mt-4 text-bodylight dark:text-body">
                      Upload image
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="uploadedImage"
                id="uploadedImage"
                className="!hidden"
                accept="image/*"
                onChange={handleUpload}
              />
            </label>
            {uploadedImageError && (
              <p className="message text-red-500 mt-2">{uploadedImageError}</p>
            )}
          </div>
        )}
      </div>
      <div className="text-center mt-4">
        <button className="btn" onClick={modalCloser}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default ModalContent;
