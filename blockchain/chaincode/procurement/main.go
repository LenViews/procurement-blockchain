package main

import (
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	// "github.com/lensview/procurement-blockchain/blockchain/chaincode/procurement"
)

func main() {
	procurementChaincode, err := contractapi.NewChaincode(&ProcurementContract{})
	if err != nil {
		log.Panicf("Error creating procurement chaincode: %v", err)
	}

	if err := procurementChaincode.Start(); err != nil {
		log.Panicf("Error starting procurement chaincode: %v", err)
	}
}
