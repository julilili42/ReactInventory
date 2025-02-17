// articles.tsx
import { AddArticle } from "@/articles/addArticle";
import { TableArticle } from "./page";
import { useState } from "react";
import { ArticleDetails } from "./articleDetails";

export const Articles = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    null
  );

  return (
    <div className="flex flex-col items-start h-full gap-8 px-10 lg:flex-row">
      <div className="grid grid-rows-2 lg:w-1/2">
        <AddArticle />
        <ArticleDetails articleId={selectedArticleId} />
      </div>
      <div className="w-full lg:w-1/2">
        <TableArticle onRowClick={setSelectedArticleId} />
      </div>
    </div>
  );
};
