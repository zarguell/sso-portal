import AppWidget from './AppWidget';

interface App {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  ssoUrl: string;
}

interface AppGridProps {
  apps: App[];
}

const AppGrid = ({ apps }: AppGridProps) => {
  if (apps.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No applications available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
      {apps.map(app => (
        <AppWidget key={app.id} app={app} />
      ))}
    </div>
  );
};

export default AppGrid;
