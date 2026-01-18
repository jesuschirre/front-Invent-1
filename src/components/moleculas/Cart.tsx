interface CartProps {
  title: string;
  description: string | number;
}

export default function Cart({ title, description }: CartProps) {
  return (
    <div
      className="
        inline-block
        bg-white
        rounded-2xl
        py-3
         px-10
        shadow-md
        hover:shadow-xl
        transition-shadow
        duration-300
        border
        border-gray-100
      "
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-black text-2xl font-bold leading-relaxed flex justify-center">
        {description}
      </p>
    </div>
  );
}
