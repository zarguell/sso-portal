interface App {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  ssoUrl: string;
}

interface AppWidgetProps {
  app: App;
}

const AppWidget = ({ app }: AppWidgetProps) => {
  const handleSso = async () => {
    // MVP: Mock SSO initiation
    console.log(`Initiating SSO to ${app.name}`);
    try {
      const MOCK_TOKEN = 'your-jwt-token';
      const response = await fetch(app.ssoUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MOCK_TOKEN}`
        }
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('SSO failed', error);
      alert('SSO initiation failed.');
    }
  };

  return (
    <div 
      onClick={handleSso}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow"
    >
      <img src={app.iconUrl} alt={`${app.name} icon`} className="w-16 h-16 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800">{app.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{app.description}</p>
    </div>
  );
};

export default AppWidget;
