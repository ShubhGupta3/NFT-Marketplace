import React from "react";
import { useState } from 'react';
import { ethers } from 'ethers';
import { useHistory } from "react-router";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3modal';
import {nftAddress, nftMarketAddress} from '../config'
import nftABI from '../abi/NFTabi'
import marketABI from '../abi/MARKETabi'
import { Form, Button, Row, Col } from "react-bootstrap";


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function Create() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    let history = useHistory()
  
    async function onChange(e) {
      const file = e.target.files[0]
      try {
        const added = await client.add(
          file,
          {
            progress: (prog) => console.log(`received: ${prog}`)
          }
        )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }
    async function createMarket() {
      const { name, description, price } = formInput
      if (!name || !description || !price || !fileUrl) return

      // first, upload to IPFS
      const data = JSON.stringify({
        name, description, image: fileUrl
      })
      try {
        const added = await client.add(data)
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        
        // after file is uploaded to IPFS, pass the URL to save it on Rinkeby Testnet 
        createSale(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }  
    }
  
    async function createSale(url) {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)    
      const signer = provider.getSigner()
      
      // next, create the item 
      let contract = new ethers.Contract(nftAddress, nftABI, signer)
      let transaction = await contract.createToken(url)
      let tx = await transaction.wait()
      let event = tx.events[0]
      let value = event.args[2]
      let tokenId = value.toNumber()
  
      const price = ethers.utils.parseUnits(formInput.price, 'ether')
    
      // then list the item for sale on the marketplace 
      contract = new ethers.Contract(nftMarketAddress, marketABI, signer)
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()
  
      transaction = await contract.createMarketItem(nftAddress, tokenId, price, { value: listingPrice })
      await transaction.wait()
      history.push('/')
    }
  
    return (
        <div className="flex justify-center">
            <div style={{ maxWidth: '1600px' }}></div>
            <Form className="p-4">
                <Form.Group controlId="formFile" className="mb-3">
                    <Row>
                        <Form.Label column lg={2}>
                            Asset Name
                        </Form.Label>
                        <Col>
                            <Form.Control 
                                type="text" 
                                placeholder="Asset Name" 
                                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Form.Label column lg={2}>
                            Asset Description
                        </Form.Label>
                        <Col>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Asset Description" 
                                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Form.Label column lg={2}>
                            Asset Price
                        </Form.Label>
                        <Col>
                            <Form.Control 
                                type="text" 
                                placeholder="Price of Asset" 
                                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Form.Control 
                            type="file" 
                            onChange={onChange}
                        />
                    </Row>
                </Form.Group>
            </Form>
            <div className="p-4">
                <Button onClick={createMarket}>
                    Create Digital Asset
                </Button>
            </div>
        </div>
    )
  }
export default Create;