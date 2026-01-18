import img from "../../assets/inventarioslogo.png"
export default function CirImg() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src={img}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="dark:text-white">correo@corre.com</h1>
    </div>
  );
}