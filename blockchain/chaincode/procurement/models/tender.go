package models

import (
	"fmt"
	"time"
)

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

// Validate checks if the tender has all required fields
func (t *Tender) Validate() error {
	if t.TenderID == "" || t.Title == "" || t.Budget <= 0 {
		return fmt.Errorf("missing required tender fields")
	}
	return nil
}
