package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type ProcurementContract struct {
	contractapi.Contract
}

// Bid structure
type Bid struct {
	BidID       string    `json:"bidId"`
	TenderID    string    `json:"tenderId"`
	VendorID    string    `json:"vendorId"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Status      string    `json:"status"` // Submitted, Evaluated, Awarded, Rejected
	Documents   []string  `json:"documents"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// Tender structure
type Tender struct {
	TenderID    string    `json:"tenderId"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `json:"category"` // goods or services
	Budget      float64   `json:"budget"`
	Deadline    time.Time `json:"deadline"`
	Status      string    `json:"status"` // Open, Closed, Awarded
	CreatedBy   string    `json:"createdBy"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// Vendor structure
type Vendor struct {
	VendorID    string    `json:"vendorId"`
	KraPin      string    `json:"kraPin"`
	CompanyName string    `json:"companyName"`
	Email       string    `json:"email"`
	PhoneNumber string    `json:"phoneNumber"`
	Category    string    `json:"category"` // goods or services
	Blacklisted bool      `json:"blacklisted"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// SubmitBid creates a new bid on the ledger
func (pc *ProcurementContract) SubmitBid(ctx contractapi.TransactionContextInterface, bidJSON string) error {
	var bid Bid
	err := json.Unmarshal([]byte(bidJSON), &bid)
	if err != nil {
		return fmt.Errorf("failed to unmarshal bid: %v", err)
	}

	// Validate bid
	if bid.BidID == "" || bid.TenderID == "" || bid.VendorID == "" || bid.Amount <= 0 {
		return fmt.Errorf("invalid bid data: missing required fields")
	}

	// Check if tender exists
	tenderBytes, err := ctx.GetStub().GetState(bid.TenderID)
	if err != nil {
		return fmt.Errorf("failed to read tender: %v", err)
	}
	if tenderBytes == nil {
		return fmt.Errorf("tender %s does not exist", bid.TenderID)
	}

	// Check if vendor exists
	vendorBytes, err := ctx.GetStub().GetState(bid.VendorID)
	if err != nil {
		return fmt.Errorf("failed to read vendor: %v", err)
	}
	if vendorBytes == nil {
		return fmt.Errorf("vendor %s does not exist", bid.VendorID)
	}

	// Set default values
	if bid.Status == "" {
		bid.Status = "Submitted"
	}
	if bid.CreatedAt.IsZero() {
		bid.CreatedAt = time.Now()
	}
	bid.UpdatedAt = time.Now()

	bidBytes, err := json.Marshal(bid)
	if err != nil {
		return fmt.Errorf("failed to marshal bid: %v", err)
	}

	return ctx.GetStub().PutState(bid.BidID, bidBytes)
}

// GetBid returns the bid from the ledger
func (pc *ProcurementContract) GetBid(ctx contractapi.TransactionContextInterface, bidID string) (*Bid, error) {
	bidBytes, err := ctx.GetStub().GetState(bidID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if bidBytes == nil {
		return nil, fmt.Errorf("bid %s does not exist", bidID)
	}

	var bid Bid
	err = json.Unmarshal(bidBytes, &bid)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal bid: %v", err)
	}

	return &bid, nil
}

// UpdateBidStatus updates the status of a bid
func (pc *ProcurementContract) UpdateBidStatus(ctx contractapi.TransactionContextInterface, bidID string, newStatus string) error {
	bid, err := pc.GetBid(ctx, bidID)
	if err != nil {
		return err
	}

	// Validate status transition
	validTransitions := map[string][]string{
		"Submitted": {"Evaluated", "Rejected"},
		"Evaluated": {"Awarded", "Rejected"},
	}

	if !contains(validTransitions[bid.Status], newStatus) {
		return fmt.Errorf("invalid status transition from %s to %s", bid.Status, newStatus)
	}

	bid.Status = newStatus
	bid.UpdatedAt = time.Now()

	bidBytes, err := json.Marshal(bid)
	if err != nil {
		return fmt.Errorf("failed to marshal bid: %v", err)
	}

	return ctx.GetStub().PutState(bidID, bidBytes)
}

// GetBidHistory returns the history of a bid
func (pc *ProcurementContract) GetBidHistory(ctx contractapi.TransactionContextInterface, bidID string) ([]*Bid, error) {
	resultsIterator, err := ctx.GetStub().GetHistoryForKey(bidID)
	if err != nil {
		return nil, fmt.Errorf("failed to get bid history: %v", err)
	}
	defer resultsIterator.Close()

	var bids []*Bid
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate history: %v", err)
		}

		var bid Bid
		err = json.Unmarshal(response.Value, &bid)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal bid: %v", err)
		}

		bids = append(bids, &bid)
	}

	return bids, nil
}

// CreateTender creates a new tender on the ledger
func (pc *ProcurementContract) CreateTender(ctx contractapi.TransactionContextInterface, tenderJSON string) error {
	var tender Tender
	err := json.Unmarshal([]byte(tenderJSON), &tender)
	if err != nil {
		return fmt.Errorf("failed to unmarshal tender: %v", err)
	}

	// Validate tender
	if tender.TenderID == "" || tender.Title == "" || tender.Budget <= 0 {
		return fmt.Errorf("invalid tender data: missing required fields")
	}

	// Check if tender already exists
	tenderBytes, err := ctx.GetStub().GetState(tender.TenderID)
	if err != nil {
		return fmt.Errorf("failed to read tender: %v", err)
	}
	if tenderBytes != nil {
		return fmt.Errorf("tender %s already exists", tender.TenderID)
	}

	// Set default values
	if tender.Status == "" {
		tender.Status = "Open"
	}
	if tender.CreatedAt.IsZero() {
		tender.CreatedAt = time.Now()
	}
	tender.UpdatedAt = time.Now()

	tenderBytes, err = json.Marshal(tender)
	if err != nil {
		return fmt.Errorf("failed to marshal tender: %v", err)
	}

	return ctx.GetStub().PutState(tender.TenderID, tenderBytes)
}

// RegisterVendor creates a new vendor on the ledger
func (pc *ProcurementContract) RegisterVendor(ctx contractapi.TransactionContextInterface, vendorJSON string) error {
	var vendor Vendor
	err := json.Unmarshal([]byte(vendorJSON), &vendor)
	if err != nil {
		return fmt.Errorf("failed to unmarshal vendor: %v", err)
	}

	// Validate vendor
	if vendor.VendorID == "" || vendor.KraPin == "" || vendor.CompanyName == "" {
		return fmt.Errorf("invalid vendor data: missing required fields")
	}

	// Check if vendor already exists
	vendorBytes, err := ctx.GetStub().GetState(vendor.VendorID)
	if err != nil {
		return fmt.Errorf("failed to read vendor: %v", err)
	}
	if vendorBytes != nil {
		return fmt.Errorf("vendor %s already exists", vendor.VendorID)
	}

	// Set default values
	if vendor.CreatedAt.IsZero() {
		vendor.CreatedAt = time.Now()
	}
	vendor.UpdatedAt = time.Now()

	vendorBytes, err = json.Marshal(vendor)
	if err != nil {
		return fmt.Errorf("failed to marshal vendor: %v", err)
	}

	return ctx.GetStub().PutState(vendor.VendorID, vendorBytes)
}

// Helper function to check if a slice contains a value
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
