import { createRoot } from "react-dom/client";
import Nav from "./components/nav";
import Products from "./components/products";
import styled from "styled-components";

const App = () => {
  return (
    <Container>
      <Nav />
      <div style={{ height: 20 }} />
      <Products />
    </Container>
  );
};

const Container = styled.div`
  padding: 0px 20px;
`;

createRoot(document.getElementById("root")!).render(<App />);
