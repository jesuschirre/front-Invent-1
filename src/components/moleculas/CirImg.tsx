import { UserAuth } from "../../context/AuthContext";
export default function CirImg() {
  const {user} = UserAuth();
  return (
    <div className="flex justify-center items-center">
      <h1 className="font-black text-xl mr-2 dark:text-white">Bienvenido </h1>
      <h1 className="dark:text-white">{user?.email}</h1>
    </div>
  );
}