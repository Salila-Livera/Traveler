import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostDetail from "./pages/PostDetail";
import "./styles/global.css";
import "./styles/components.css";
import PlansPage from "./pages/PlansPage";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import CreateCommunity from "./pages/CreateCommunity";
import EditCommunity from "./pages/EditCommunity";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/communities/new" element={<CreateCommunity />} />
        <Route path="/communities/:id" element={<CommunityDetail />} />
        <Route path="/communities/:id/edit" element={<EditCommunity />} />

        
      </Routes>
    </Router>
  );
}

export default App;