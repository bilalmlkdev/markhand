import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Whiteboard from './components/canvas/Whiteboard';

function App() {
  return (
    <div className="h-screen flex flex-col bg-stone-50 text-stone-900 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Whiteboard />
      </div>
    </div>
  );
}

export default App;
