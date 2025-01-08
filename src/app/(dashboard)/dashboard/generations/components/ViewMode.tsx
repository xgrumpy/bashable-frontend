import { BsGrid, BsListTask } from "react-icons/bs";

interface IViewModeProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const ViewMode = ({ currentView, setCurrentView }: IViewModeProps) => {
  return (
    <div className="viewmode inline-flex rounded-md overflow-hidden">
      <button
        title="List View"
        className={`px-4 py-2.5 text-white text-xl ${
          currentView === "list" ? "bg-primary" : "bg-dark"
        }`}
        onClick={() => setCurrentView("list")}
      >
        <BsListTask />
      </button>
      <button
        title="List View"
        className={`px-4 py-2.5 text-white text-xl ${
          currentView === "grid" ? "bg-primary" : "bg-dark"
        }`}
        onClick={() => setCurrentView("grid")}
      >
        <BsGrid />
      </button>
    </div>
  );
};

export default ViewMode;
