import { useState } from 'react';

// Указываем тип пропса для setImage, который ожидает File | null
interface AddPhotoProps {
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
}

export const AddPhoto: React.FC<AddPhotoProps> = ({ setImage }) => {
  const [image, setLocalImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Берём первый файл из списка
    if (file) {
      setLocalImage(URL.createObjectURL(file)); // Локальное состояние для предварительного просмотра
      setImage(file); // Обновляем состояние родителя с объектом File
    }
  };

  return (
    <div className="addPhoto flex items-center">
      <div className="grid h-[214px] w-[214px] max-w-sm items-center gap-1.5 rounded-[10px]">
        <label htmlFor="picture" className="w-full h-full relative">
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
              <span className="text-2xl text-black">+</span>
            </div>
          )}
          <input
            id="picture"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer rounded-[10px]"
          />
        </label>
      </div>

      <div className="ml-4">
        <h1 className="text-2xl text-black h-12">Добавить фото</h1>
        <p className="text-gray-500">Не больше 5 Мб</p>
        <p className="text-gray-500">Допустимый формат файла - .png, .jpg</p>
      </div>
    </div>
  );
};

export default AddPhoto;
