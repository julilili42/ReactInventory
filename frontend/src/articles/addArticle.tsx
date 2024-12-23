// card.tsx
import { Article } from "@/lib/interfaces";
import { addEntry, importCSV } from "@/lib/operations";
import { useStore } from "@/lib/store";
import { FormCard } from "@/components/ui/formCard";

export const AddArticle = () => {
  const { data, setData, fetchData } = useStore();

  const fields = [
    {
      label: "Article ID",
      name: "article_id",
      placeholder: "Article ID",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Price",
      name: "price",
      placeholder: "Price",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Stock",
      name: "stock",
      placeholder: "Stock",
      valueAsNumber: true,
      required: true,
    },
    {
      label: "Manufacturer",
      name: "manufacturer",
      placeholder: "Manufacturer",
    },
    {
      label: "Category",
      name: "category",
      placeholder: "Category",
    },
  ];

  const handleSubmitArticle = async (newData: Article) => {
    try {
      await addEntry(newData);
      await fetchData();
      setData([newData, ...(data ?? [])]);
      console.log("Article added successfully");
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await importCSV(e.target.files[0]);
      await fetchData();
    }
  };

  return (
    <FormCard<Article>
      title="Add new Article"
      fields={fields}
      onSubmit={handleSubmitArticle}
      onFileImport={handleFileImport}
      submitLabel="Add article"
    />
  );
};