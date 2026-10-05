import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { EventProvider } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { EventListPage } from './pages/EventListPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EditEventPage } from './pages/EditEventPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <EventProvider>
            <div className="min-h-screen bg-white dark:bg-sunset-obsidian text-sunset-charcoal dark:text-sunset-whiteDark flex flex-col selection:bg-sunset-crimson selection:text-white dark:selection:bg-sunset-coral dark:selection:text-sunset-obsidian transition-colors duration-300">
              {/* Sticky Navigation Bar */}
              <Navbar />

              {/* Main Content Area */}
              <main className="flex-1 pb-12">
                <Routes>
                  <Route path="/" element={<Navigate to="/events" replace />} />
                  <Route path="/events" element={<EventListPage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  <Route path="/create-event" element={<CreateEventPage />} />
                  <Route path="/edit-event/:id" element={<EditEventPage />} />
                  <Route path="/my-registrations" element={<MyRegistrationsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<LoginPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
          </EventProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
