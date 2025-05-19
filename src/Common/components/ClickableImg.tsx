import { ImgHTMLAttributes } from "react";

type ClickableImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  imgSrc: string;
  width?: string;
};

const ClickableImg = ({ imgSrc, width }: ClickableImgProps) => {
  return (
    <img
      src={imgSrc}
      alt="Authentication Step 1"
      style={{
        width: width || "32%",
        borderRadius: "8px",
        cursor: "pointer",
        objectFit: "cover",
      }}
      onClick={() => window.open(imgSrc, "_blank")}
    />
  );
};

export default ClickableImg;
