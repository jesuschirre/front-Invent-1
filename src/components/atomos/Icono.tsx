interface IconoProps {
  children: React.ReactNode;
  className?: string;
}

export function Icono({ children, className = "" }: IconoProps) {
  return (
    <span className={`text-xl text-gray-900 ${className}`}>
      {children}
    </span>
  );
}
