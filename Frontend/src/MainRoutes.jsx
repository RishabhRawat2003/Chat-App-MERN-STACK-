import { Outlet } from "react-router-dom";
import Footer from "./Component/Footer";

function App() {
  return (
    <>
      <div className="relative w-full mx-auto h-[100vh] sm:w-[60%] lg:w-[50%] xl:w-[45%] 2xl:w-[40%]">
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
