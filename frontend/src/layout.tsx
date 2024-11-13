import App from "./app";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ContextProvider from "./context";

export default function Layout() {
  return (
    <ContextProvider>
      <div className="px-5 min-h-screen relative pt-14">
        <div className="fixed left-0 top-0 w-full px-5 border-b-[0.5px] border-primary-light">
          <Navbar />
        </div>
        <div className="h-4" />
        <App />
        <div className="h-4" />
        <div className="absolute left-0 bottom-0 w-full">
          <Footer />
        </div>
      </div>
    </ContextProvider>
  );
}
