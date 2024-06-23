import React from "react";
import Navbar from "./components/Navbar"; // Header including home, search bar, and signin buttons
import CategoryBar from "./components/CategoryBar"; // Slidable header under Navbar, including categories
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Basic from "./pages/categories/Basic";
import Sunscreen from "./pages/categories/Sunscreen";
import Makeup from "./pages/categories/Makeup";
import Bodycare from "./pages/categories/Bodycare";
import Others from "./pages/categories/Others";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Container from '@mui/material/Container';

function App() {
  return (
    <BrowserRouter>
      <Container maxWidth={false} disableGutters>
        <Navbar />
        <CategoryBar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/profile' exact element={<Profile />} />
        </Routes>

        <Routes>
          <Route path='/basic' exact element={<Home productPageName="Basic" />} />
          <Route path='/sunscreen' exact element={<Home productPageName="Sunscreen" />} />
          <Route path='/makeup' exact element={<Home productPageName="Makeup" />} />
          <Route path='/bodycare' exact element={<Home productPageName="Bodycare" />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
