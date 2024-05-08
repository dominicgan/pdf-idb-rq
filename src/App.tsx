import { useCallback, useEffect, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "./App.css";
import books from "./data/books.json";
import streamToFile from "./utils/streamToFile";
import Pagination from "./components/Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import Loader from "./components/Loader/Loader";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};

const maxWidth = 600;

type PDFFile = string | File | null;

function App() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<PDFFile>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const { data, isFetched, isFetching } = useQuery({
    queryKey: ["pdfFiles", fileUrl],
    queryFn: () => {
      if (!fileUrl) {
        return null;
      }

      return fetch(fileUrl)
        .then((response) => {
          const filename = fileUrl.split("/").slice(-1)[0];
          return streamToFile(response.body!, filename);
        })
        .then((file) => {
          console.log("File object:", file);
          return file;
          // Now you can use the file object as needed
        })
        .catch((error) => {
          console.error("Error:", error);
          throw error;
        });
    },
    staleTime: Infinity,
    enabled: !!fileUrl,
  });

  useEffect(() => {
    if (isFetched && data) {
      setFile(data);
    }
  }, [isFetched, data]);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void => {
    setNumPages(nextNumPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    if (pageNumber === 1) {
      changePage(1);
    } else {
      changePage(2);
    }
  };

  const handleDownloadPdf = (url: string) => {
    console.log("download pdf", url);
    setFileUrl(url);
  };

  return (
    <div className="Example">
      {isFetching && <Loader />}
      <header>
        <h1>PDF viewer leveraging browser cache</h1>
      </header>

      <main>
        <div className="Example__sidebar-wrapper">
          <table className="Example__sidebar">
            <tbody>
              {books.map(({ title, url }) => (
                <tr key={title} className="Example__sidebar-tr">
                  <td data-cell-title className="Example__sidebar-title">
                    {title}
                  </td>
                  <td data-cell-link>
                    <button
                      className="Example__sidebar-button"
                      type="button"
                      onClick={() => handleDownloadPdf(url)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="Example__container">
          <div className="Example__container__document" ref={setContainerRef}>
            {file !== null ? (
              <>
                <Pagination
                  pageNumber={pageNumber}
                  numPages={numPages}
                  previousPage={previousPage}
                  nextPage={nextPage}
                />
                <Document
                  loading="Loading PDF file from memory, please wait..."
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={options}
                  className={
                    pageNumber === 1
                      ? "Document Document--first-page"
                      : "Document"
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={
                      containerWidth
                        ? Math.min(containerWidth, maxWidth)
                        : maxWidth
                    }
                  />
                  {pageNumber !== 1 && (
                    <Page
                      pageNumber={pageNumber + 1}
                      width={
                        containerWidth
                          ? Math.min(containerWidth, maxWidth)
                          : maxWidth
                      }
                    />
                  )}
                </Document>
              </>
            ) : (
              <div className="Example__container__document--no-file">
                <p>Select a file from the left sidebar.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
