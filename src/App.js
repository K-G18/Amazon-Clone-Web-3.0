import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {
  //useState stores the account 
  //setAccount updates the account
  //call setAccount to fetch account anywhere
  const [account,setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [dappazon, setDappazon] = useState(null)

  const [electronics, setElectronics] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [toys, setToys] = useState(null)
  //on clicking it will showup the selected item
  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }
//connecting account with the website
  const loadBloackchainData = async()=>{
    //connect to blockchain 
    //provider variable saves and fetches metamask connection
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    
    const network = await provider.getNetwork()
    console.log(network)
    //connect to smart contracts (in js version)
    //abi==>abstract binary interface is a json file that defines how smart contracts work
    const dappazon = new ethers.Contract(config[network.chainId].dappazon.address, Dappazon, provider)
    setDappazon(dappazon)

    // Load Products
    const items=[]
    for (var i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1)
      items.push(item)
    }
    const electronics = items.filter((item) => item.category === 'electronics')
    const clothing = items.filter((item) => item.category === 'clothing')
    const toys = items.filter((item) => item.category === 'toys')
    // console.log(electronics)
    setElectronics(electronics)
    setClothing(clothing)
    setToys(toys)

  }
//call loadBlockchainData using Useffect
  useEffect(()=>{
    loadBloackchainData()

    
    },[])
  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <h2>Dappazon Best Sellers</h2>
      {electronics && clothing && toys && (
        <>
          <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
          <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )} 
      {toggle && (
        <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop} />
      )}
    </div>
  );
}

export default App;
