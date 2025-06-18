import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductManagement = ({ products, productPage, setProductPage, itemsPerPage }) => {
  const handleAddProduct = () => {
    alert("Add product functionality");
  };

  const handleEditProduct = (id) => {
    alert(`Edit product ${id}`);
  };

  const handleDeleteProduct = (id) => {
    alert(`Delete product ${id}`);
  };
  

  const productTotalPage = Math.ceil(products.length / itemsPerPage);
  const handleProductPrevious = () => setProductPage((prev) => Math.max(prev - 1, 0));
  const handleProductNext = () => setProductPage((prev) => Math.min(prev + 1, productTotalPage - 1));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Products</h3>
        <button
          onClick={handleAddProduct}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Add Product
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products
              .slice(productPage * itemsPerPage, (productPage + 1) * itemsPerPage)
              .map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            onClick={handleProductPrevious}
            disabled={productPage === 0}
            className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ease-in-out ${
              productPage === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 rounded-md">
            Page {productPage + 1} of {productTotalPage}
          </span>
          <button
            onClick={handleProductNext}
            disabled={productPage === productTotalPage - 1}
            className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ease-in-out ${
              productPage === productTotalPage - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;