import React, { useState } from 'react';
import { Network, Server, Globe } from 'lucide-react';

// Main App component for the entire application
const App = () => {
  const [activeTab, setActiveTab] = useState('subnetting');

  // A simple header component for the application
  const Header = () => (
    <header className="bg-gray-900 text-white p-4 text-center rounded-t-lg">
      <h1 className="text-3xl font-bold font-inter">Network Tool</h1>
      <p className="text-sm text-gray-400 mt-1">Subnetting, Telnet & DNS Lookup</p>
    </header>
  );

  // A reusable component for the navigation tabs
  const Tabs = () => (
    <div className="flex justify-center bg-gray-800 p-2 rounded-b-lg">
      <button
        onClick={() => setActiveTab('subnetting')}
        className={`px-4 py-2 mx-1 rounded-md flex items-center transition-colors duration-200 ${
          activeTab === 'subnetting' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        <Network size={20} className="mr-2" />
        Subnetting
      </button>
      <button
        onClick={() => setActiveTab('telnet')}
        className={`px-4 py-2 mx-1 rounded-md flex items-center transition-colors duration-200 ${
          activeTab === 'telnet' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        <Server size={20} className="mr-2" />
        Telnet
      </button>
      <button
        onClick={() => setActiveTab('dnslookup')}
        className={`px-4 py-2 mx-1 rounded-md flex items-center transition-colors duration-200 ${
          activeTab === 'dnslookup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        <Globe size={20} className="mr-2" />
        DNS Lookup
      </button>
    </div>
  );

  // A simple and reusable card component for displaying results
  const ResultCard = ({ title, value }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200">
      <h3 className="text-sm font-semibold text-indigo-400 mb-1">{title}</h3>
      <p className="text-lg text-white font-mono">{value}</p>
    </div>
  );

  // A component for a simple input field with a label
  const LabeledInput = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200"
      />
    </div>
  );

  // Subnetting calculator component
  const SubnettingTool = () => {
    const [ipAddress, setIpAddress] = useState('');
    const [cidr, setCidr] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    // Function to validate and calculate subnetting details
    const calculateSubnet = () => {
      // Clear previous results and errors
      setResults(null);
      setError('');

      // Basic validation for IP address and CIDR
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      const cidrRegex = /^([1-9]|1[0-9]|2[0-9]|3[0-2])$/;

      if (!ipRegex.test(ipAddress) || !cidrRegex.test(cidr)) {
        setError('Invalid IP address or CIDR notation (e.g., 192.168.1.1 and 24)');
        return;
      }

      // Convert IP to a 32-bit integer for easier bitwise operations
      const ipOctets = ipAddress.split('.').map(Number);
      const ipInt = (ipOctets[0] << 24) | (ipOctets[1] << 16) | (ipOctets[2] << 8) | ipOctets[3];

      // Calculate the subnet mask and network address
      const mask = -1 << (32 - parseInt(cidr));
      const networkAddressInt = ipInt & mask;
      const broadcastAddressInt = networkAddressInt | ~mask;

      // Calculate other details
      const firstHostInt = networkAddressInt + 1;
      const lastHostInt = broadcastAddressInt - 1;
      const totalHosts = Math.pow(2, 32 - parseInt(cidr)) - 2;

      // Function to convert a 32-bit integer back to dotted-decimal format
      const intToIp = (int) => {
        const octet1 = (int >>> 24) & 0xFF;
        const octet2 = (int >>> 16) & 0xFF;
        const octet3 = (int >>> 8) & 0xFF;
        const octet4 = int & 0xFF;
        return `${octet1}.${octet2}.${octet3}.${octet4}`;
      };

      // Set the results state
      setResults({
        networkAddress: intToIp(networkAddressInt),
        broadcastAddress: intToIp(broadcastAddressInt),
        firstHost: intToIp(firstHostInt),
        lastHost: intToIp(lastHostInt),
        totalHosts: totalHosts >= 0 ? totalHosts : 'N/A', // Handle cases where total hosts is negative
        subnetMask: intToIp(mask),
        cidr: cidr,
      });
    };

    return (
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-white max-w-2xl mx-auto my-8 font-inter">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400">Subnet Calculator</h2>
        {/* Input fields for IP and CIDR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LabeledInput
            label="IP Address"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="e.g., 192.168.1.1"
          />
          <LabeledInput
            label="CIDR"
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            placeholder="e.g., 24"
            type="number"
          />
        </div>
        {/* Error message display */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {/* Calculate button */}
        <div className="flex justify-center">
          <button
            onClick={calculateSubnet}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Calculate
          </button>
        </div>
        {/* Results display */}
        {results && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard title="Network Address" value={results.networkAddress} />
            <ResultCard title="Broadcast Address" value={results.broadcastAddress} />
            <ResultCard title="First Host" value={results.firstHost} />
            <ResultCard title="Last Host" value={results.lastHost} />
            <ResultCard title="Subnet Mask" value={results.subnetMask} />
            <ResultCard title="Total Hosts" value={results.totalHosts} />
          </div>
        )}
      </div>
    );
  };

  // Telnet client simulation component
  const TelnetTool = () => {
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const [status, setStatus] = useState('Disconnected');
    const [log, setLog] = useState([]);
    const [error, setError] = useState('');

    const connect = () => {
      setError('');
      // Basic validation for host and port
      if (!host || !port) {
        setError('Please enter a host and port.');
        return;
      }
      if (isNaN(parseInt(port)) || parseInt(port) < 1 || parseInt(port) > 65535) {
        setError('Please enter a valid port (1-65535).');
        return;
      }

      setStatus('Connecting...');
      setLog([]);

      // --- SIMULATION ONLY ---
      setTimeout(() => {
        const isSuccess = Math.random() > 0.3; // Simulate a successful connection most of the time
        if (isSuccess) {
          setStatus('Connected!');
          setLog([`Attempting to connect to ${host} on port ${port}...`, `Connected to ${host}:${port}.`]);
        } else {
          setStatus('Connection Failed');
          setLog([`Attempting to connect to ${host} on port ${port}...`, `Connection failed: Timeout or host unreachable.`]);
        }
      }, 1500);
    };

    return (
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-white max-w-2xl mx-auto my-8 font-inter">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400">Telnet Client (Simulated)</h2>
        <div className="bg-yellow-900 border border-yellow-700 p-4 rounded-lg mb-6 text-yellow-100">
          <p className="font-bold">Note:</p>
          <p className="text-sm">
            This is a simulation. Actual Telnet connections cannot be made directly from a browser due to security restrictions.
          </p>
        </div>
        {/* Input fields for Host and Port */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <LabeledInput
            label="Host / IP"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="e.g., example.com"
          />
          <LabeledInput
            label="Port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="e.g., 23"
            type="number"
          />
        </div>
        {/* Error message display */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {/* Connect button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={connect}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Connect
          </button>
        </div>
        {/* Connection status and log */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-indigo-400">Connection Status: <span className="font-mono text-white">{status}</span></h3>
          <div className="bg-gray-950 p-4 rounded-md overflow-auto h-40 font-mono text-green-400 text-sm">
            {log.length > 0 ? (
              log.map((line, index) => <p key={index}>{line}</p>)
            ) : (
              <p>Waiting for connection...</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // DNS Lookup simulation component
  const DnsLookupTool = () => {
    const [domain, setDomain] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const lookupDns = async () => {
      setResults(null);
      setError('');
      setIsLoading(true);

      if (!domain) {
        setError('Please enter a domain name.');
        setIsLoading(false);
        return;
      }
      
      // --- SIMULATION ONLY ---
      try {
        const response = await new Promise(resolve => setTimeout(() => {
          // Mock data for DNS records
          const mockData = {
            'example.com': {
              A: ['93.184.216.34'],
              AAAA: ['2606:2800:220:1:248:1893:25c8:1946'],
              MX: [{ priority: 10, target: 'mail.example.com' }],
              TXT: ['v=spf1 include:_spf.example.com ~all'],
            },
            'google.com': {
              A: ['142.250.191.14', '172.217.169.14'],
              AAAA: ['2607:f8b0:4005:809::200e'],
              MX: [{ priority: 10, target: 'smtp.google.com' }],
            },
          };
          const resolvedDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/,'').split('/')[0];
          
          if (mockData[resolvedDomain]) {
            resolve({ success: true, data: mockData[resolvedDomain] });
          } else {
            resolve({ success: false, error: 'Domain not found or lookup failed.' });
          }
        }, 1500));
        
        if (response.success) {
          setResults(response.data);
        } else {
          setError(response.error);
        }

      } catch (err) {
        setError('An error occurred during lookup.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-white max-w-2xl mx-auto my-8 font-inter">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400">DNS Lookup (Simulated)</h2>
        <div className="bg-yellow-900 border border-yellow-700 p-4 rounded-lg mb-6 text-yellow-100">
          <p className="font-bold">Note:</p>
          <p className="text-sm">
            This tool provides a simulated DNS lookup.
          </p>
        </div>
        {/* Input field for domain name */}
        <div className="mb-6">
          <LabeledInput
            label="Domain Name"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g., example.com"
          />
        </div>
        {/* Error message display */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {/* Lookup button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={lookupDns}
            disabled={isLoading}
            className={`bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          >
            {isLoading ? 'Looking up...' : 'Lookup'}
          </button>
        </div>
        {/* Results display */}
        {results && (
          <div className="mt-8 grid grid-cols-1 gap-4">
            {Object.entries(results).map(([recordType, records], index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200">
                <h3 className="text-sm font-semibold text-indigo-400 mb-2">{recordType} Records</h3>
                <ul className="list-disc list-inside space-y-1 font-mono text-white">
                  {records.map((record, i) => (
                    <li key={i} className="break-words">{
                      typeof record === 'string'
                        ? record
                        : `${record.target} (Priority: ${record.priority})`
                    }</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-950 min-h-screen p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <Header />
        <Tabs />
        <main className="p-4 bg-gray-900 rounded-b-lg">
          {/* A switch statement to render the active component */}
          {(() => {
            switch (activeTab) {
              case 'subnetting':
                return <SubnettingTool />;
              case 'telnet':
                return <TelnetTool />;
              case 'dnslookup':
                return <DnsLookupTool />;
              default:
                return null;
            }
          })()}
        </main>
      </div>
    </div>
  );
};

export default App;
