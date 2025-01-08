"use client";

import { useEffect, useState } from "react";
import { IForumPost, IImageData } from "@/interfaces/general";
import useFetch from "@/hooks/useFetch";
import axiosReq from "@/utils/axios";
import { toast } from "react-hot-toast";
import Modal from "@/component/shared/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import Breadcrumb from "@/component/shared/Breadcrumb";
import ModalContent from "../components/ModalContent";
import { useSearchParams } from "next/navigation";
import { toastError } from "@/utils/error";

interface FormValues {
  title: string;
  content: string;
}

type Optional = Partial<FormValues>;

const EditForumPost = () => {
  const searchParams = useSearchParams();
  const postid = searchParams.get("postid");

  const [prevData, setPrevData] = useState<IForumPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<IImageData | null>(null);
  const [error, setError] = useState<string>("");

  const { data: forumData } = useFetch(`/forum/post/${postid}`, postid);

  useEffect(() => {
    setPrevData(forumData);
  }, [forumData]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Optional>({
    values: {
      title: prevData?.title,
      content: prevData?.content,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    setError("");
    if (selectedImage?.id && !uploadedImage) {
      axiosReq
        .post(`/forum/post/${postid}`, {
          generationId: selectedImage?.id,
          title: data.title,
          content: data.content,
        })
        .then((res) => {
          toast.success("Post Successfully Updated");
          setSelectedImage(null);
        })
        .catch((err) => {
          toastError(err);
          setError(
            err.response?.data?.message || err.message || "Something is wrong"
          );
        });
    } else if (uploadedImage && !selectedImage?.id) {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("title", data.title);
      formData.append("content", data.content);

      axiosReq
        .post(`/forum/post/${postid}`, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          toast.success("Post Successfully Updated");
          setSelectedImage(null);
        })
        .catch((err) => {
          toastError(err);
          setError(
            err.response?.data?.message || err.message || "Something is wrong"
          );
        });
    } else {
      axiosReq
        .post(`/forum/post/${postid}`, {
          title: data.title,
          content: data.content,
        })
        .then((res) => {
          toast.success("Post Successfully Updated");
          setSelectedImage(null);
        })
        .catch((err) => {
          toastError(err);
          setError(
            err.response?.data?.message || err.message || "Something is wrong"
          );
        });
    }
  };

  return (
    <>
      <Modal state={isModalOpen} closeHandler={() => setIsModalOpen(false)}>
        <ModalContent
          modalCloser={() => setIsModalOpen(false)}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
      </Modal>
      <Breadcrumb title="Edit Forum Post" />
      <main className="content">
        <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-dark border border-borderlight dark:border-border p-5 md:p-10 rounded-lg">
                <form
                  /* @ts-ignore */
                  onSubmit={handleSubmit(onSubmit)}
                  className="create space-y-3"
                >
                  {!selectedImage && !uploadedImage && (
                    <>
                      {(prevData?.generation?.image || prevData?.image) && (
                        <div className="max-w-xs relative rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              prevData?.generation?.image ||
                              prevData?.image ||
                              ""
                            }
                            alt={prevData?.title}
                            className="object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                  {selectedImage?.image && (
                    <div className="max-w-xs relative rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImage?.image}
                        alt={selectedImage?.prompt}
                        className="object-cover"
                      />
                    </div>
                  )}
                  {uploadedImage && (
                    <div className="max-w-xs relative rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(uploadedImage)}
                        alt="upload image"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <button
                    className="btn btn-outline"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                    }}
                  >
                    Choose Image
                  </button>
                  <div className="inputbox">
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      {...register("title")}
                      placeholder="Enter your title here"
                    />
                    {errors.title?.message && (
                      <p className="message text-red-500 mt-2">
                        {errors.title?.message}
                      </p>
                    )}
                  </div>
                  <div className="inputbox">
                    <label htmlFor="">Content</label>
                    <textarea
                      {...register("content", {
                        required: "Content is required",
                      })}
                      placeholder="Enter your content here"
                    />
                    {errors.content?.message && (
                      <p className="message text-red-500 mt-2">
                        {errors.content?.message}
                      </p>
                    )}
                  </div>
                  <div className="button text-center">
                    <button type="submit" className="btn mt-3">
                      Edit Post
                    </button>
                  </div>
                  {error && (
                    <p className="message bg-red-500 text-red-500 bg-opacity-10 rounded-md px-5 py-2 border border-red-500">
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default EditForumPost;
