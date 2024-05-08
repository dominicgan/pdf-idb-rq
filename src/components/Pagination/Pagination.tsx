import { FC } from "react";
import "./Pagination.css";

interface PaginationProps {
  pageNumber: number;
  numPages: number;
  previousPage: () => void;
  nextPage: () => void;
}

const Pagination: FC<PaginationProps> = ({
  pageNumber,
  numPages,
  previousPage,
  nextPage,
}) => (
  <div className="pagination">
    <p className="pagination__current">
      Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
    </p>
    <button
      className="pagination__button pagination--prev"
      type="button"
      disabled={pageNumber <= 1}
      onClick={previousPage}
    >
      Previous
    </button>
    <button
      className="pagination__button pagination--next"
      type="button"
      disabled={pageNumber >= numPages}
      onClick={nextPage}
    >
      Next
    </button>
  </div>
);

export default Pagination;