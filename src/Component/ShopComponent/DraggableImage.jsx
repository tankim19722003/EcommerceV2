import { Trash } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

// Draggable Image Component
const DraggableImage = ({ image, index, moveImage, removeImage }) => {
  const [, ref] = useDrag({
    type: "IMAGE",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover: (item) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="relative group w-24 h-24">
      <img
        src={URL.createObjectURL(image)}
        alt={`Hình ảnh sản phẩm ${index + 1}`}
        className="w-full h-full object-cover rounded-md border border-gray-200"
      />
      <button
        type="button"
        onClick={() => removeImage(index)}
        className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-colors duration-150"
        aria-label="Xóa hình ảnh"
      >
        <Trash size={12} />
      </button>
      <p className="text-sm text-gray-600 mt-1 truncate">{image.name}</p>
    </div>
  );
};

export default DraggableImage;