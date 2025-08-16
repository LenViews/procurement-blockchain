package models

import (
	"fmt"
	"time"
)

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

// Validate checks if the vendor has all required fields
func (v *Vendor) Validate() error {
	if v.VendorID == "" || v.KraPin == "" || v.CompanyName == "" {
		return fmt.Errorf("missing required vendor fields")
	}
	return nil
}
