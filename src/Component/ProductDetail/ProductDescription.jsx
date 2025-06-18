import React from "react";

const ProductDescription = ({description}) => {
  return (
    <div className="bg-white shadow p-6 my-6">
      <p className="space-y-3 whitespace-pre-line font-sans text-base">
        {description}
      </p>
    </div>
  );
};

export default ProductDescription;
