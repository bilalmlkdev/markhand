import { PenControls } from '../controls/PenControls';
import { CanvasControls } from '../controls/CanvasControls';
import { GuideControls } from '../controls/GuideControls';
import { ExportPanel } from '../exports/ExportPanel';

export function Sidebar() {
  return (
    <aside className="w-[180px] min-w-[180px] border-r border-stone-200 bg-white flex flex-col overflow-y-auto">
      <PenControls />
      <CanvasControls />
      <GuideControls />
      <ExportPanel />
    </aside>
  );
}
