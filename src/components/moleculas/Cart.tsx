interface CartProps {
  title: string;
  description: string | number;
}

export default function Cart({ title, description }: CartProps) {
  return (
    <div
      className="
        inline-block
        bg-[#fee685]
        dark:bg-zinc-800
        border-4
        border-black
        rounded-none
        py-5
        px-12
        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]
        hover:translate-x-[3px]
        hover:translate-y-[3px]
        hover:shadow-none
        transition-all
        duration-100
        cursor-default
      "
    >
      <h3 className="text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/50 mb-1">
        {title}
      </h3>

      <p className="text-black dark:text-white text-4xl font-black leading-none flex justify-center tracking-tighter">
        {description}
      </p>
    </div>
  );
}