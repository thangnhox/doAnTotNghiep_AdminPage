import { Image, Pagination, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { handleAPI } from "../../../remotes/apiHandle";
import { getAccessToken } from "../../../remotes/axiosConfig";

const BookReader = () => {
  const { id } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [isLoading, setLoading] = useState(false);
  const [pageNum, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [image, setImage] = useState<any>();
  const [preloadedImages, setPreloadedImages] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    getBook();
  }, [id]);

  useEffect(() => {
    getContent();
    preloadImages(pageNum);
  }, [pageNum, totalPage]);

  const getBook = async () => {
    try {
      const res = await handleAPI(`books/fetch/${id}`);
      setTotalPage(res.data.data.PageCount);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const getContent = async () => {
    if (preloadedImages[pageNum]) {
      setImage(preloadedImages[pageNum]);
      return;
    }

    try {
      setLoading(true);
      const token = getAccessToken();
      const res = await axios.get(
        `${baseUrl}/books/read/${id}?page=${pageNum}&width=1000&height=1000&density=200`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const blobUrl = URL.createObjectURL(res.data);
      setImage(blobUrl);
      setPreloadedImages((prev) => ({ ...prev, [pageNum]: blobUrl }));
    } catch (error) {
      console.error("Error fetching page content:", error);
    } finally {
      setLoading(false);
    }
  };

  const preloadImages = async (currentPage: number) => {
    const token = getAccessToken();

    const pagesToPreload = [
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ].filter((page) => page > 0 && page <= totalPage);

    try {
      const promises = pagesToPreload.map(async (page) => {
        if (!preloadedImages[page]) {
          const res = await axios.get(
            `${baseUrl}/books/read/${id}?page=${page}&width=1000&height=1000&density=200`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return { page, url: URL.createObjectURL(res.data) };
        }
        return null;
      });

      const results = await Promise.all(promises);

      setPreloadedImages((prev) => {
        const updated = { ...prev };
        results.forEach((result) => {
          if (result) {
            updated[result.page] = result.url;
          }
        });
        return updated;
      });
    } catch (error) {
      console.error("Error preloading images:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          {isLoading ? (
            <Spin />
          ) : (
            <div className="d-flex flex-column gap-3 align-items-center">
              <Image
                src={image}
                alt="page"
                preview={false}
                placeholder={<Spin />}
              />
              <Pagination
                simple
                total={totalPage}
                onChange={(page) => setPage(page)}
                pageSize={1}
                current={pageNum}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default BookReader;
