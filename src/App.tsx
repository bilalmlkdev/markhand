import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DrawingCanvas } from './components/canvas/DrawingCanvas';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <div className="h-screen flex flex-col bg-stone-50 text-stone-900 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <DrawingCanvas />
      </div>
      <Footer />
    </div>
  );
}

export default App;
