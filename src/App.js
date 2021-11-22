import React from 'react';
import './App.css';
import nftABI from './abi/NFTabi'
import marketABI from './abi/MARKETabi'
import {ethers} from 'ethers'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {nftAddress, nftMarketAddress} from './config'
import { Card, Button, Row, Col } from 'react-bootstrap'

function App() {

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {    
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/06f16aadefe04a8189a8a16f0a9306b3")
    const tokenContract = new ethers.Contract(nftAddress, nftABI, provider)
    const marketContract = new ethers.Contract(nftMarketAddress, marketABI, provider)
    const data = await marketContract.fetchMarketItems()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftMarketAddress, marketABI, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftAddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h2 className="p-4">No items in marketplace</h2>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <Row xs={1} md={4} className="g-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="p-2 rounded-xl overflow-hidden">
                <Col>
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={nft.image} />
                  <Card.Body>
                    <Card.Title>{nft.name}</Card.Title>
                    <Card.Text>
                      {nft.description}
                    </Card.Text>
                    <Button variant="primary" onClick={() => buyNft(nft)}>Buy @{nft.price} ETH</Button>
                  </Card.Body>
                </Card>
                </Col>
              </div>
            ))
          }
        </Row>
      </div>
    </div>
  )
}
export default App;