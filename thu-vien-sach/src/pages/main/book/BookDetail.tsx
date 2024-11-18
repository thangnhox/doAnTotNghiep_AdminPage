import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Book from "../../../models/book/Book";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book>();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getBook();
  }, []);

  const getBook = async () => {
    try {
      setLoading(true);
      // const res = await handleAPI(`books/`)
      console.log(id)
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return <div>BookDetail {`${id}`}</div>;
};

export default BookDetail;
