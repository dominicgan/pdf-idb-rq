import { FC } from "react";
import "./Loader.css";

const Loader: FC = () => (
  <div className="Loader">
    <span className="Loader__text">Downloading file, please wait...</span>
  </div>
);

export default Loader;
