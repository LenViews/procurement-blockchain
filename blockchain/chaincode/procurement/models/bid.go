package models

import (
	"fmt"
	"time"
)

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

// Validate checks if the bid has all required fields
func (b *Bid) Validate() error {
	if b.BidID == "" || b.TenderID == "" || b.VendorID == "" || b.Amount <= 0 {
		return fmt.Errorf("missing required bid fields")
	}
	return nil
}
