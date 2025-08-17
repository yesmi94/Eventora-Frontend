// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Homepage } from "./features/common/pages/homepage";
import CreateEventPage from "./features/events/pages/eventCreationPage";
import EventsDisplayPage from "./features/events/pages/eventsDisplayPage";
import EventDetailsPage from "./features/events/pages/eventDetailsPage";
import { ToastContainer } from "react-toastify";
import { EventUpdatePage } from "./features/events/pages/eventUpdatePage";
import MyRegistrationsPage from "./features/users/publicUsers/pages/myRegistrationsPage";
import Footer from "./features/common/components/footer";
import RegistrationsForEventDisplayPage from "./features/events/pages/eventRegistrationsListPage";
import PrivateRoute from "./shared/utils/privateRoute";
import Navigation from "./features/common/components/navbar";

function App() {
  return (
    <Router>
      <Navigation />
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />

        <Route
          path="/events"
          element={
            <PrivateRoute>
              <EventsDisplayPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/event-creation"
          element={
            <PrivateRoute>
              <CreateEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <EventsDisplayPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <PrivateRoute>
              <EventDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events-update/:id"
          element={
            <PrivateRoute>
              <EventUpdatePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/registrations"
          element={
            <PrivateRoute>
              <MyRegistrationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:eventId/registrations"
          element={
            <PrivateRoute>
              <RegistrationsForEventDisplayPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
