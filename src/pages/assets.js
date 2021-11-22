import React from "react";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from "axios";
import {nftAddress, nftMarketAddress} from '../config'
import nftABI from '../abi/NFTabi'
import marketABI from '../abi/MARKETabi'
import { Card, Row, Col} from 'react-bootstrap'

function Assets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        
        const marketContract = new ethers.Contract(nftMarketAddress, marketABI, signer)
        const tokenContract = new ethers.Contract(nftAddress, nftABI, provider)
        const data = await marketContract.fetchMyNFTs()
        
        const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
        }
        return item
        }))
        setNfts(items)
        setLoadingState('loaded') 
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h2 className="p-4">No assets owned currently</h2>)
    return (
        <div className="flex justify-center">
            <div className="p-4">
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
        </div>
    )
}
export default Assets;