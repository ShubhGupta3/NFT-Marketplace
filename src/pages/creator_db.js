import React from "react";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from "axios";
import {nftAddress, nftMarketAddress} from '../config'
import nftABI from '../abi/NFTabi'
import marketABI from '../abi/MARKETabi'
import { Card, Row, Col} from 'react-bootstrap'


function Dashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        
        const marketContract = new ethers.Contract(nftMarketAddress, marketABI, signer)
        const tokenContract = new ethers.Contract(nftAddress, nftABI, provider)
        const data = await marketContract.fetchItemsCreated()
        
        const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            image: meta.data.image,
        }
        return item
        }))
        // create a filtered array of items that have been sold
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded') 
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h2 className="p-4">No assets created</h2>)
    return (
        <div>
            <div className="p-4">
                <h2 className="text-2xl py-2">Items Created</h2>
                <Row xs={1} md={4} className="g-4">
                {
                    nfts.map((nft, i) => (
                    <div key={i} className="p-2 rounded-xl overflow-hidden">
                        <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={nft.image} />
                            <Card.Body>
                                <Card.Title>Price: {nft.price} ETH</Card.Title>
                            </Card.Body>
                        </Card>
                        </Col>
                    </div>
                    ))
                }
                </Row>
            </div>
            <div className="px-4">
            {
            Boolean(sold.length) && (
                <div>
                <h2>Items sold</h2>
                <Row xs={1} md={4} className="g-4">
                    {
                    sold.map((nft, i) => (
                        
                        <div key={i} className="p-2 rounded-xl overflow-hidden">
                            <Col>
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={nft.image} />
                                <Card.Body>
                                    <Card.Title>Price: {nft.price} ETH</Card.Title>
                                </Card.Body>
                            </Card>
                            </Col>
                        </div>
                    ))
                    }
                </Row>
                </div>
            )
            }
            </div>
        </div>
    )
}
export default Dashboard;