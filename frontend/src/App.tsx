import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { GarmentDetailsPage } from './pages/GarmentDetailsPage';
import { AssessmentIntroPage } from './pages/AssessmentIntroPage';
import { MovementInstructionPage } from './pages/MovementInstructionPage';
import { ZoneSelectPage } from './pages/ZoneSelectPage';
import { ZoneDetailPage } from './pages/ZoneDetailPage';
import { DiscomfortLevelPage } from './pages/DiscomfortLevelPage';
import { FeedbackYesNoPage } from './pages/FeedbackYesNoPage';
import { FeedbackEasePage } from './pages/FeedbackEasePage';
import { FeedbackComfortPage } from './pages/FeedbackComfortPage';
import { FeedbackExperiencePage } from './pages/FeedbackExperiencePage';
import { AssessmentCompletePage } from './pages/AssessmentCompletePage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/garment-details" element={<GarmentDetailsPage />} />
          <Route path="/assessment/intro" element={<AssessmentIntroPage />} />
          <Route path="/assessment/movements/:movementIndex" element={<MovementInstructionPage />} />
          <Route path="/assessment/movements/:movementIndex/zones" element={<ZoneSelectPage />} />
          <Route path="/assessment/movements/:movementIndex/zones/:zoneId/detail" element={<ZoneDetailPage />} />
          <Route path="/assessment/movements/:movementIndex/zones/severity" element={<DiscomfortLevelPage />} />
          <Route path="/assessment/feedback/yes-no" element={<FeedbackYesNoPage />} />
          <Route path="/assessment/feedback/ease" element={<FeedbackEasePage />} />
          <Route path="/assessment/feedback/comfort" element={<FeedbackComfortPage />} />
          <Route path="/assessment/feedback/experience" element={<FeedbackExperiencePage />} />
          <Route path="/assessment/complete" element={<AssessmentCompletePage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
