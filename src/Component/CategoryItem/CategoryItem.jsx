function CategoryItem({ name, img }) {
  return (
    <div
        className="flex-none w-40 text-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
    >
        <img
            src={img}
            alt={name}
            className="w-20 h-20 mx-auto mb-2 object-contain rounded"
        />
        <span className="text-sm text-gray-600 line-clamp-2">
            {name}
        </span>
    </div>
  );
}

export default CategoryItem;