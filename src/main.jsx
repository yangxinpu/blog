import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './global.scss';
import i18n from './lib/i18n/i18n';
import Loading from './components/common/Loading/Loading.jsx';

const App = lazy(() => import('./App.jsx'));

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Suspense fallback={<Loading />}>
            <App />
        </Suspense>
    </StrictMode>
);
