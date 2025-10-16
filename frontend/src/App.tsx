import { useState } from 'react';
import AppGrid from './components/AppGrid';
import SearchBar from './components/SearchBar';
import useApps from './hooks/useApps';

function App() {
  const { data, isLoading, error } = useApps();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = data?.apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Application Portal</h1>
          {data?.user && <span>Welcome, {data.user.displayName}</span>}
        </div>
      </header>
      <main className="container mx-auto p-4">
        <SearchBar onSearch={setSearchTerm} />
        {isLoading && <p>Loading applications...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {filteredApps && <AppGrid apps={filteredApps} />}
      </main>
    </div>
  );
}

export default App;
