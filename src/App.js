import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import './index.css';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );

}


