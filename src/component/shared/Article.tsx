import { IArticle } from "@/interfaces/general";
import { imageLoader } from "@/utils/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface IArticleProps {
    article: IArticle;
}

const Article = ({ article }: IArticleProps) => {
    const { title, image, slug, createdAt } = article;
    return (
        <article className="article relative overflow-hidden">
            <Link href={`/blogs/${slug}`} className="block group">
                <div className="image relative w-full aspect-video rounded-xl overflow-hidden">
                    <Image
                        loader={imageLoader}
                        src={image}
                        alt={title}
                        className="aspect-video w-full h-auto transition-all duration-200 scale-100 group-hover:scale-110"
                        fill={true}
                    />
                </div>
                <h4 className="font-medium text-xl text-black dark:text-white mt-4 transition-all duration-200 group-hover:text-primary">
                    {title}
                </h4>
                <p className="text-bodylight dark:text-body">
                    Posted on: {formatDistanceToNow(new Date(createdAt))} ago
                </p>
            </Link>
        </article>
    );
};

export default Article;
