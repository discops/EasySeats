import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Sort from './components/Sort';
import Card from './components/Card';
import SeatChart from './components/SeatChart';

// ABIs - Update import to EasySeats
import EasySeats from './abis/EasySeats.json';

// Config - Updat econtract address in config.json
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  // Update tokenMaster state to EasySeats
  const [easySeats, setEasySeats] = useState(null);
  const [occasions, setOccasions] = useState([]);

  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    // Update to use EasySeats contract
    const easySeatsContract = new ethers.Contract(
      config[network.chainId].EasySeats.address,
      EasySeats.abi,
      provider
    );
    setEasySeats(easySeatsContract);

    const totalOccasions = await easySeats.totalOccasions();
    const occasions = [];

    for (let i = 1; i <= totalOccasions; i++) {
      const occasion = await easySeats.getOccasion(i);
      occasions.push(occasion);
    }

    setOccasions(occasions);

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />
        <h2 className="header__title"><strong>Event</strong> Tickets</h2>
      </header>

      <Sort />

      <div className='cards'>
        {occasions.map((occasion, index) => (
          <Card
            occasion={occasion}
            id={index + 1}
            easySeats={easySeats} // Update prop name
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          easySeats={easySeats} // Update prop name
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;
