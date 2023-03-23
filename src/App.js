import { ethers } from 'ethers';
import { useState } from 'react';
import './App.css';
import ABI from './abi.json';

function App() {

  const [customerId, setCustomerId] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  const CONTRACT_ADDRESS = "0xE9956c971B72aD74F249E616828df613F03E858b";

  async function getProvider(){
    // Check if Metamask exists
    if(!window.ethereum) return setMessage("Metamask not detected!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Check if account exists
    const accounts = await provider.send("eth_requestAccounts", []);
    if(!accounts || !accounts.length) return setMessage("Wallet not authorized.");

    return provider;
  }

  async function doSearch() {
    try {
      const provider = await getProvider();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const customer = await contract.getCustomer(customerId);
      setMessage(JSON.stringify(customer));
    }
    catch (err) {
      setMessage(err.message);
    }
  }

  function onSearchClick() {
    setMessage("");
    doSearch();
  }

  async function doSave() {
    try{

     const provider = await getProvider();
     const signer = provider.getSigner();

     const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
     const contractSigner = contract.connect(signer);

     const tx = await contractSigner.addCustomer({name, age});
     setMessage(JSON.stringify(tx));
    } catch (err) {
     setMessage(err.message);      
    }
  }


  function onSaveClick() {
    setMessage("");
    doSave();

  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <label>
            Customer ID:
            <input type="number" value={customerId} onChange={(evt) => setCustomerId(evt.target.value)}/>
          </label>
          <input type="button" value="Search" onClick={onSearchClick}/>
        </p>
        <hr />
        <p>
          <label>
            Name: <input type="text" value={name} onChange={(evt) => setName(evt.target.value)}/>
          </label>
        </p>
        <p>
          <label>
            Age: <input type="number" value={age} onChange={(evt) => setAge(evt.target.value)}/>
          </label>
        </p>
        <input type="button" value="Save" onClick={onSaveClick}/>
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;
